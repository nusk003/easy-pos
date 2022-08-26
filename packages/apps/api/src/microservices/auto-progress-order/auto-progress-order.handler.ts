import { Action } from '@hm/sdk';
import { Connection, IDatabaseDriver, MikroORM, wrap } from '@mikro-orm/core';
import { EntityManager, EntityRepository } from '@mikro-orm/mongodb';
import { mikroORMConfig } from '@src/config/mikro-orm.config';
import { ElasticClient } from '@src/libs/elasticsearch/elasticsearch.client';
import { NotificationPlatform } from '@src/microservices/send-push-notifications/dto/send-push-notification-args';
import { SendPushNotificationsClient } from '@src/microservices/send-push-notifications/send-push-notifications.client';
import { WebhookServiceClient } from '@src/microservices/webhook-service/webhook-service.client';
import { Hotel } from '@src/modules/hotel/entities';
import { Order, OrderStatus } from '@src/modules/order/order.entity';
import { lambdaValidate } from '@src/utils/dto';
import { BaseSubscriber } from '@src/utils/entity/base.subscriber';
import { LambdaNotFoundError } from '@src/utils/errors';
import { Callback, Context } from 'aws-lambda';
import { AutoProgressOrderClient } from './auto-progress-order.client';
import { AutoProgressOrderArgs } from './dto/auto-progress-order.args';

let orm: MikroORM<IDatabaseDriver<Connection>>;

class Handler {
  em: EntityManager;

  elasticClient: ElasticClient;

  hotelRepository: EntityRepository<Hotel>;

  orderRepository: EntityRepository<Order>;

  guestAppPushNotifications: SendPushNotificationsClient;

  autoProgressOrderClient: AutoProgressOrderClient;

  webhookServiceClient: WebhookServiceClient;

  constructor() {
    this.guestAppPushNotifications = new SendPushNotificationsClient(
      NotificationPlatform.GuestApp,
      {
        channelId: 'order-notifications',
        lambda: false,
      }
    );

    this.webhookServiceClient = new WebhookServiceClient();
  }

  async init() {
    orm = await MikroORM.init(
      mikroORMConfig({
        subscribers: [new BaseSubscriber()],
      })
    );
    this.em = <EntityManager>orm.em.fork();

    this.hotelRepository = this.em.getRepository(Hotel);

    this.orderRepository = this.em.getRepository(Order);

    this.elasticClient = new ElasticClient();

    this.autoProgressOrderClient = new AutoProgressOrderClient();
  }

  async autoProgressOrder(
    autoAcceptOrderArgs: AutoProgressOrderArgs,
    _context: Context,
    _callback: Callback
  ) {
    const { status } = await lambdaValidate(
      AutoProgressOrderArgs,
      autoAcceptOrderArgs
    );

    await this.init();

    const order = await this.orderRepository.findOne(
      autoAcceptOrderArgs.order.id
    );

    if (!order) {
      throw new LambdaNotFoundError(Order, {
        id: autoAcceptOrderArgs.order.id,
      });
    }

    this.elasticClient.setHotel(order.hotel.id);

    if (order.status === OrderStatus.Rejected) {
      return;
    } else if (order.status === OrderStatus.Approved) {
      if (status === OrderStatus.Approved) {
        return;
      }
    } else if (order.status === OrderStatus.Ready) {
      if (status === OrderStatus.Approved || status === OrderStatus.Ready) {
        return;
      }
    } else if (order.status === OrderStatus.Completed) {
      return;
    }

    if (status === OrderStatus.Rejected) {
      wrap(order).assign({ rejected: true });
    } else if (status === OrderStatus.Approved) {
      wrap(order).assign({ dateApproved: new Date() });
    } else if (status === OrderStatus.Ready) {
      wrap(order).assign({ dateReady: new Date() });
    } else if (status === OrderStatus.Completed) {
      wrap(order).assign({ dateCompleted: new Date() });
    }

    await wrap(order.guest).init();
    await wrap(order.space).init();

    await this.elasticClient.indexOne(Order, order);

    await this.em.persistAndFlush(order);

    this.guestAppPushNotifications.setHotel(order.hotel.id);

    const message = {
      data: {
        ...wrap(order).toJSON(),
        hotel: order.hotel.id,
        pricelist: {
          id: order.pricelist.id,
          name: order.pricelist.name,
        },
        space: {
          id: order.space.id,
          name: order.space.name,
        },
        guest: {
          id: order.guest.id,
          firstName: order.guest.firstName,
          lastName: order.guest.lastName,
        },
        items: undefined,
      },
      action: Action.NewOrder,
    };
    delete message.data.items;

    if (status === OrderStatus.Approved) {
      await this.guestAppPushNotifications.trigger({
        guest: order.guest,
        title: 'Your order has been approved 😊',
        body: `Our staff is busy preparing your order from ${order.space.name}! We'll get it to you as soon as we can.`,
        data: message,
      });
    } else if (status === OrderStatus.Rejected) {
      await this.guestAppPushNotifications.trigger({
        guest: order.guest,
        title: 'We were unable to process your order 😕',
        body: 'Unfortunately we are not able to handle your order right now. Click here for more details.',
        data: message,
      });
    }

    if (OrderStatus.Approved) {
      await this.autoProgressOrderClient.trigger({
        ...autoAcceptOrderArgs,
        status: OrderStatus.Ready,
        waitDuration: 86400,
      });
    } else if (OrderStatus.Ready) {
      await this.autoProgressOrderClient.trigger({
        ...autoAcceptOrderArgs,
        status: OrderStatus.Completed,
        waitDuration: 86400,
      });
    }

    await this.webhookServiceClient.triggerWebhooks(order, Action.UpdateOrder);

    return { statusCode: 200 };
  }
}

const h = new Handler();
export const handler = h.autoProgressOrder.bind(h);
