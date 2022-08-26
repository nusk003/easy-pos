import { Action } from '@hm/sdk';
import { wrap } from '@mikro-orm/core';
import { EntityManager, EntityRepository } from '@mikro-orm/mongodb';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import { CONTEXT } from '@nestjs/graphql';
import {
  __apaleo_api_endpoint__,
  __apaleo_client_id__,
  __apaleo_client_secret__,
  __apaleo_identify_api_endpoint__,
  __apaleo_webhook_api_endpoint__,
  __api_url__,
  __cloud_console_url__,
} from '@src/constants';
import { ElasticClient } from '@src/libs/elasticsearch/elasticsearch.client';
import { NotificationPlatform } from '@src/microservices/send-push-notifications/dto/send-push-notification-args';
import { SendPushNotificationsClient } from '@src/microservices/send-push-notifications/send-push-notifications.client';
import { Booking } from '@src/modules/booking/booking.entity';
import { BookingsService } from '@src/modules/booking/booking.service';
import { Group, GroupIntegrationsApaleo } from '@src/modules/group/entities';
import { Guest } from '@src/modules/guest/guest.entity';
import { GuestService } from '@src/modules/guest/guest.service';
import {
  CustomFieldType,
  IntegrationProvider,
  IntegrationType,
} from '@src/modules/hotel/entities';
import { HotelService } from '@src/modules/hotel/hotel.service';
import {
  ApaleoAllPropertiesResponse,
  ApaleoBookingAPIBookingReservationsGetOptionalParams,
  ApaleoBookingAPIBookingReservationsGetResponse,
  ApaleoEventType,
  ApaleoExchangeAccessKeyAPIResponse,
  ApaleoSubscriptionPayload,
  ApaleoTopics,
  Operation,
  ReservationItemModel,
  WebhookJWTPayload,
} from '@src/modules/integrations/types';
import {
  CreateChargeModel,
  FolioListModel,
  KnownChargeModelServiceType,
} from '@src/modules/integrations/types/apaleo/apaleo-folio.types';
import { KnownServiceItemModelVatType } from '@src/modules/integrations/types/apaleo/apaleo-rate-plan.types';
import {
  mapApaleoGuestToGuest,
  mapApaleoReservationToBooking,
  mapBookingToApaleoReservation,
} from '@src/modules/integrations/utils';
import { Order } from '@src/modules/order/order.entity';
import { Context, UserSession } from '@src/utils/context';
import { InvalidSessionError } from '@src/utils/errors';
import { BaseService } from '@src/utils/service';
import axios from 'axios';
import { ObjectId } from 'mongodb';
import qs from 'querystring';
import { v4 as uuid } from 'uuid';

enum ServiceType {
  Webhook = 'webhook',
  Identify = 'identify',
  Api = 'api',
}

enum GrantType {
  AuthorizationCode = 'authorization_code',
  RefreshToken = 'refresh_token',
}

@Injectable({ scope: Scope.REQUEST })
export class IntegrationsApaleoService extends BaseService<Group> {
  private accessToken: string | undefined;
  private refreshToken: string | undefined;
  private webhookSession: WebhookJWTPayload;

  constructor(
    @Inject(CONTEXT)
    private readonly context: Context,
    private readonly em: EntityManager,
    @InjectRepository(Group)
    private readonly groupRepository: EntityRepository<Group>,
    private readonly hotelService: HotelService,
    private readonly bookingService: BookingsService,
    private readonly guestService: GuestService
  ) {
    super(groupRepository);
  }

  get session() {
    if (this.context.req.user) {
      return <UserSession>this.context.req.user;
    }

    return this.webhookSession;
  }

  setWebookSession(webhookSession: WebhookJWTPayload) {
    this.webhookSession = webhookSession;
  }

  async validateWebhookJWT(payload: WebhookJWTPayload) {
    const groupId = payload.group;

    if (!groupId) {
      throw new UnauthorizedException();
    }

    const group = await this.groupRepository.findOne(groupId);

    if (!group) {
      throw new UnauthorizedException();
    }

    this.setWebookSession(payload);
  }

  async getClient(serviceType: ServiceType) {
    if (!this.accessToken && serviceType !== ServiceType.Identify) {
      await this.authorize();
    }

    let baseURL;
    let headers: Record<string, any> = {
      Authorization: `Bearer ${this.accessToken}`,
    };

    if (serviceType === ServiceType.Identify) {
      baseURL = __apaleo_identify_api_endpoint__;
      headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
      };
    } else if (serviceType === ServiceType.Webhook) {
      baseURL = __apaleo_webhook_api_endpoint__;
    } else {
      baseURL = __apaleo_api_endpoint__;
    }

