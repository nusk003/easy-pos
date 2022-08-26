import { QueryOrder } from '@mikro-orm/core';
import { EntityManager, EntityRepository } from '@mikro-orm/mongodb';
import { Type as NestType } from '@nestjs/common';
import { __cloud_console_url__ } from '@src/constants';
import { Booking } from '@src/modules/booking/booking.entity';
import { Hotel } from '@src/modules/hotel/entities';
import { Message, MessageAuthor } from '@src/modules/message/message.entity';
import { Order } from '@src/modules/order/order.entity';
import { Thread } from '@src/modules/thread/thread.entity';
import { User } from '@src/modules/user/user.entity';
import { email } from '@src/utils/email/sendgrid';
import dayjs from 'dayjs';

interface SendHotelEmailNotificationsSendEmailOpts {
  hotelId: string;
  notifications: UserEmailNotification[];
}

export interface UserEmailNotification {
  type: NestType;
  title: string;
  body: string;
  date: Date;
  time: string;
  guest: {
    initials: string;
    firstName: string;
    lastName: string;
    location?: string;
  };
}

export class SendHotelEmailNotificationsService {
  em: EntityManager;

  hotelRepository: EntityRepository<Hotel>;

  orderRepository: EntityRepository<Order>;

  threadRepository: EntityRepository<Thread>;

  messageRepository: EntityRepository<Message>;

  bookingRepository: EntityRepository<Booking>;

  userRepository: EntityRepository<User>;

  constructor({ em }: { em: EntityManager }) {
    this.em = em;

    this.hotelRepository = this.em.getRepository(Hotel);
    this.orderRepository = this.em.getRepository(Order);
    this.threadRepository = this.em.getRepository(Thread);
    this.messageRepository = this.em.getRepository(Message);
    this.bookingRepository = this.em.getRepository(Booking);
    this.userRepository = this.em.getRepository(User);
  }

  private async getHotelUsers(hotelId: string) {
    const users = await this.userRepository.find({ hotels: hotelId });
    return users;
  }

  async getPendingOrders() {
    const pendingOrders = await this.orderRepository.find(
      {
        reminderEmailSent: { $ne: true },
        dateUpdated: {
          $gte: dayjs().subtract(10, 'm').toDate(),
          $lte: dayjs().subtract(5, 'm').toDate(),
        },
        dateApproved: null,
      },
      { populate: ['guest', 'hotel'] }
    );

    return pendingOrders;
  }

  async getPendingMessages() {
    const pendingMessages: Message[] = [];

    const unresolvedThreads = await this.threadRepository.find(
      {
        dateUpdated: {
          $gte: dayjs().subtract(10, 'm').toDate(),
          $lte: dayjs().subtract(5, 'm').toDate(),
        },
        resolved: false,
      },

      { fields: ['id'] }
    );

    for await (const thread of unresolvedThreads) {
      const lastMessage = await this.messageRepository.findOne(
        { thread: thread },
        {
          populate: ['guest'],
          orderBy: {
            dateCreated: QueryOrder.DESC,
          },
        }
      );

      if (
        !lastMessage?.reminderEmailSent &&
        lastMessage?.author === MessageAuthor.Guest
      ) {
        pendingMessages.push(lastMessage);
      }
    }

    return pendingMessages;
  }

  async getPendingBookings() {
    const pendingBookings = await this.bookingRepository.find(
      {
        reminderEmailSent: { $ne: true },
        dateUpdated: {
          $gte: dayjs().subtract(10, 'm').toDate(),
          $lte: dayjs().subtract(5, 'm').toDate(),
        },
        dateSubmitted: { $ne: null },
        dateReviewed: null,
      },
      { populate: ['guest'] }
    );

    return pendingBookings;
  }

  async getPendingNotifications() {
    const pendingNotifications = [
      ...(await this.getPendingBookings()),
      ...(await this.getPendingMessages()),
      ...(await this.getPendingOrders()),
    ];

    const hotelIdNotifications: Record<string, UserEmailNotification[]> = {};

    for (const pendingNotification of pendingNotifications) {
      pendingNotification.reminderEmailSent = true;

      const notification: Partial<UserEmailNotification> = {
        time: dayjs(pendingNotification.dateUpdated).format('HH:mm a'),
        date: pendingNotification.dateUpdated,
        guest: {
          firstName: pendingNotification.guest!.firstName!,
          lastName: pendingNotification.guest!.lastName!,
          initials:
            pendingNotification.guest!.firstName![0] +
            pendingNotification.guest!.lastName![0],
        },
      };

      if (pendingNotification instanceof Order) {
        const currencyFormatter = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: pendingNotification.hotel.currencyCode,
        });

        notification.type = Order;
        notification.title = 'NEW ORDER';
        notification.body = `${pendingNotification.items.length} item${
          pendingNotification.items.length > 1 ? 's' : ''
        } • ${currencyFormatter.format(pendingNotification.totalPrice)}`;
        notification.guest!.location = pendingNotification.roomNumber;
      } else if (pendingNotification instanceof Message) {
        notification.type = Message;
        notification.title = 'NEW MESSAGE';
        notification.body = pendingNotification.text.slice(0, 140);
      } else if (pendingNotification instanceof Booking) {
        notification.type = Booking;
        notification.title = 'NEW BOOKING';
        notification.body = `${dayjs(pendingNotification.checkInDate).format(
          'DD/MM/YY'
        )} - ${dayjs(pendingNotification.checkInDate).format(
          'DD/MM/YY'
        )} • Ready to review`;
      }

      if (!hotelIdNotifications[pendingNotification.hotel.id]) {
        hotelIdNotifications[pendingNotification.hotel.id] = [];
      }

      hotelIdNotifications[pendingNotification.hotel.id].push(
        <UserEmailNotification>notification
      );
    }

    Object.entries(hotelIdNotifications).forEach(
      ([hotelId, hotelNotifications]) => {
        hotelNotifications.sort((a, b) => {
          if (a.date > b.date) {
            return -1;
          }

          if (a.date < b.date) {
            return 1;
          }

          return 0;
        });

        hotelIdNotifications[hotelId] = hotelNotifications;
      }
    );

    return hotelIdNotifications;
  }

  async sendEmail(opts: SendHotelEmailNotificationsSendEmailOpts) {
    const users = await this.getHotelUsers(opts.hotelId);

    for await (const user of users) {
      const notifications: UserEmailNotification[] = [];

      opts.notifications.forEach((notification) => {
        if (notification.type === Order && user.notifications?.orders) {
          notifications.push(notification);
        } else if (
          notification.type === Message &&
          user.notifications?.messages
        ) {
          notifications.push(notification);
        } else if (
          notification.type === Booking &&
          user.notifications?.bookings
        ) {
          notifications.push(notification);
        }
      });

      if (!notifications.length) {
        return;
      }

      await email.sendHotelNotifications({
        to: user.email,
        subject: `You have ${notifications.length} new notification${
          notifications.length > 1 ? 's' : ''
        }`,
        data: {
          notifications: notifications.slice(0, 9),
          notificationsLength: notifications.length,
          notificationCenterLink: `${__cloud_console_url__}`,
          notificationCenterUnsubscribeLink: `${__cloud_console_url__}/settings/notifications`,
        },
      });
    }
  }
}
