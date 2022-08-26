import { Action } from '@hm/sdk';
import { wrap } from '@mikro-orm/core';
import { EntityManager, EntityRepository } from '@mikro-orm/mongodb';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  Inject,
  Injectable,
  NotFoundException,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import { CONTEXT } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import {
  __dev__,
  __mews_platform_address__,
  __mews_stream_address__,
  __stg__,
} from '@src/constants';
import { ElasticClient } from '@src/libs/elasticsearch/elasticsearch.client';
import { NotificationPlatform } from '@src/microservices/send-push-notifications/dto/send-push-notification-args';
import { SendPushNotificationsClient } from '@src/microservices/send-push-notifications/send-push-notifications.client';
import { Booking } from '@src/modules/booking/booking.entity';
import { BookingsService } from '@src/modules/booking/booking.service';
import { Guest } from '@src/modules/guest/guest.entity';
import { GuestService } from '@src/modules/guest/guest.service';
import {
  Hotel,
  IntegrationProvider,
  IntegrationType,
} from '@src/modules/hotel/entities';
import {
  MewsAddCustomerResponse,
  MewsAddOrderToServiceRequestBody,
  MewsCustomer,
  MewsGetAllCustomersResponse,
  MewsGetAllReservationsResponse,
  MewsGetAllServicesResponse,
  MewsResourceState,
  MewsServiceType,
  MewsSubscriptionPayload,
  MewsUpdateCustomerResponse,
  MewsUpdateResourceArgs,
  WebhookJWTPayload,
} from '@src/modules/integrations/types';
import {
  mapMewsCustomerToGuest,
  mapMewsReservationToBooking,
  mapPartyToMewsCustomer,
} from '@src/modules/integrations/utils';
import { Order } from '@src/modules/order/order.entity';
import { Context, UserSession } from '@src/utils/context';
import {
  AuthenticationError,
  BadRequestError,
  InvalidSessionError,
} from '@src/utils/errors';
import { BaseService } from '@src/utils/service';
import axios from 'axios';
import _ from 'lodash';
import { ObjectId } from 'mongodb';

@Injectable({ scope: Scope.REQUEST })
export class IntegrationsMewsService extends BaseService<Hotel> {
  private accessToken: string | undefined;
  private clientToken: string | undefined;
  private webhookSession: WebhookJWTPayload | undefined;

  constructor(
    @InjectRepository(Hotel)
    private readonly hotelRepository: EntityRepository<Hotel>,
    private readonly guestService: GuestService,
    private readonly bookingService: BookingsService,
    private readonly jwtService: JwtService,
    private readonly em: EntityManager,
    @Inject(CONTEXT) private readonly context: Context
  ) {
    super(hotelRepository);
  }

  get session() {
    if (this.context.req.user) return <UserSession>this.context.req.user;
    return this.webhookSession;
  }

  setWebookSession(webhookSession: WebhookJWTPayload) {
    this.webhookSession = webhookSession;
  }

  async validateWebhookJWT(payload: WebhookJWTPayload) {
    const hotelId = payload.hotel;

    if (!hotelId) {
      throw new UnauthorizedException();
    }

    const hotel = await this.hotelRepository.findOne(hotelId);

    if (!hotel) {
      throw new UnauthorizedException();
    }

    this.setWebookSession(payload);
  }

