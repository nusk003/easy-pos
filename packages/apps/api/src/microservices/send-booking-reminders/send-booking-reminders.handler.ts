import { Action } from '@hm/sdk';
import {
  Connection,
  EntityDTO,
  IDatabaseDriver,
  MikroORM,
  wrap,
} from '@mikro-orm/core';
import { EntityManager, EntityRepository } from '@mikro-orm/mongodb';
import { mikroORMConfig } from '@src/config/mikro-orm.config';
import { ElasticClient } from '@src/libs/elasticsearch/elasticsearch.client';
import { NotificationPlatform } from '@src/microservices/send-push-notifications/dto/send-push-notification-args';
import { SendPushNotificationsClient } from '@src/microservices/send-push-notifications/send-push-notifications.client';
import { Booking, BookingStatus } from '@src/modules/booking/booking.entity';
import { Hotel } from '@src/modules/hotel/entities';
import { lambdaValidate } from '@src/utils/dto';
import { BaseSubscriber } from '@src/utils/entity/base.subscriber';
import { LambdaNotFoundError } from '@src/utils/errors';
import { Callback, Context } from 'aws-lambda';
import { SendBookingRemindersArgs } from './dto/send-booking-reminders.args';

let orm: MikroORM<IDatabaseDriver<Connection>>;

class Handler {
  em: EntityManager;

  elasticClient: ElasticClient;

  hotelRepository: EntityRepository<Hotel>;

  bookingRepository: EntityRepository<Booking>;

  guestAppPushNotifications: SendPushNotificationsClient;

  constructor() {
    this.guestAppPushNotifications = new SendPushNotificationsClient(
      NotificationPlatform.GuestApp,
      {
        channelId: 'order-notifications',
        lambda: false,
      }
    );
  }

  async init() {
    orm = await MikroORM.init(
      mikroORMConfig({
        subscribers: [new BaseSubscriber()],
      })
    );
    this.em = <EntityManager>orm.em.fork();

    this.hotelRepository = this.em.getRepository(Hotel);

    this.bookingRepository = this.em.getRepository(Booking);

    this.elasticClient = new ElasticClient();
  }

  async sendBookingReminders(
    sendBookingRemindersArgs: SendBookingRemindersArgs,
    _context: Context,
    _callback: Callback
  ) {
    await lambdaValidate(SendBookingRemindersArgs, sendBookingRemindersArgs);

    await this.init();

    const booking = await this.bookingRepository.findOne(
      sendBookingRemindersArgs.booking.id
    );

    if (!booking) {
      throw new LambdaNotFoundError(Booking, {
        id: sendBookingRemindersArgs.booking.id,
      });
    }

    this.elasticClient.setHotel(booking.hotel.id);

    if (booking.status !== BookingStatus.Created) {
      return;
    }

    await wrap(booking.guest).init();

    this.guestAppPushNotifications.setHotel(booking.hotel.id);

    const hotel = await this.hotelRepository.findOne(booking.hotel.id);

    const checkInStart = hotel?.bookingsSettings?.customization.checkInStart;

    const message = { data: wrap(booking).toJSON(), action: Action.NewBooking };

    delete (<Partial<EntityDTO<Booking>>>message.data).hotel;

    await this.guestAppPushNotifications.trigger({
      guest: booking.guest!,
      title: checkInStart?.title,
      body: checkInStart?.message,
      data: message,
      sendEmail: hotel?.bookingsSettings?.preArrival.email,
    });

    return { statusCode: 200 };
  }
}

const h = new Handler();
export const handler = h.sendBookingReminders.bind(h);
