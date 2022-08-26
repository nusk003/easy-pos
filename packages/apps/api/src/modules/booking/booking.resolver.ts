import { Action } from '@hm/sdk';
import { wrap } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/mongodb';
import { Injectable, Scope, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ConnectRole, GuestRole, HotelGuard } from '@src/modules/auth/guards';
import { Guest } from '@src/modules/guest/guest.entity';
import { GuestService } from '@src/modules/guest/guest.service';
import { IntegrationType } from '@src/modules/hotel/entities';
import { HotelService } from '@src/modules/hotel/hotel.service';
import { IntegrationsApaleoService } from '@src/modules/integrations/services/integrations-apaleo.service';
import { IntegrationsMewsService } from '@src/modules/integrations/services/integrations-mews.service';
import { UserRole } from '@src/modules/role/role.entity';
import { GuestSession, Ses, Session, UserSession } from '@src/utils/context';
import { BadRequestError, InvalidSessionError } from '@src/utils/errors';
import { SDKMutation, SDKQuery } from '@src/utils/gql';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import utc from 'dayjs/plugin/utc';
import _ from 'lodash';
import { ObjectId } from 'mongodb';
import { customAlphabet } from 'nanoid';
import { Booking, BookingStatus } from './booking.entity';
import { BookingsService } from './booking.service';
import {
  BookingAnalyticsArgs,
  BookingPaginationArgs,
  BookingPaginationSearchArgs,
  CreateBookingArgs,
  FindBookingArgs,
  UpdateBookingArgs,
  WhereBookingArgs,
} from './dto/booking.args';
import {
  BookingAnalyticsResponse,
  SearchBookingsResponse,
} from './dto/booking.responses';

dayjs.extend(utc);
dayjs.extend(advancedFormat);

@Resolver()
@Injectable({ scope: Scope.REQUEST })
export class BookingResolver {
  constructor(
    private readonly bookingService: BookingsService,
    private readonly guestService: GuestService,
    private readonly em: EntityManager,
    private readonly hotelService: HotelService,
    private readonly apaleoService: IntegrationsApaleoService,
    private readonly mewsService: IntegrationsMewsService
  ) {}

  @UseGuards(
    HotelGuard(
      UserRole.HotelMember,
      GuestRole.Identified,
      ConnectRole.AccessToken
    )
  )
  @Mutation(() => Booking, { nullable: true })
  @SDKMutation(() => Booking)
  async createBooking(
    @Args() createBookingArgs: CreateBookingArgs
  ): Promise<Booking | undefined> {
    let guest: Guest | undefined;

    const mainPartyGuest = createBookingArgs.party?.[0];

    const session = <GuestSession | UserSession>(
      this.bookingService.context.req.user
    );

    const hotel = await this.hotelService.findOne(session.hotel!);

    if ('guestId' in session) {
      guest = await this.guestService.findOne(session.guestId);
    } else {
      if (mainPartyGuest?.email) {
        try {
          guest = await this.guestService.findOneByEmail(mainPartyGuest.email);
          // eslint-disable-next-line no-empty
        } catch {}
      }

      if (!guest) {
        guest = new Guest();
        guest._id = new ObjectId();
        guest.hotels.add(hotel);
      }
    }

    let bookingReference;

    if (createBookingArgs.bookingReference) {
      bookingReference = createBookingArgs.bookingReference;
    } else {
      const nanoid = customAlphabet('123456789abcdefhjknopqrtuv', 6);
      bookingReference = nanoid();
    }

    const booking = new Booking();

    wrap(booking).assign(
      {
        _id: new ObjectId(),
        ...createBookingArgs,
        checkInDate: dayjs(createBookingArgs.checkInDate)
          .utc(true)
          .startOf('day')
          .toDate(),
        checkOutDate: dayjs(createBookingArgs.checkOutDate)
          .utc(true)
          .startOf('day')
          .toDate(),
        hotel: this.bookingService.hotelReference,
        group: this.bookingService.groupReference,
        bookingReference,
        guest,
      },
      { em: this.em }
    );

    if (mainPartyGuest) {
      guest = this.bookingService.mapBookingToGuest(booking!, guest!);
    }

    const marketplaceAppPMSID = hotel?.integrations?.marketplaceApps?.find(
      (app) => app.type === IntegrationType.PMS
    )?.id;

    if (marketplaceAppPMSID) {
      booking.pmsId = marketplaceAppPMSID.toString();
    }

    this.guestService.persist(guest);
    this.bookingService.persist(booking);
    await this.bookingService.flush();

    if (guest) {
      await this.guestService.indexOne(guest);
    }
    await this.bookingService.indexOne(booking);

    const message = {
      id: booking?.id,
      bookingReference,
    };

    const data = {
      action: createBookingArgs.dateSubmitted
        ? Action.SubmitBooking
        : Action.NewBooking,
      data: message,
    };

    await this.bookingService.triggerSendBookingReminders(booking!);

    try {
      if ('userId' in session) {
        await this.bookingService.guestAppPushNotifications.trigger({
          guest: booking!.guest,
          priority: 'high',
          title:
            booking?.hotel.bookingsSettings?.customization.checkInStart.title,
          body: booking?.hotel.bookingsSettings?.customization.checkInStart
            .message,
          data,
          lambda: false,
          sendEmail: hotel.bookingsSettings?.preArrival.email,
        });
      }

      await this.bookingService.cloudConsolePushNotifications.trigger({
        data,
      });

      // eslint-disable-next-line no-empty
    } catch {}

    await this.bookingService.webhookServiceClient.triggerWebhooks(
      booking,
      Action.NewBooking
    );

    return booking;
  }

