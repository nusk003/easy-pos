import { FilterQuery, wrap } from '@mikro-orm/core';
import { EntityManager, EntityRepository } from '@mikro-orm/mongodb';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { CONTEXT } from '@nestjs/graphql';
import { ElasticsearchService } from '@src/libs/elasticsearch';
import { SendBookingRemindersClient } from '@src/microservices/send-booking-reminders/send-booking-reminders.client';
import { WebhookServiceClient } from '@src/microservices/webhook-service/webhook-service.client';
import { ReminderDurationType } from '@src/modules//hotel/entities';
import { Guest } from '@src/modules/guest/guest.entity';
import { Context } from '@src/utils/context/context.type';
import { PaginationSort } from '@src/utils/dto';
import {
  BadRequestError,
  InvalidSessionError,
  NotFoundError,
} from '@src/utils/errors';
import { FindOptions, TenantService } from '@src/utils/service';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Booking, BookingStatus } from './booking.entity';
import {
  BookingAnalyticsArgs,
  BookingPaginationSearchArgs,
  FindBookingArgs,
  UpdateBookingArgs,
} from './dto/booking.args';
import { BookingAnalyticsResponse } from './dto/booking.responses';

dayjs.extend(utc);

interface FindBookingsOptions extends FindOptions<Booking> {
  guestId?: string;
}

@Injectable({ scope: Scope.REQUEST })
export class BookingsService extends TenantService<Booking> {
  private sendBookingRemindersClient = new SendBookingRemindersClient();

