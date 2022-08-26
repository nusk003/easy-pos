import { EntityRepository, wrap } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/mongodb';
import { NotificationPlatform } from '@src/microservices/send-push-notifications/dto/send-push-notification-args';
import { SendPushNotificationsClient } from '@src/microservices/send-push-notifications/send-push-notifications.client';
import { Guest } from '@src/modules/guest/guest.entity';
import { Hotel } from '@src/modules/hotel/entities';
import { Message, MessageAuthor } from '@src/modules/message/message.entity';
import { Order } from '@src/modules/order/order.entity';
import { Thread } from '@src/modules/thread/thread.entity';
import { User } from '@src/modules/user/user.entity';
import { lambdaValidate } from '@src/utils/dto/validation';
import {
  LambdaAuthenticationError,
  LambdaNotFoundError,
} from '@src/utils/errors';
import { ConnectedGuest } from '@src/websockets/entities/connected-guest.entity';
import { ConnectedUser } from '@src/websockets/entities/connected-user.entity';
import {
  WSGuestSession,
  WSUserSession,
} from '@src/websockets/services/auth.service';
import {
  MikroORMService,
  ORM,
} from '@src/websockets/services/mikro-orm.service';
import { WSClient } from '@src/websockets/websockets.client';
import { Action, WSEvent } from '@hm/sdk';
import { SendMessageArgs } from './messages.args';

export class MessagesResolver {
  event: WSEvent;

  session: WSGuestSession | WSUserSession;

  orm: ORM;

  em: EntityManager;

  connectedGuestRepository: EntityRepository<ConnectedGuest>;

  connectedUserRepository: EntityRepository<ConnectedUser>;

  hotelRepository: EntityRepository<Hotel>;

  userRepository: EntityRepository<User>;

  guestRepository: EntityRepository<Guest>;

  threadRepository: EntityRepository<Thread>;

  messageRepository: EntityRepository<Message>;

  orderRepository: EntityRepository<Order>;

  wsClient: WSClient;

  guestAppPushNotifications: SendPushNotificationsClient;

  cloudConsolePushNotifications: SendPushNotificationsClient;

  constructor(session: WSGuestSession | WSUserSession, event: WSEvent) {
    this.event = event;
    this.session = session;
    this.orm = new MikroORMService().getORM();
    this.em = <EntityManager>this.orm.em.fork();
    this.connectedGuestRepository = this.em.getRepository(ConnectedGuest);
    this.connectedUserRepository = this.em.getRepository(ConnectedUser);
    this.hotelRepository = this.em.getRepository(Hotel);
    this.userRepository = this.em.getRepository(User);
    this.guestRepository = this.em.getRepository(Guest);
    this.threadRepository = this.em.getRepository(Thread);
    this.messageRepository = this.em.getRepository(Message);
    this.orderRepository = this.em.getRepository(Order);
    this.wsClient = new WSClient();
    this.cloudConsolePushNotifications = new SendPushNotificationsClient(
      NotificationPlatform.CloudConsole,
      {}
    );
    this.guestAppPushNotifications = new SendPushNotificationsClient(
      NotificationPlatform.GuestApp,
      {
        channelId: 'message-notifications',
      }
    );
  }

  async sendMessage() {
    const {
      guestId,
      orderId,
      threadId,
      token,
      text: untrimmedText,
    } = await lambdaValidate(SendMessageArgs, this.event.body.data);

    if ('guestId' in this.session && this.session.anonAuth) {
      throw new LambdaAuthenticationError();
    }

    this.cloudConsolePushNotifications.setHotel(this.session.hotel!);
    this.guestAppPushNotifications.setHotel(this.session.hotel!);

    const hotel = <Hotel>(
      await this.hotelRepository.findOne(this.session.hotel!)
    );

    const text = untrimmedText.trim();

    const thread = threadId
      ? await this.threadRepository.findOne(threadId)
      : new Thread();

    if (!thread) {
      throw new LambdaNotFoundError(Thread, { id: threadId });
    }

    const guest = thread.guest
      ? await this.guestRepository.getReference(thread.guest.id)
      : guestId
      ? await this.guestRepository.findOne(guestId)
      : 'guestId' in this.session
      ? await this.guestRepository.getReference(this.session.guestId)
      : undefined;

    if (!guest) {
      throw new LambdaNotFoundError(Guest, { id: guestId });
    }

    const user =
      'userId' in this.session
        ? await this.userRepository.getReference(this.session.userId)
        : undefined;

    const order = thread.order
      ? await this.orderRepository.getReference(thread.order.id)
      : orderId
      ? await this.orderRepository.findOne(orderId)
      : undefined;

    if (orderId && !order) {
      throw new LambdaNotFoundError(Order, { id: orderId });
    }

    const message = new Message();

    thread.guest = guest;
    thread.hotel = hotel;
    thread.group = hotel.group;
    thread.order = order || undefined;
    thread.resolved = false;
    thread.dateUpdated = new Date();

    message.hotel = hotel;
    message.group = hotel.group;
    message.thread = thread;
    message.text = text;
    message.author =
      'guestId' in this.session ? MessageAuthor.Guest : MessageAuthor.User;
    message.user = user || undefined;
    message.guest = guest;

    this.em.persist(message);
    this.em.persist(thread);

    await this.em.flush();

    await wrap(message.guest).init();
    const notificationGuest = {
      id: message.guest.id,
      firstName: message.guest.firstName,
      lastName: message.guest.lastName,
    };

    delete thread.order;

    const notification = {
      action: Action.NewMessage,
      data: {
        message: {
          ...wrap(message).toJSON(),
          guest: notificationGuest,
          hotel: { id: hotel.id },
          thread: { id: thread.id },
        },
        thread: {
          ...wrap(thread).toJSON(),
          hotel: { id: thread.id },
          guest: notificationGuest,
        },
        newThread: !threadId,
      },
      token,
    };

    await this.wsClient.broadcastToUsers(hotel, notification);

    if ('userId' in this.session) {
      await this.wsClient.broadcastToGuest(guest, notification);

      await this.guestAppPushNotifications.trigger({
        guest,
        title: hotel.name,
        body: text,
        data: notification,
      });
    } else if ('guestId' in this.session) {
      await this.wsClient.send(
        this.event.requestContext.connectionId,
        notification
      );
      await this.cloudConsolePushNotifications.trigger({ data: notification });
    }
  }
}
