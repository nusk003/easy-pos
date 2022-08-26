// import { calculateDiscountValue, calculateSurcharges } from '@hm/orders';
import { Loaded, QueryOrder } from '@mikro-orm/core';
import { EntityManager, EntityRepository } from '@mikro-orm/mongodb';
import { __cloud_console_url__, __guest_app_web_url__ } from '@src/constants';
import {
  GuestAppSendOptions,
  NotificationPlatform,
  SendPushNotificationArgs,
} from '@src/microservices/send-push-notifications/dto/send-push-notification-args';
import { Booking } from '@src/modules/booking/booking.entity';
import { Hotel } from '@src/modules/hotel/entities';
import { Message, MessageAuthor } from '@src/modules/message/message.entity';
import { Order } from '@src/modules/order/order.entity';
import { Thread } from '@src/modules/thread/thread.entity';
import { User } from '@src/modules/user/user.entity';
import { email, Email } from '@src/utils/email/sendgrid';
import { LambdaBadRequestError, LambdaNotFoundError } from '@src/utils/errors';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';

dayjs.extend(advancedFormat);

const calculateDiscountValue = (x: any) => {
  return 0;
};
const calculateSurcharges = (y: any) => {
  return [];
};

export class SendEmailNotificationsService {
  email: Email;

  hotelId?: string;

  sendOptions: SendPushNotificationArgs['sendOptions'];

  type: SendPushNotificationArgs['type'];

  em: EntityManager;

  hotelRepository: EntityRepository<Hotel>;

  orderRepository: EntityRepository<Order>;

  threadRepository: EntityRepository<Thread>;

  messageRepository: EntityRepository<Message>;

  bookingRepository: EntityRepository<Booking>;

  constructor({
    opts,
    sendOptions,
    type,
    em,
  }: SendPushNotificationArgs & { em: EntityManager }) {
    this.email = email;

    this.hotelId = opts.hotelId;
    this.sendOptions = sendOptions;
    this.type = type;

    this.em = em;
    this.hotelRepository = this.em.getRepository(Hotel);
    this.orderRepository = this.em.getRepository(Order);
    this.threadRepository = this.em.getRepository(Thread);
    this.messageRepository = this.em.getRepository(Message);
    this.bookingRepository = this.em.getRepository(Booking);
  }

  private getGuestEmail() {
    return (<GuestAppSendOptions>this.sendOptions).email;
  }

  private async getHotelUserEmails() {
    if (!this.hotelId) {
      throw new LambdaBadRequestError(
        'The requested operation failed as no Hotel ID was set.'
      );
    }

    const userRepository = this.em.getRepository(User);

    const users = await userRepository.find({ hotels: this.hotelId });

    return users.map((user) => user.email);
  }

  private async getEmails(): Promise<string[] | string> {
    if (this.type === NotificationPlatform.CloudConsole) {
      return this.getHotelUserEmails();
    }

    return this.getGuestEmail()!;
  }

  async getOrderFromNotification() {
    const notificationData = this.sendOptions.data?.data as Order;

    const order = await this.orderRepository.findOne(notificationData.id, {
      populate: ['space', 'guest'],
      cache: 2000,
    });

    if (!order) {
      throw new LambdaNotFoundError(Order, { id: notificationData.id });
    }

    return order;
  }

  async getBookingFromNotification() {
    const notificationData = this.sendOptions.data?.data as Order;

    const booking = await this.bookingRepository.findOne(notificationData.id, {
      populate: ['hotel', 'guest'],
      cache: 2000,
    });

    if (!booking) {
      throw new LambdaNotFoundError(Order, { id: notificationData.id });
    }

    return booking;
  }

  async getThreadFromNotification() {
    const notificationData = this.sendOptions.data?.data as {
      message: Message;
      thread: Thread;
      newThread: boolean;
    };

    const thread = await this.threadRepository.findOne(
      notificationData.thread.id,
      { cache: 2000 }
    );

    const lastMessage = await this.messageRepository.findOne(
      {
        thread: notificationData.thread.id,
      },
      {
        populate: ['guest'],
        orderBy: {
          dateCreated: QueryOrder.DESC,
        },
        cache: 2000,
      }
    );

    if (!thread) {
      throw new LambdaNotFoundError(Thread, {
        id: notificationData.thread.id,
      });
    }

    if (!lastMessage) {
      throw new LambdaNotFoundError(Message, {
        thread: notificationData.thread.id,
      });
    }

    thread.lastMessage = lastMessage;

    return <Thread & { lastMessage: Message }>thread;
  }

  async sendGuestCheckInCreatedEmail() {
    const booking = await this.getBookingFromNotification();
    const guest = booking.guest;
    const hotel = booking.hotel;

    if (guest) {
      await this.email.sendGuestCheckInCreated({
        to: guest.email!,
        subject: `${hotel.name} – Check-in is available`,
        data: {
          hotelName: hotel.name,
          firstName: guest.firstName!,
          lastName: guest.lastName!,
          checkInDate: dayjs(booking.checkInDate).format('ddd Do MMM'),
          checkOutDate: dayjs(booking.checkOutDate).format('ddd Do MMM'),
          checkInLink: `${__guest_app_web_url__}/${hotel.id}?bookingId=${booking.id}`,
          bookingReference: booking.bookingReference || '',
        },
      });
    }
  }