    return axios.create({ baseURL: baseURL, headers });
  }

  webhookClient() {
    return this.getClient(ServiceType.Webhook);
  }

  apiClient() {
    return this.getClient(ServiceType.Api);
  }

  identifyClient() {
    return this.getClient(ServiceType.Identify);
  }

  get webhookCallbackURL() {
    return `${__api_url__}/integrations/subscriptions`;
  }

  async authorize(authorizeCode?: string) {
    const group = await this.groupRepository.findOne({
      id: this.session?.group,
    });

    if (!group) {
      throw new InvalidSessionError('hotel');
    }

    if (!this.refreshToken) {
      this.refreshToken = group?.integrations?.apaleo?.refreshToken;
    }

    const client = await this.identifyClient();

    const response = await client.post<ApaleoExchangeAccessKeyAPIResponse>(
      '/connect/token',
      qs.stringify({
        client_id: __apaleo_client_id__,
        client_secret: __apaleo_client_secret__,
        ...(authorizeCode
          ? { code: authorizeCode }
          : { refresh_token: this.refreshToken }),
        grant_type: !authorizeCode
          ? GrantType.RefreshToken
          : GrantType.AuthorizationCode,
        redirect_uri: `${__cloud_console_url__}/manage/marketplace/apaleo`,
      })
    );

    if (response?.data) {
      this.accessToken = response.data.access_token;
      this.refreshToken = response.data.refresh_token;

      group.integrations = {
        ...group.integrations,
        apaleo: {
          ...(group.integrations?.apaleo
            ? { ...group.integrations.apaleo }
            : {
                provider: IntegrationProvider.Apaleo,
                type: IntegrationType.PMS,
                refreshToken: this.refreshToken,
              }),
          refreshToken: this.refreshToken,
        } as GroupIntegrationsApaleo,
      };

      this.persist(group);
    }

    return response?.data.refresh_token;
  }

  async createSubscription(
    token: string,
    topics: Array<ApaleoTopics>,
    hotels?: Array<string>
  ) {
    const client = await this.webhookClient();

    const response = await client.post('/v1/subscriptions', {
      topics,
      propertyIds: hotels,
      endpointUrl: this.webhookCallbackURL + '/' + token,
    });

    return response?.data;
  }

  async getSubscriptions() {
    const client = await this.webhookClient();

    const response = await client.get<{ id: string }[] | undefined>(
      '/v1/subscriptions'
    );

    if (response?.status !== 200) {
      return [];
    }

    return response.data;
  }

  async clearSubscriptions() {
    const client = await this.webhookClient();

    const subscriptions = await this.getSubscriptions();

    const deleteSubscriptions = subscriptions?.map(async ({ id }) => {
      await client.delete('/v1/subscriptions/' + id);
    });

    if (deleteSubscriptions) {
      await Promise.all(deleteSubscriptions);
    }
  }

  async getProperties() {
    const client = await this.apiClient();

    const response = await client.get<ApaleoAllPropertiesResponse>(
      '/inventory/v1/properties'
    );

    return response?.data.properties;
  }

  async getReservations(
    opts?: ApaleoBookingAPIBookingReservationsGetOptionalParams
  ) {
    const client = await this.apiClient();

    const response =
      await client.get<ApaleoBookingAPIBookingReservationsGetResponse>(
        '/booking/v1/reservations',
        {
          params: {
            propertyIds: opts?.propertyIds,
          },
        }
      );

    return response?.data.reservations;
  }

  async getFolios(reservationId: string) {
    const client = await this.apiClient();
    const response = await client.get<FolioListModel>('/finance/v1/folios', {
      params: { reservationIds: [reservationId] },
      paramsSerializer: (params) => qs.stringify(params),
    });
    return response.data.folios;
  }

  async getReservation(id: string) {
    const client = await this.apiClient();

    const response = await client.get<ReservationItemModel>(
      `/booking/v1/reservations/${id}`
    );

    return response?.data;
  }

  async updateReservation(id: string, data: Operation[]) {
    const client = await this.apiClient();
    const response = await client.patch(`/booking/v1/reservations/${id}`, data);
    return response?.data;
  }

  async checkInReservation(id: string) {
    const client = await this.apiClient();
    await client.put(`/booking/v1/reservation-actions/${id}/checkin`);
  }

  async assignUnit(id: string) {
    const client = await this.apiClient();
    await client.put(`/booking/v1/reservation-actions/${id}/assign-unit`);
  }

  async updateBooking(booking: Booking, updateBookingInput: Booking) {
    const isCheckedIn =
      !booking.dateCheckedIn && updateBookingInput.dateCheckedIn;

    wrap(booking).assign(updateBookingInput);

    if (isCheckedIn) {
      if (!booking.roomNumber) {
        await this.assignUnit(booking.pmsId);
      }

      await this.checkInReservation(booking.pmsId);
    }

    const { primaryGuest, additionalGuests } =
      mapBookingToApaleoReservation(booking);

    let reservationComment = '';

    booking.bookingDetails?.toggleQuestion.map(
      ({ title, type, result, toggle }) => {
        reservationComment += `${title}: ${
          type === CustomFieldType.String ? result : toggle ? 'Yes' : 'No'
        }\n`;
      }
    );

    const operations: Operation[] = [
      ...(booking.purposeOfStay
        ? [
            {
              op: 'replace',
              path: '/travelPurpose',
              value: booking.purposeOfStay,
            },
          ]
        : []),
      {
        op: 'replace',
        path: '/comment',
        value: reservationComment,
      },
      {
        op: 'replace',
        path: '/primaryGuest',
        value: primaryGuest,
      },
      {
        op: 'replace',
        path: '/additionalGuests',
        value: additionalGuests,
      },
    ];

    await this.updateReservation(booking.pmsId, operations);
  }

  async addChargeToFolio(folioId: string, charge: CreateChargeModel) {
    const client = await this.apiClient();
    await client.post(`/finance/v1/folio-actions/${folioId}/charges`, charge);
  }

  async addOrderToReservation(booking: Booking, order: Order) {
    const folios = await this.getFolios(booking.pmsId);
    const folio = folios?.[0];
    await this.addChargeToFolio(folio.id, {
      name: order.space.name,
      amount: {
        amount: order.totalPrice,
        currency: folio.balance.currency,
      },
      serviceType: KnownChargeModelServiceType.FoodAndBeverages,
      vatType: KnownServiceItemModelVatType.Null,
      receipt: order.orderReference,
    });
  }

  async handleWebhook({
    propertyId,
    topic,
    data,
    type,
  }: ApaleoSubscriptionPayload) {
    if (type === 'healthcheck') {
      return;
    }

    const hotel = await this.hotelService.findByPMSIntegrationID(propertyId);

    if (!hotel) {
      return;
    }

    const group = hotel.group;

    const entityId = data?.entityId;

    if (topic === ApaleoTopics.Reservation) {
      const reservation = await this.getReservation(entityId);

      if (!reservation) {
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      }

      let booking: Booking | undefined | null;
      let guest: Guest | undefined | null;

      if (
        type === ApaleoEventType.Changed ||
        type === ApaleoEventType.UnitAssigned ||
        type === ApaleoEventType.UnitUnassigned ||
        type === ApaleoEventType.CheckedIn ||
        type === ApaleoEventType.Amended ||
        type === ApaleoEventType.Canceled
      ) {
        booking = await this.bookingService.findByPMSIntegrationID(entityId);
      } else if (type === ApaleoEventType.Created) {
        booking = new Booking();
        booking._id = new ObjectId();
      } else if (type === ApaleoEventType.Deleted) {
        try {
          booking = await this.bookingService.findByPMSIntegrationID(entityId);
          await this.bookingService.delete(booking.id);
          // eslint-disable-next-line no-empty
        } catch {}

        return;
      } else {
        return;
      }
      const { primaryGuest } = reservation;

      if (primaryGuest) {
        primaryGuest.email = primaryGuest.email?.toLowerCase();
      }

      if (booking.guest) {
        if (primaryGuest?.email) {
          try {
            const existingGuest = await this.guestService.findOneByEmail(
              primaryGuest.email
            );
            booking.guest = existingGuest;
            guest = booking.guest;
          } catch {
            booking.guest.email = primaryGuest?.email;
            guest = booking.guest;
          }
        } else {
          guest = booking.guest;
        }
      } else if (primaryGuest?.email) {
        try {
          guest = await this.guestService.findOneByEmail(primaryGuest.email);
          // eslint-disable-next-line no-empty
        } catch {}
      }

      if (!guest) {
        guest = new Guest();
        guest._id = new ObjectId();
        guest.deviceId = uuid();
        guest.hotels.add(hotel);
      }

      if (type === ApaleoEventType.UnitUnassigned) {
        delete booking?.roomNumber;
      }

      wrap(guest).assign(
        {
          ...this.bookingService.mapBookingToGuest(booking!, guest!),
          ...mapApaleoGuestToGuest(primaryGuest!),
        },
        { em: this.em }
      );

      wrap(booking).assign(
        {
          ...mapApaleoReservationToBooking(reservation),
          hotel,
          group,
          guest,
        },
        { em: this.em }
      );

      this.em.persist(guest);
      this.em.persist(booking);

      const esClient = new ElasticClient();
      await esClient.indexOne(Booking, booking!);
      await esClient.indexOne(Guest, guest!);

      await this.em.flush();

      if (type === ApaleoEventType.Created) {
        const guestAppPushNotifications = new SendPushNotificationsClient(
          NotificationPlatform.GuestApp,
          {
            channelId: 'booking-notifications',
            lambda: false,
            hotelId: hotel.id,
          }
        );

        const cloudConsolePushNotifications = new SendPushNotificationsClient(
          NotificationPlatform.CloudConsole,
          {
            hotelId: hotel.id,
          }
        );

        const message = {
          id: booking.id,
          bookingReference: booking.bookingReference,
        };

        const data = { action: Action.NewBooking, data: message };

        try {
          await cloudConsolePushNotifications.trigger({
            data,
          });

          await guestAppPushNotifications.trigger({
            guest,
            priority: 'high',
            title: hotel.bookingsSettings?.customization.checkInStart.title,
            body: hotel.bookingsSettings?.customization.checkInStart.message,
            data,
            lambda: false,
            sendEmail: hotel.bookingsSettings?.preArrival.email,
          });
          // eslint-disable-next-line no-empty
        } catch {}
      }
    }
  }
}