  @UseGuards(
    HotelGuard(
      UserRole.HotelMember,
      GuestRole.Identified,
      ConnectRole.AccessToken
    )
  )
  @Query(() => [Booking], { name: 'bookings' })
  @SDKQuery(() => [Booking], { name: 'bookings' })
  async getBookings(
    @Ses() session: Session,
    @Args() bookingPaginationArgs: BookingPaginationArgs
  ): Promise<Booking[]> {
    const guestId =
      'guestId' in session ? session.guestId : bookingPaginationArgs.guestId;

    if (guestId) {
      return this.bookingService.find({
        guestId,
        sort: { dateCreated: -1 },
      });
    }

    return this.bookingService.find(bookingPaginationArgs);
  }

  @UseGuards(HotelGuard(GuestRole.Identified))
  @Query(() => Booking, { name: 'findBooking' })
  @SDKQuery(() => Booking, { name: 'findBooking' })
  async findBooking(
    @Args() findBookingArgs: FindBookingArgs
  ): Promise<Booking> {
    return this.bookingService.findBooking(findBookingArgs);
  }

  @UseGuards(HotelGuard(UserRole.HotelMember, ConnectRole.AccessToken))
  @Query(() => Booking, { name: 'booking' })
  @SDKQuery(() => Booking, { name: 'booking' })
  async getBooking(
    @Args() whereBookingArgs: WhereBookingArgs
  ): Promise<Booking> {
    return this.bookingService.findOne(whereBookingArgs.where.id);
  }

  @UseGuards(HotelGuard(UserRole.HotelMember))
  @Query(() => SearchBookingsResponse)
  @SDKQuery(() => SearchBookingsResponse)
  async searchBookings(
    @Args() bookingPaginationSearchArgs: BookingPaginationSearchArgs
  ): Promise<SearchBookingsResponse> {
    const {
      startCheckInDate,
      endCheckInDate,
      startCheckOutDate,
      endCheckOutDate,
      startDate,
      endDate,
    } = bookingPaginationSearchArgs;

    if (startCheckInDate && !endCheckInDate) {
      throw new BadRequestError(
        'The requested operation failed as no `endCheckInDate` parameter was provided. `endCheckInDate` must be provided if `startCheckInDate` is provided.'
      );
    }

    if (endCheckInDate && !startCheckInDate) {
      throw new BadRequestError(
        'The requested operation failed as no `startCheckInDate` parameter was provided. `startCheckInDate` must be provided if `endCheckInDate` is provided.'
      );
    }

    if (startCheckOutDate && !endCheckOutDate) {
      throw new BadRequestError(
        'The requested operation failed as no `endCheckOutDate` parameter was provided. `startCheckOutDate` must be provided if `startCheckInDate` is provided.'
      );
    }

    if (endCheckOutDate && !startCheckOutDate) {
      throw new BadRequestError(
        'The requested operation failed as no `startCheckOutDate` parameter was provided. `startCheckOutDate` must be provided if `endCheckOutDate` is provided.'
      );
    }

    if (startDate && !endDate) {
      throw new BadRequestError(
        'The requested operation failed as no `endDate` parameter was provided. `endDate` must be provided if `startDate` is provided.'
      );
    }

    if (endDate && !startDate) {
      throw new BadRequestError(
        'The requested operation failed as no `endDate` parameter was provided. `endDate` must be provided if `startDate` is provided.'
      );
    }

    if (startCheckInDate && startCheckOutDate) {
      throw new BadRequestError(
        'The requested operation failed as both `startCheckInDate` and `startCheckOutDate` parameters were provided. Only one of these parameters is permitted.'
      );
    }

    if (startCheckInDate && startDate) {
      throw new BadRequestError(
        'The requested operation failed as both `startCheckInDate` and `startDate` parameters were provided. Only one of these parameters is permitted.'
      );
    }

    if (startCheckOutDate && startDate) {
      throw new BadRequestError(
        'The requested operation failed as both `startCheckOutDate` and `startDate` parameters were provided. Only one of these parameters is permitted.'
      );
    }

    return this.bookingService.search(bookingPaginationSearchArgs);
  }

