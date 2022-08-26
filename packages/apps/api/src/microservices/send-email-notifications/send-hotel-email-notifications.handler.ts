import { Connection, IDatabaseDriver, MikroORM } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/mongodb';
import { mikroORMConfig } from '@src/config/mikro-orm.config';
import { __dev__ } from '@src/constants';
import { Callback, Context } from 'aws-lambda';
import { SendHotelEmailNotificationsService } from './services/send-hotel-email-notifications.service';

let orm: MikroORM<IDatabaseDriver<Connection>>;

class Handler {
  em: EntityManager;

  async init() {
    orm = await MikroORM.init(mikroORMConfig({ debug: !__dev__ }));
    this.em = <EntityManager>orm.em.fork();
  }

  async sendHotelEmailNotifications(_context?: Context, _callback?: Callback) {
    await this.init();

    const sendHotelEmailNotificationsService =
      new SendHotelEmailNotificationsService({
        em: this.em,
      });

    const pendingNotifications =
      await sendHotelEmailNotificationsService.getPendingNotifications();

    for await (const [hotelId, hotelNotifications] of Object.entries(
      pendingNotifications
    )) {
      await sendHotelEmailNotificationsService.sendEmail({
        hotelId,
        notifications: hotelNotifications,
      });
    }

    await this.em.flush();

    return { statusCode: 200 };
  }
}

const h = new Handler();
export const handler = h.sendHotelEmailNotifications.bind(h);