  webhookServiceClient = new WebhookServiceClient();

  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: EntityRepository<Booking>,
    @Inject(CONTEXT) context: Context,
    private readonly elasticsearch: ElasticsearchService,
    em: EntityManager
  ) {
    super(bookingRepository, context, {
      guestAppPushNotifications: { channelId: 'booking-notifications' },
      em,
    });
  }

  async find(opts?: FindBookingsOptions) {
    if (!this.hotel) {
      throw new InvalidSessionError('hotel');
    }

    const query: FilterQuery<Booking> = { hotel: this.hotel };

    if (opts?.guestId) {
      query.guest = opts?.guestId;
    }

    const bookings = await this.bookingRepository.find(query, {
      populate: opts?.populate,
      orderBy: this.createSortArg(opts?.sort),
      limit: opts?.limit,
      offset: opts?.offset,
    });

    return bookings;
  }

  async findBookingsByGuest<P extends string>(
    guestId: string,
    opts?: FindOptions<Booking, P>
  ) {
    const bookings = await this.bookingRepository.find(
      { hotel: this.hotel, guest: guestId },
      {
        populate: [],
        orderBy: this.createSortArg(opts?.sort),
        limit: opts?.limit,
        offset: opts?.offset,
      }
    );
    return bookings;
  }

  async indexOne(booking: Booking) {
    return this.elasticsearch.indexOne(Booking, booking);
  }

  async indexMany(bookings: Booking[]) {
    return this.elasticsearch.indexMany(Booking, bookings);
  }

  async getBookingAnalytics({
    startDate,
    endDate,
  }: BookingAnalyticsArgs): Promise<BookingAnalyticsResponse> {
    const dateConstraints = {
      $and: [
        {
          checkInDate: {
            $gte: dayjs(startDate).utc(true).startOf('day').toDate(),
          },
        },
        {
          checkInDate: {
            $lte: dayjs(endDate).utc(true).startOf('day').toDate(),
          },
        },
      ],
    };

    const noArrivals = await this.bookingRepository.count({
      hotel: this.hotel,
      ...(startDate && endDate ? dateConstraints : {}),
    });

    const noDepartures = await this.bookingRepository.count({
      hotel: this.hotel,
      ...(startDate && endDate ? dateConstraints : {}),
    });

    const noSubmittedBookings = await this.bookingRepository.count({
      hotel: this.hotel,
      $and: [
        {
          dateSubmitted: {
            $ne: null,
          },
        },
        {
          dateReviewed: {
            $eq: null,
          },
        },
        {
          dateCheckedIn: {
            $eq: null,
          },
        },
      ],
    });

    return {
      noArrivals,
      noDepartures,
      noSubmittedBookings,
    };
  }

  async findOne(id: string) {
    if (!this.hotel) {
      throw new InvalidSessionError('hotel');
    }

    const booking = await this.bookingRepository.findOne(id, {
      populate: ['guest'],
    });

    if (!booking) {
      throw new NotFoundError(Booking, { id });
    }

    return booking;
  }

  async findByPMSIntegrationID(pmsId: string) {
    const booking = await this.bookingRepository.findOne(
      { pmsId },
      { populate: ['guest'] }
    );

    if (!booking) {
      throw new NotFoundError(Booking, { pmsId });
    }

    return booking;
  }

  async getCurrentBooking(guestId: string) {
    const bookings = await this.bookingRepository.find(
      {
        guest: guestId,
        hotel: this.hotel,
        dateCheckedIn: { $ne: null },
      },
      { orderBy: { dateCheckedIn: -1 } }
    );

    if (!bookings.length) {
      return null;
    }

    return bookings?.[0];
  }

  async search(args: BookingPaginationSearchArgs) {
    const { query, limit, offset, sort, status } = args;

    const startDate = args.startDate
      ? dayjs(args.startDate).utc(true).startOf('day').format('YYYY-MM-DD')
      : undefined;

    const endDate = args.endDate
      ? dayjs(args.endDate).utc(true).startOf('day').format('YYYY-MM-DD')
      : undefined;

    const startCheckInDate = args.startCheckInDate
      ? dayjs(args.startCheckInDate)
          .utc(true)
          .startOf('day')
          .format('YYYY-MM-DD')
      : undefined;

    const endCheckInDate = args.endCheckInDate
      ? dayjs(args.endCheckInDate).utc(true).startOf('day').format('YYYY-MM-DD')
      : undefined;

    const startCheckOutDate = args.startCheckOutDate
      ? dayjs(args.startCheckOutDate)
          .utc(true)
          .startOf('day')
          .format('YYYY-MM-DD')
      : undefined;

    const endCheckOutDate = args.endCheckOutDate
      ? dayjs(args.endCheckOutDate)
          .utc(true)
          .startOf('day')
          .format('YYYY-MM-DD')
      : undefined;

    const response = await this.elasticsearch.searchCollection(Booking, {
      query: {
        bool: {
          must: [
            query
              ? {
                  query_string: {
                    query,
                  },
                }
              : {
                  match_all: {},
                },
            status === BookingStatus.Submitted
              ? {
                  exists: {
                    field: 'dateSubmitted',
                  },
                }
              : undefined,
          ].filter(Boolean),
          must_not: [
            status === BookingStatus.Submitted
              ? {
                  exists: {
                    field: 'dateReviewed',
                  },
                }
              : undefined,
            status === BookingStatus.Submitted
              ? {
                  exists: {
                    field: 'dateCheckedIn',
                  },
                }
              : undefined,
          ].filter(Boolean),
          filter:
            startCheckInDate && endCheckInDate
              ? {
                  bool: {
                    must: {
                      range: {
                        checkInDate: {
                          gte: startCheckInDate,
                          lt: endCheckInDate,
                        },
                      },
                    },
                  },
                }
              : startCheckOutDate && endCheckOutDate
              ? {
                  bool: {
                    must: {
                      range: {
                        checkOutDate: {
                          gte: startCheckOutDate,
                          lt: endCheckOutDate,
                        },
                      },
                    },
                  },
                }
              : startDate && endDate
              ? {
                  bool: {
                    should: [
                      {
                        range: {
                          checkInDate: {
                            gte: startDate,
                            lt: endDate,
                          },
                        },
                      },
                      {
                        range: {
                          checkOutDate: {
                            gte: startDate,
                            lt: endDate,
                          },
                        },
                      },
                    ],
                  },
                }
              : [],
        },
      },
      sort: sort
        ? sort
        : startCheckInDate
        ? {
            checkInDate: PaginationSort.Desc,
          }
        : startCheckOutDate
        ? {
            checkOutDate: PaginationSort.Desc,
          }
        : undefined,
      limit,
      offset,
    });

    const bookings = response.data.map((booking) => {
      booking.party = booking.party?.map((guest) => ({
        ...guest,
        dateOfBirth: guest.dateOfBirth
          ? new Date(guest.dateOfBirth)
          : undefined,
      }));

      return booking;
    });

    return { ...response, data: bookings };
  }

  async triggerSendBookingReminders({ id }: Booking) {
    const booking = await this.bookingRepository.findOne(id, {
      populate: ['hotel'],
    });

    if (!booking) return;

    const hotel = booking.hotel;

    const checkInTime =
      booking.estimatedTimeOfArrival || hotel.bookingsSettings?.checkInTime;

    const time = checkInTime?.split(':');

    const hours = parseInt(time?.[0] || '00');
    const minutes = parseInt(time?.[1] || '00');

    const checkInDateTime = dayjs(booking.checkInDate)
      .utc(true)
      .startOf('day')
      .add(hours, 'hours')
      .add(minutes, 'minutes');

    const notifications = hotel.bookingsSettings?.preArrival.notifications;

    const stepFunctionPromises = notifications?.reminders?.map(
      async ({ value, duration }) => {
        let beforeCheckInSeconds = 0;
        if (duration === ReminderDurationType.Days) {
          beforeCheckInSeconds = value * 24 * 60 * 60 * 60;
        } else if (duration === ReminderDurationType.Hours) {
          beforeCheckInSeconds = value * 60 * 60;
        } else if (duration === ReminderDurationType.Minutes) {
          beforeCheckInSeconds = value * 60;
        } else {
          return;
        }

        const reminderDateTime = checkInDateTime.subtract(
          beforeCheckInSeconds,
          'seconds'
        );
        const waitDuration = reminderDateTime.diff(
          new Date(),
          'seconds',
          false
        );

        if (waitDuration > 0)
          await this.sendBookingRemindersClient.trigger({
            booking,
            waitDuration,
          });
      }
    );
    if (stepFunctionPromises) await Promise.all(stepFunctionPromises);
  }

  async update({ data, where }: UpdateBookingArgs) {
    const booking = await this.findOne(where.id);
    wrap(booking).assign(data);
    this.persist(booking!);
    return booking;
  }

  mapBookingToGuest(booking: Booking, guest: Guest) {
    if (!booking) {
      return guest;
    }

    const mainPartyGuest = booking.party?.[0];

    if (!mainPartyGuest || !guest) {
      return guest;
    }

    const dateOfBirth = mainPartyGuest.dateOfBirth || guest.dateOfBirth;

    guest.email = mainPartyGuest.email || guest.email;
    guest.firstName = mainPartyGuest.firstName || guest.firstName;
    guest.lastName = mainPartyGuest.lastName || guest.lastName;
    if (dateOfBirth) guest.dateOfBirth = dateOfBirth;
    guest.dietaryRequirements =
      mainPartyGuest.dietaryRequirements || guest.dietaryRequirements;
    guest.company = mainPartyGuest.company || guest.company;
    guest.job = mainPartyGuest.job || guest.job;
    guest.mobile = mainPartyGuest.mobile || guest.mobile;
    guest.mobileCountryCode =
      mainPartyGuest.mobileCountryCode || guest.mobileCountryCode;
    guest.countryOfResidence =
      mainPartyGuest.countryOfResidence || guest.countryOfResidence;
    guest.address = mainPartyGuest.address || guest.address;
    guest.nationality = mainPartyGuest.nationality || guest.nationality;
    guest.passportNumber =
      mainPartyGuest.passportNumber || guest.passportNumber;

    return guest;
  }

  async findBooking({
    checkInDate,
    checkOutDate,
    bookingReference,
    firstName,
    lastName,
  }: FindBookingArgs) {
    let booking: Booking | undefined;

    if (bookingReference) {
      const bookingReferenceTest = await this.bookingRepository.find({
        dateSubmitted: null,
        bookingReference,
      });

      if (bookingReferenceTest.length === 1) {
        booking = bookingReferenceTest[0];
        return booking;
      }
    }

    const bookingLastNameTest = await this.bookingRepository.find({
      dateSubmitted: null,
      checkInDate,
      checkOutDate,
      ['party.lastName' as keyof Booking]: lastName,
    });

    if (bookingLastNameTest.length === 1) {
      booking = bookingLastNameTest[0];
      return booking;
    }

    const bookingFirstNameTest = bookingLastNameTest.filter(
      (b) => b.party?.[0].firstName === firstName
    );

    if (bookingFirstNameTest.length === 1) {
      booking = bookingFirstNameTest[0];
      return booking;
    }

    throw new BadRequestError(
      'The requested operation failed as no unique match was found for the booking details provided.'
    );
  }

  async delete(id: string) {
    const booking = await this.findOne(id);
    await this.repository.remove(booking);
  }
}
