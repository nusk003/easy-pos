import { Action } from '@hm/sdk';
import {
  Connection,
  EntityManager,
  EntityRepository,
  IDatabaseDriver,
  MikroORM,
} from '@mikro-orm/core';
import { mikroORMConfig } from '@src/config/mikro-orm.config';
import { Booking } from '@src/modules/booking/booking.entity';
import {
  Hotel,
  HotelMarketplaceAppSubscriptionTopic,
} from '@src/modules/hotel/entities';
import { MarketplaceApp } from '@src/modules/marketplace-app/marketplace-app.entity';
import { Order } from '@src/modules/order/order.entity';
import { Pricelist } from '@src/modules/pricelist/pricelist.entity';
import { Space } from '@src/modules/space/space.entity';
import { lambdaValidate } from '@src/utils/dto';
import { BaseSubscriber } from '@src/utils/entity/base.subscriber';
import { LambdaBadRequestError, LambdaNotFoundError } from '@src/utils/errors';
import { Callback, Context } from 'aws-lambda';
import axios from 'axios';
import crypto from 'crypto';
import { v4 as uuid } from 'uuid';
import {
  SendWebhookArgs,
  WebhookPayload,
  WebhookPayloadEntity,
} from './dto/webhook-service.args';
import { WebhookServiceClient } from './webhook-service.client';

let orm: MikroORM<IDatabaseDriver<Connection>>;

class Handler {
  em: EntityManager;

  hotelRepository: EntityRepository<Hotel>;

  marketplaceAppRepository: EntityRepository<MarketplaceApp>;

  async init() {
    orm = await MikroORM.init(
      mikroORMConfig({
        subscribers: [new BaseSubscriber()],
      })
    );
    this.em = <EntityManager>orm.em.fork();

    this.hotelRepository = this.em.getRepository(Hotel);

    this.marketplaceAppRepository = this.em.getRepository(MarketplaceApp);
  }

  private async postWebhook(
    endpoint: string,
    key: string | undefined,
    webhookPayload: WebhookPayload,
    sendWebhookArgs: SendWebhookArgs
  ) {
    try {
      let signature: string | undefined;

      if (key) {
        signature = crypto
          .createHmac('sha256', key)
          .update(JSON.stringify(webhookPayload), 'utf-8')
          .digest('hex');
      }

      const headers = signature
        ? {
            'X-Hotel-Manager-Signature': `t=${webhookPayload.timestamp},v1=${signature}`,
          }
        : {};

      await axios.post(endpoint, webhookPayload, {
        headers,
      });
    } catch {
      const { retryAttempts, attempt } = sendWebhookArgs;

      if (attempt && attempt + 1 > retryAttempts) {
        return;
      }

      const webhookServiceClient = new WebhookServiceClient();

      await webhookServiceClient.trigger({
        ...sendWebhookArgs,
        attempt: (attempt || 0) + 1,
        waitDuration: 60,
      });
    }
  }

  async handleWebhookRequest(
    sendWebhookArgs: SendWebhookArgs,
    _context: Context,
    _callback: Callback
  ) {
    const {
      action,
      attempt,
      waitDuration,
      retryAttempts,
      entities: initialEntities,
    } = await lambdaValidate(SendWebhookArgs, sendWebhookArgs);

    await this.init();

    const entities = Array.isArray(initialEntities)
      ? initialEntities
      : [initialEntities];

    const hotelId = entities[0].hotel as unknown as string;
    let hotel: Hotel | string | null = entities[0].hotel;

    if (typeof hotelId === 'string') {
      hotel = await this.hotelRepository.findOne(hotelId);
    }

    if (!hotel) {
      throw new LambdaNotFoundError(Hotel, { id: hotelId });
    }

    const topic =
      action === Action.NewBooking || action === Action.UpdateBooking
        ? HotelMarketplaceAppSubscriptionTopic.Booking
        : action === Action.NewOrder || action === Action.UpdateOrder
        ? HotelMarketplaceAppSubscriptionTopic.Order
        : action === Action.NewSpace ||
          action === Action.UpdateSpace ||
          action === Action.DeleteSpace ||
          action === Action.NewPricelist ||
          action === Action.UpdatePricelist ||
          action === Action.DeletePricelist
        ? HotelMarketplaceAppSubscriptionTopic.Space
        : <never>undefined;

    if (!topic) {
      throw new LambdaBadRequestError('');
    }

    const newEntities = entities.map((entity) => {
      const newEntity = <Record<string, any>>entity;

      if (entity.hotel.group) {
        newEntity.group = entity.hotel.group;
      }
      newEntity.hotel = entity.hotel.id;

      entity.id = entity._id ? entity._id.toString() : entity.id;

      delete (<Partial<WebhookPayloadEntity>>entity)._id;

      if (entity.__entityName === 'Space') {
        const spaceEntity = <Space>entity;
        if (spaceEntity.pricelists) {
          newEntity.pricelists = (
            spaceEntity.pricelists as unknown as Pricelist[]
          ).map((pricelist) => pricelist.id);
        }
      }

      if (entity.__entityName === 'Pricelist') {
        const pricelistEntity = <Pricelist>entity;
        if (pricelistEntity.space) {
          newEntity.space = pricelistEntity.space.id;
        }
      }

      if (entity.__entityName === 'Order') {
        const orderEntity = <Order>entity;
        newEntity.pricelist = orderEntity.pricelist.id;
        newEntity.space = orderEntity.space.id;
      }

      if (entity.__entityName === 'Booking') {
        const bookingEntity = <Booking>entity;
        if (bookingEntity.guest) {
          newEntity.guest = bookingEntity.guest.id;
        }
      }

      return <WebhookPayloadEntity>newEntity;
    });

    if (!hotel.integrations?.marketplaceApps) {
      return;
    }

    const loadSubscriptionEndpoints = hotel.integrations.marketplaceApps
      .flatMap((app) => {
        return app.subscriptions?.flatMap(async (sub) => {
          if (sub.topics.includes(topic)) {
            const marketplaceApp = await this.marketplaceAppRepository.findOne({
              id: app.id.toString(),
            });
            return { endpoint: sub.endpoint, key: marketplaceApp?.key?.key };
          }

          return <never>undefined;
        });
      })
      .filter(Boolean) as Array<Promise<{ endpoint: string; key: string }>>;

    const subscriptionEndpoints = await Promise.all(loadSubscriptionEndpoints);

    subscriptionEndpoints.filter(Boolean)?.map(async ({ endpoint, key }) => {
      await this.postWebhook(
        endpoint,
        key,
        {
          id: uuid(),
          timestamp: Math.floor(Date.now() / 1000),
          action,
          entities: newEntities,
          topic,
        },
        {
          retryAttempts,
          waitDuration,
          action,
          entities,
          attempt,
        }
      );
    });

    if (subscriptionEndpoints) {
      await Promise.all(subscriptionEndpoints);
    }

    return { statusCode: 200 };
  }
}

const h = new Handler();
export const handler = h.handleWebhookRequest.bind(h);
