import { Connection, IDatabaseDriver, MikroORM } from '@mikro-orm/core';
import { EntityManager, EntityRepository } from '@mikro-orm/mongodb';
import { mikroORMConfig } from '@src/config/mikro-orm.config';
import { NotificationPlatform } from '@src/microservices/send-push-notifications/dto/send-push-notification-args';
import { Hotel } from '@src/modules/hotel/entities';
import { Message, MessageAuthor } from '@src/modules/message/message.entity';
import { Order, OrderStatus } from '@src/modules/order/order.entity';
import { Thread } from '@src/modules/thread/thread.entity';
import { lambdaValidate } from '@src/utils/dto';
import { Action } from '@hm/sdk';
import { Callback, Context } from 'aws-lambda';
import { SendEmailNotificationsArgs } from './dto/send-email-notifications.args';
import { SendEmailNotificationsService } from './services/send-email-notifications.service';

let orm: MikroORM<IDatabaseDriver<Connection>>;

class Handler {
  em: EntityManager;

  hotelRepository: EntityRepository<Hotel>;

  orderRepository: EntityRepository<Order>;

  threadRepository: EntityRepository<Thread>;

  messageRepository: EntityRepository<Message>;

  async init() {
    orm = await MikroORM.init(mikroORMConfig());
    this.em = <EntityManager>orm.em.fork();

    this.hotelRepository = this.em.getRepository(Hotel);
    this.orderRepository = this.em.getRepository(Order);
    this.threadRepository = this.em.getRepository(Thread);
    this.messageRepository = this.em.getRepository(Message);
  }

  async sendEmailNotifications(
    sendEmailNotificationArgs: SendEmailNotificationsArgs,
    _context: Context,
    _callback: Callback
  ) {
    const { opts, sendOptions, type } = await lambdaValidate(
      SendEmailNotificationsArgs,
      sendEmailNotificationArgs
    );

    await this.init();

    const sendEmailNotificationsService = new SendEmailNotificationsService({
      opts,
      sendOptions,
      type,
      em: this.em,
    });

    if (sendOptions.data?.action === Action.UpdateOrder) {
      if (type === NotificationPlatform.GuestApp) {
        const order =
          await sendEmailNotificationsService.getOrderFromNotification();
        if (order.rejected || order.status === OrderStatus.Approved) {
          await sendEmailNotificationsService.sendOrderStatusEmail();
        }
      }
    }

    if (sendOptions.data?.action === Action.NewBooking) {
      if (type === NotificationPlatform.GuestApp) {
        await sendEmailNotificationsService.sendGuestCheckInCreatedEmail();
      }
    }

    if (sendOptions.data?.action === Action.SubmitBooking) {
      if (type === NotificationPlatform.GuestApp) {
        await sendEmailNotificationsService.sendGuestCheckInSubmittedEmail();
      }
    }

    if (sendOptions.data?.action === Action.ReviewBooking) {
      if (type === NotificationPlatform.GuestApp) {
        await sendEmailNotificationsService.sendGuestCheckInReviewedEmail();
      }
    }

    if (sendOptions.data?.action === Action.NewMessage) {
      const thread =
        await sendEmailNotificationsService.getThreadFromNotification();

      const { message } = sendOptions.data.data as {
        message: Message;
        thread: Thread;
        newThread: boolean;
      };

      if (message.id !== thread.lastMessage.id) {
        return;
      }

      if (
        thread.lastMessage.author === MessageAuthor.User &&
        type === NotificationPlatform.GuestApp
      ) {
        await sendEmailNotificationsService.sendNewMessageEmail();
      }
    }

    return { statusCode: 200 };
  }
}

const h = new Handler();
export const handler = h.sendEmailNotifications.bind(h);