  async client<T>(url: string, data?: Record<string, any>) {
    if (!this.accessToken || !this.clientToken) {
      await this.findTokens();
    }

    return await axios.post<T>(
      url,
      {
        ClientToken: this.clientToken,
        AccessToken: this.accessToken,
        Client: __dev__
          ? 'Hotel Manager 1.0 (Development)'
          : 'Hotel Manager 1.0',
        ...data,
      },
      {
        baseURL: `${__mews_platform_address__}/api/connector/v1`,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  get mewsStreamClient() {
    if (!this.session) {
      throw new InvalidSessionError('hotel');
    }

    return axios.create({
      baseURL: __mews_stream_address__,
      headers: {
        Authorization: `Bearer ${this.jwtService.sign({
          hotel: this.session.hotel,
          provider: IntegrationProvider.Mews,
        })}`,
      },
    });
  }

  async findTokens() {
    if (!this.session) {
      throw new InvalidSessionError('hotel');
    }

    const hotel = await this.hotelRepository.findOne({
      id: this.session.hotel,
    });

    if (!hotel) {
      throw new InvalidSessionError('hotel');
    }

    this.accessToken = hotel?.integrations?.mews?.accessToken;
    this.clientToken = hotel?.integrations?.mews?.clientToken;

    if (!this.accessToken || !this.clientToken) {
      throw new UnauthorizedException();
    }
  }

  async authorize(accessToken: string, clientToken: string) {
    const hotel = await this.hotelRepository.findOne(this.session?.hotel || '');

    if (!hotel) {
      throw new InvalidSessionError('hotel');
    }

    this.accessToken = accessToken;
    this.clientToken = clientToken;

    const {
      Enterprise: { Id: pmsId },
    } = await this.getConfiguration();
    const services = await this.getServices();
    const orderableServiceId = services.find(
      ({ Type }) => Type === MewsServiceType.Orderable
    )?.Id;
    const bookableServiceId = services.find(
      ({ Type }) => Type === MewsServiceType.Reservable
    )?.Id;

    if (orderableServiceId && bookableServiceId && pmsId) {
      hotel.pmsSettings = {
        pmsId,
        mewsSettings: { orderableServiceId, bookableServiceId },
      };
    }

    hotel.integrations = {
      ...hotel.integrations,
      mews: {
        provider: IntegrationProvider.Mews,
        type: IntegrationType.PMS,
        accessToken,
        clientToken,
      },
    };

    this.persist(hotel);
  }

  async getConfiguration() {
    try {
      const { data } = await this.client<{ Enterprise: { Id: string } }>(
        '/configuration/get'
      );
      return data;
    } catch {
      throw new AuthenticationError();
    }
  }

  async getServices() {
    const response = await this.client<MewsGetAllServicesResponse>(
      '/services/getAll'
    );

    return response.data.Services;
  }

  async getReservations(reservationIds: string[]) {
    if (!this.session) {
      throw new InvalidSessionError('hotel');
    }

    const hotel = await this.hotelRepository.findOne({
      id: this.session.hotel,
    });

    const response = await this.client<MewsGetAllReservationsResponse>(
      '/reservations/getAll',
      {
        ServiceIds: [hotel?.pmsSettings?.mewsSettings?.bookableServiceId],
        ReservationIds: reservationIds,
        Extent: {
          Resources: true,
          Customers: true,
          Reservations: true,
          ResourceCategoryAssignments: true,
          ResourceCategories: true,
        },
      }
    );

    return response.data;
  }

  async getResource(reservationId: string) {
    const { Reservations, Resources } = await this.getReservations([
      reservationId,
    ]);
    const { AssignedResourceId } = Reservations?.[0];
    const resource = Resources?.find(({ Id }) => Id === AssignedResourceId);
    return resource;
  }

  async addOrderToReservation(order: Order) {
    const hotelId = this.session?.hotel;

    if (!hotelId) {
      throw new InvalidSessionError('hotel');
    }

    const hotel = await this.hotelRepository.findOne(hotelId);

    const noItems = order.items.reduce(
      (total, item) => total + item.quantity,
      0
    );

    const extraAmount = (order.totalPrice - order.subtotal) / noItems;

    const body: MewsAddOrderToServiceRequestBody = {
      ServiceId: hotel?.pmsSettings?.mewsSettings?.orderableServiceId || '',
      CustomerId: order?.guest?.pmsId || '',
      Items: order.items.map(({ name, quantity, totalPrice }) => {
        const itemPrice =
          totalPrice === 0 ? 0 : totalPrice / quantity + extraAmount;

        return {
          Name: name,
          UnitCount: quantity,
          UnitAmount: {
            Currency: hotel?.currencyCode || '',
            NetValue: itemPrice,
          },
        };
      }),
    };

    await this.client('/orders/add', body);
  }

  async connectMewsStream() {
    await this.mewsStreamClient.post('/add-client');
  }

  async disconnectMewsStream() {
    await this.mewsStreamClient.post('/delete-client');
  }

  async addCompanionToReservation({
    customerId,
    reservationId,
  }: {
    customerId: string;
    reservationId: string;
  }) {
    const response = await this.client('/reservations/addCompanion', {
      CustomerId: customerId,
      ReservationId: reservationId,
    });

    return response?.data;
  }

  async checkInReservation(reservationId: string) {
    const response = await this.client('/reservations/start', {
      ReservationId: reservationId,
    });
    return response?.data;
  }

  async addCustomer(addCustomerArgs: Omit<MewsCustomer, 'Id'>) {
    const response = await this.client<MewsAddCustomerResponse>(
      '/customers/add',
      {
        OverwriteExisting: true,
        ...addCustomerArgs,
      }
    );

    return response?.data;
  }

  async getCustomers(emails: string[]) {
    const response = await this.client<MewsGetAllCustomersResponse>(
      '/customers/getAll',
      {
        Emails: emails,
      }
    );

    return response?.data;
  }

  async updateCustomer(updateCustomerArgs: Omit<MewsCustomer, 'Id'>) {
    const response = await this.client<MewsUpdateCustomerResponse>(
      '/customers/update',
      updateCustomerArgs
    );

    return response?.data;
  }

  async updateReservationCustomer(updateReservationCustomerArgs: {
    CustomerId: string;
    ReservationId: string;
  }) {
    await this.client(
      '/reservations/updateCustomer',
      updateReservationCustomerArgs
    );
  }

  async deleteReservationCompanion(deleteReservationCompanionArgs: {
    CustomerId: string;
    ReservationId: string;
  }) {
    await this.client(
      '/reservations/deleteCompanion',
      deleteReservationCompanionArgs
    );
  }

  async updateResource(mewsUpdateResourceArgs: MewsUpdateResourceArgs) {
    await this.client('resources/update', {
      ResourceUpdates: [mewsUpdateResourceArgs],
    });
  }

  async updateBooking(booking: Booking, updateBookingInput: Booking) {
    const isCheckedIn =
      !booking.dateCheckedIn && updateBookingInput.dateCheckedIn;

    wrap(booking).assign(updateBookingInput);

    if (isCheckedIn) {
      const resource = await this.getResource(booking.pmsId);
      if (resource) {
        if (resource?.State !== MewsResourceState.Inspected) {
          throw new BadRequestError(
            'Mews: The request operation failed as the space has not been inspected'
          );
        }
      } else {
        throw new BadRequestError(
          'Mews: The request operation failed as no space has been assigned'
        );
      }

      await this.checkInReservation(booking.pmsId);
    }

    const response = await this.getReservations([booking.pmsId]);
    let Reservations = response.Reservations;
    const mewsReservationCustomerId = Reservations[0].CustomerId;

    const { Customers: mewsCustomers } = await this.getCustomers(
      booking.party?.map(({ email }) => email || '') || []
    );

    const customers = mapPartyToMewsCustomer(booking, mewsCustomers);

    for (const customer of customers) {
      let customerId: string;
      if (customer.Id) {
        customerId = customer.Id;

        const updateCustomerBody = _.omit(customer, ['Id']) as Omit<
          MewsCustomer,
          'Id'
        > & {
          CustomerId: string;
        };

        updateCustomerBody.CustomerId = customerId;

        await this.updateCustomer(updateCustomerBody);
      } else {
        const addCustomerBody = _.omit(customer, ['Id']) as Omit<
          MewsCustomer,
          'Id'
        > & {
          CustomerId: string;
        };

        const addCustomerResponse = await this.addCustomer(
          _.omit(addCustomerBody)
        );

        customerId = addCustomerResponse.Id;
      }

      if (booking.party) {
        booking.party[_.indexOf(customers, customer)].pmsId = customerId;
      }
    }

    wrap(booking.guest).assign({ pmsId: booking?.party?.[0].pmsId });

    if (
      booking.guest?.pmsId &&
      mewsReservationCustomerId !== booking.guest.pmsId
    ) {
      await this.deleteReservationCompanion({
        CustomerId: mewsReservationCustomerId,
        ReservationId: booking.pmsId,
      });
      await this.updateReservationCustomer({
        ReservationId: booking.pmsId,
        CustomerId: booking.guest.pmsId,
      });
    }

    Reservations = (await this.getReservations([booking.pmsId])).Reservations;

    for (const { pmsId } of booking?.party || []) {
      if (
        pmsId &&
        !Reservations[0].CompanionIds.find(
          (companionId) => companionId === pmsId
        )
      ) {
        await this.addCompanionToReservation({
          customerId: pmsId,
          reservationId: booking.pmsId,
        });
      }
    }
  }

  async handleWebhook({ Events }: MewsSubscriptionPayload) {
    const hotelId = this.session?.hotel;

    if (!hotelId) {
      throw new UnauthorizedException('Invalid session');
    }

    const hotel = await this.hotelRepository.findOne(hotelId, {
      populate: ['group'],
    });

    if (!hotel) {
      throw new NotFoundException(
        `The requested operation falied as \`hotel\` had no matching parameter on field \`id\` for value \`${hotelId}\`.`
      );
    }

    const {
      Reservations,
      Customers,
      Resources,
      ResourceCategories,
      ResourceCategoryAssignments,
    } = await this.getReservations(Events?.map(({ Id }) => Id));

    const guests: Guest[] = [];
    const bookings: Booking[] = [];
    const newBookings: Booking[] = [];

    for (const reservation of Reservations) {
      let guest: Guest | null | undefined;
      let booking: Booking | null | undefined;

      const { Id: reservationId, CustomerId: customerId } = reservation;

      const customer = Customers.find(({ Id: id }) => id === customerId)!;

      const emailMews = customer.Email;

      const isHMGuest = emailMews?.split('@')?.[1] === 'hotelmanager.co';
      if (!emailMews || ((__stg__ || __dev__) && !isHMGuest)) {
        continue;
      }

      try {
        guest = await this.guestService.findOneByEmail(emailMews);
      } catch {
        guest = guests.find(({ email }) => email === emailMews);
      }

      if (!guest) {
        guest = new Guest();
        guest._id = new ObjectId();
        guest.hotels.add(hotel);
      }

      wrap(guest).assign(
        {
          ...this.bookingService.mapBookingToGuest(booking!, guest!),
          ...mapMewsCustomerToGuest(customer),
        },
        { em: this.em }
      );

      const guestIndex = guests.findIndex(
        ({ email }) => email === guest?.email
      );

      if (guestIndex > -1) {
        guests[guestIndex] = <Guest>guest;
      } else {
        guests.push(<Guest>guest);
      }

      let isNewBooking = false;

      try {
        booking = await this.bookingService.findByPMSIntegrationID(
          reservationId
        );
      } catch {
        booking = bookings.find(({ pmsId }) => pmsId === reservationId);
      }

      if (!booking) {
        booking = new Booking();
        booking._id = new ObjectId();
        isNewBooking = true;
      }

      const updatedBooking = mapMewsReservationToBooking({
        Reservation: reservation,
        Customers,
        Resources,
        ResourceCategoryAssignments,
        ResourceCategories,
      });

      wrap(booking).assign(
        {
          ...updatedBooking,
          party:
            updatedBooking.party.length > 0
              ? updatedBooking.party.map((updatedParty, index) =>
                  booking?.party?.[index]
                    ? { ...booking.party[index], ...updatedParty }
                    : updatedParty
                )
              : booking.party,

          hotel,
          group: hotel.group,
          guest,
        },
        { em: this.em }
      );

      const bookingIndex = bookings.findIndex(({ id }) => id === booking?.id);

      if (bookingIndex > -1) {
        bookings[bookingIndex] = booking;
      } else {
        bookings.push(booking);
      }

      if (isNewBooking) {
        newBookings.push(booking);
      }
    }

    const esClient = new ElasticClient();

    await this.em.transactional(async (em) => {
      bookings.forEach((booking) => {
        em.persist(booking);
      });

      guests.forEach((guest) => {
        em.persist(guest);
      });

      if (bookings.length) {
        await esClient.indexMany(Booking, bookings);
      }

      if (guests.length) {
        await esClient.indexMany(Guest, guests);
      }
    });

    const sendNotifications = newBookings.map(async (newBooking) => {
      const message = {
        id: newBooking.id,
        bookingReference: newBooking.bookingReference,
      };

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

      const data = { action: Action.NewBooking, data: message };

      await cloudConsolePushNotifications.trigger({
        data,
      });

      const guest = newBooking.guest;

      if (guest) {
        await guestAppPushNotifications.trigger({
          guest,
          priority: 'high',
          title: hotel.bookingsSettings?.customization.checkInStart.title,
          body: hotel.bookingsSettings?.customization.checkInStart.message,
          data,
          lambda: false,
          sendEmail: hotel.bookingsSettings?.preArrival.email,
        });
      }
    });

    try {
      await Promise.all(sendNotifications);
      // eslint-disable-next-line no-empty
    } catch {}
  }
}