  @UseGuards(HotelGuard(UserRole.HotelMember))
  @Query(() => BookingAnalyticsResponse, { name: 'bookingAnalytics' })
  @SDKQuery(() => BookingAnalyticsResponse, { name: 'bookingAnalytics' })
  async getBookingAnalytics(
    @Args() bookingAnalyticsArgs: BookingAnalyticsArgs,
    @Ses() session: UserSession
  ): Promise<BookingAnalyticsResponse> {
    const hotelId = session.hotel!;

    if (!hotelId) {
      throw new InvalidSessionError('hotel');
    }

    const bookingAnalytics = await this.bookingService.getBookingAnalytics(
      bookingAnalyticsArgs
    );

    return bookingAnalytics;
  }

  @UseGuards(
    HotelGuard(
      UserRole.HotelMember,
      GuestRole.Identified,
      ConnectRole.AccessToken
    )
  )
  @Mutation(() => Booking)
  @SDKMutation(() => Booking)
  async updateBooking(
    @Args() updateBookingArgs: UpdateBookingArgs,
    @Ses() session: UserSession | GuestSession
  ): Promise<Booking> {
    const hotelId = session.hotel!;

    if (!hotelId) {
      throw new InvalidSessionError('hotel');
    }

    const booking = await this.bookingService.findOne(
      updateBookingArgs.where.id
    );
    const { status, ...updateBookingData } = <Booking>updateBookingArgs.data;

    const hotel = await this.hotelService.findOne(session.hotel!);
    await wrap(hotel.group).init();

    let mainGuest = booking.guest;

    if (booking.pmsId) {
      if (!updateBookingData.party?.[0]?.email) {
        throw new BadRequestError(
          'The requested operation failed as the main guest of the booking has no email.'
        );
      }

      if (booking.guest?.email !== updateBookingData.party[0].email) {
        mainGuest = await this.guestService.findOneByEmail(
          updateBookingData.party?.[0]?.email || ''
        );

        booking.guest = mainGuest;
      }
    }

    const oldBooking = { ...booking } as Booking;

    if (status === BookingStatus.Submitted) {
      updateBookingData.dateSubmitted = dayjs().utc().toDate();
    } else if (status === BookingStatus.Reviewed) {
      updateBookingData.dateReviewed = dayjs().utc().toDate();
    } else if (status === BookingStatus.CheckedIn) {
      updateBookingData.dateCheckedIn = dayjs().utc().toDate();
    }

    if (booking.pmsId) {
      if (hotel.group.integrations?.apaleo) {
        await this.apaleoService.updateBooking(
          booking,
          updateBookingData as Booking
        );
      } else if (hotel.integrations?.mews) {
        await this.mewsService.updateBooking(
          booking,
          updateBookingData as Booking
        );
      }
    }

    wrap(booking).assign(_.omit(updateBookingData, ['status']));

    const guest = this.bookingService.mapBookingToGuest(booking!, mainGuest!);

    if (guest) {
      this.guestService.persist(guest);
    }
    this.bookingService.persist(booking);

    await this.guestService.indexOne(guest);
    await this.bookingService.indexOne(booking);

    await this.bookingService.flush();

    const message = {
      id: booking.id,
      bookingReference: booking.bookingReference,
    };

    const data = {
      action:
        booking.status === BookingStatus.Submitted
          ? Action.SubmitBooking
          : Action.ReviewBooking,
      data: message,
    };

    try {
      if (
        booking.status === BookingStatus.Submitted &&
        oldBooking.status !== BookingStatus.Submitted
      ) {
        await this.bookingService.cloudConsolePushNotifications.trigger({
          data,
        });

        await this.bookingService.guestAppPushNotifications.trigger({
          guest: booking.guest,
          priority: 'high',
          title:
            booking.hotel.bookingsSettings?.customization.checkInReview.title,
          body: booking.hotel.bookingsSettings?.customization.checkInReview
            .message,
          data,
          lambda: false,
        });
      }

      if (
        booking.status === BookingStatus.Reviewed &&
        oldBooking.status !== BookingStatus.Reviewed
      ) {
        await this.bookingService.guestAppPushNotifications.trigger({
          guest: booking.guest,
          priority: 'high',
          title:
            booking.hotel.bookingsSettings?.customization.checkInSuccess.title,
          body: booking.hotel.bookingsSettings?.customization.checkInSuccess
            .message,
          data,
          lambda: false,
        });
      }
      // eslint-disable-next-line no-empty
    } catch {}

    await this.bookingService.webhookServiceClient.triggerWebhooks(
      booking,
      Action.UpdateBooking
    );

    return booking!;
  }
}