  async sendGuestCheckInSubmittedEmail() {
    const booking = await this.getBookingFromNotification();
    const guest = booking.guest;
    const hotel = booking.hotel;

    if (guest) {
      await this.email.sendGuestCheckInSubmitted({
        to: guest.email!,
        subject: `${hotel.name} – Check-in submitted`,
        data: {
          hotelName: hotel.name,
          title:
            hotel.bookingsSettings?.customization.checkInReview.title || '',
          message:
            hotel.bookingsSettings?.customization.checkInReview.message || '',
          firstName: guest.firstName!,
          lastName: guest.lastName!,
          checkInDate: dayjs(booking.checkInDate).format('ddd Do MMM'),
          checkOutDate: dayjs(booking.checkOutDate).format('ddd Do MMM'),
          bookingLink: `${__guest_app_web_url__}/${hotel.id}?bookingId=${booking.id}`,
        },
      });
    }
  }

  async sendGuestCheckInReviewedEmail() {
    const booking = await this.getBookingFromNotification();
    const guest = booking.guest;
    const hotel = booking.hotel;

    if (guest) {
      await this.email.sendGuestCheckInReviewed({
        to: guest.email!,
        subject: `${hotel.name} – Check-in reviewed sucessfully`,
        data: {
          hotelName: hotel.name,
          title:
            hotel.bookingsSettings?.customization.checkInSuccess.title || '',
          message:
            hotel.bookingsSettings?.customization.checkInSuccess.message || '',
          firstName: guest.firstName!,
          lastName: guest.lastName!,
          checkInDate: dayjs(booking.checkInDate).format('ddd Do MMM'),
          checkOutDate: dayjs(booking.checkOutDate).format('ddd Do MMM'),
          bookingLink: `${__guest_app_web_url__}/${hotel.id}?bookingId=${booking.id}`,
        },
      });
    }
  }

  async sendOrderStatusEmail() {
    const order = await this.getOrderFromNotification();

    const hotel = await this.hotelRepository.findOne(order.hotel.id);

    if (!hotel) {
      throw new LambdaNotFoundError(Hotel, { id: order.hotel.id });
    }

    const currencyFormatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: hotel.currencyCode,
    });

    const items = order.items.map((item) => {
      const options = item.modifiers?.flatMap((modifier) => {
        return modifier.options.map((option) => ({ name: option.name }));
      });

      return {
        name: item.name,
        options: options || [],
        quantity: item.quantity,
        totalPrice: currencyFormatter.format(item.totalPrice),
      };
    });

    const discountValue = calculateDiscountValue(<any>order);

    const surcharges =
      calculateSurcharges(<any>order)?.map(({ name, value }) => ({
        name,
        value: currencyFormatter.format(value),
      })) || [];

    await this.email.sendOrderStatus({
      to: await this.getEmails(),
      subject:
        this.type === NotificationPlatform.GuestApp
          ? order.rejected
            ? 'We were unable to process your order 😕'
            : 'Your order has been approved 😊'
          : `Order #${order.orderReference!.toUpperCase()} is awaiting approval`,
      data: {
        hotelName: hotel.name,
        delivery: order.delivery || 'Room',
        guestApp: this.type === NotificationPlatform.GuestApp,
        spaceName: order.space.name,
        orderReference: `#${order.orderReference!.toUpperCase()}`,
        roomNumber: order.roomNumber,
        rejected: !!order.rejected,
        firstName: order.guest.firstName!,
        lastName: order.guest.lastName!,
        items: items,
        discount: order.discount
          ? {
              name: order.discount.name,
              value: currencyFormatter.format(discountValue),
            }
          : undefined,
        surcharges,
        subtotal: currencyFormatter.format(order.subtotal),
        totalPrice: currencyFormatter.format(order.totalPrice),
        orderLink:
          this.type === NotificationPlatform.GuestApp
            ? `${__guest_app_web_url__}/${hotel.id}?orderId=${order.id}`
            : `${__cloud_console_url__}/orders?id=${order.id}`,
        date: dayjs().format('YYYY-MM-DD hh:mm A'),
      },
    });
  }

  async sendNewMessageEmail() {
    const thread = await this.getThreadFromNotification();
    let hotel: Loaded<Hotel, never> | null | undefined;
    let authorName: string;

    if (thread.lastMessage.author === MessageAuthor.Guest) {
      authorName = `${thread.guest.firstName} ${thread.guest.lastName}`;
    } else {
      hotel = await this.hotelRepository.findOne(thread.hotel.id);

      if (!hotel) {
        throw new LambdaNotFoundError(Hotel, { id: thread.hotel.id });
      }

      authorName = hotel.name;
    }

    await this.email.sendNewMessage({
      to: await this.getEmails(),
      subject: `You have a new message from ${authorName}`,
      data: {
        hotelName: hotel ? hotel.name : '',
        authorName: authorName,
        guestApp: thread.lastMessage.author === MessageAuthor.User,
        messageLink:
          thread.lastMessage.author === MessageAuthor.User
            ? `${__guest_app_web_url__}/${thread.hotel.id}/messages/thread/${thread.id}`
            : `${__cloud_console_url__}/messages/${thread.id}`,
        messageText: thread.lastMessage.text.slice(0, 140),
        date: dayjs().format('YYYY-MM-DD hh:mm A'),
      },
    });
  }
}
