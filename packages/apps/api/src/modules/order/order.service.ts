import { FilterQuery } from '@mikro-orm/core';
import { EntityManager, EntityRepository } from '@mikro-orm/mongodb';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { CONTEXT } from '@nestjs/graphql';
import { ElasticsearchService } from '@src/libs/elasticsearch';
import { ElasticBody } from '@src/libs/elasticsearch/elasticsearch.client';
import { AutoProgressOrderClient } from '@src/microservices/auto-progress-order/auto-progress-order.client';
import { WebhookServiceClient } from '@src/microservices/webhook-service/webhook-service.client';
import { Guest } from '@src/modules/guest/guest.entity';
import { Thread } from '@src/modules/thread/thread.entity';
import { Context } from '@src/utils/context/context.type';
import { PaginationSort } from '@src/utils/dto';
import { NotFoundError, UnauthorizedResourceError } from '@src/utils/errors';
import { FindOptions, TenantService } from '@src/utils/service';
import dayjs from 'dayjs';
import { ObjectId } from 'mongodb';
import {
  OrderPaginationSearchArgs,
  OutstandingGuestsArgs,
  SearchOutstandingOrdersArgs,
} from './dto/order.args';
import {
  OutstandingGuestsResponse,
  OutstandingOrdersStatisticsResponse,
} from './dto/order.responses';
import { Order, PaymentType } from './order.entity';

export interface FindOrderOptions<P extends string>
  extends FindOptions<Order, P> {
  completed?: boolean;
  rejected?: boolean;
  startDate?: Date;
  endDate?: Date;
}

@Injectable({ scope: Scope.REQUEST })
export class OrderService extends TenantService<Order> {
  autoProgressOrderClient = new AutoProgressOrderClient();

  webhookServiceClient = new WebhookServiceClient();

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: EntityRepository<Order>,
    @InjectRepository(Thread)
    private readonly threadRepository: EntityRepository<Thread>,
    @Inject(CONTEXT) context: Context,
    private readonly elasticsearch: ElasticsearchService,
    em: EntityManager
  ) {
    super(orderRepository, context, {
      guestAppPushNotifications: { channelId: 'order-notifications' },
      em,
    });
  }

  async find<P extends string>(opts?: FindOrderOptions<P>) {
    const query: FilterQuery<Order> = { hotel: this.hotel };

    if (opts?.completed !== undefined) {
      if (opts?.completed) {
        query.dateCompleted = { $ne: null };
      } else {
        query.dateCompleted = { $eq: null };
      }
    }

    if (opts?.rejected !== undefined) {
      if (opts?.rejected) {
        query.rejected = { $eq: true };
      } else {
        query.rejected = { $ne: true };
      }
    }

    if (opts?.startDate !== undefined) {
      query.dateCreated = { $gt: opts.startDate };
    }

    if (opts?.endDate !== undefined) {
      query.dateCreated = { $lt: opts.endDate };
    }

    const orders = await this.orderRepository.find(query, {
      populate: opts?.populate,
      orderBy: this.createSortArg(opts?.sort),
      limit: opts?.limit,
      offset: opts?.offset,
    });

    return orders;
  }

  async findOrdersByGuest<P extends string>(
    guestId: string,
    opts?: FindOptions<Order, P>
  ) {
    const orders = await this.orderRepository.find(
      { hotel: this.hotel, guest: guestId },
      {
        populate: opts?.populate,
        orderBy: this.createSortArg(opts?.sort),
        limit: opts?.limit,
        offset: opts?.offset,
      }
    );

    const threads = await this.threadRepository.find({
      hotel: this.hotel,
      guest: guestId,
      order: { $ne: null },
    });

    return orders.map((order) => {
      const thread = threads.find((t) => t.order?.id === order.id);
      if (thread) {
        order.thread = thread as typeof order['thread'];
      }
      return order;
    });
  }

  async findOne(id: string, guestId?: string) {
    const order = await this.orderRepository.findOne(id, {
      populate: ['guest', 'space', 'pricelist'],
    });

    if (!order) {
      throw new NotFoundError(Order, { id });
    }

    if (guestId && order.guest.id !== guestId) {
      throw new UnauthorizedResourceError(Guest, guestId);
    }

    return order;
  }

  async activeOrdersCount() {
    const activeOrdersCount = await this.repository.count({
      hotel: this.hotel,
      dateCreated: { $ne: null },
      dateApproved: { $eq: null },
      rejected: { $ne: true },
    });

    return activeOrdersCount;
  }

  async indexOne(order: Order) {
    return this.elasticsearch.indexOne(Order, order);
  }

  async indexMany(orders: Order[]) {
    return this.elasticsearch.indexMany(Order, orders);
  }

  async search(args: OrderPaginationSearchArgs) {
    const { query, limit, offset, sort, endDate, startDate } = args;

    return this.elasticsearch.searchCollection(Order, {
      query: {
        bool: {
          must: query
            ? {
                query_string: {
                  query,
                },
              }
            : {
                match_all: {},
              },
          filter:
            startDate && endDate
              ? {
                  range: {
                    dateCreated: {
                      gte: dayjs(startDate).format('YYYY-MM-DD'),
                      lt: dayjs(endDate).format('YYYY-MM-DD'),
                    },
                  },
                }
              : [],
        },
      },
      sort,
      limit,
      offset,
    });
  }

  async searchOutstandingOrders(args: SearchOutstandingOrdersArgs) {
    const { query, limit, offset, sort, paymentType, guestId } = args;

    const body: ElasticBody = {
      query: {
        bool: {
          must: [],
          must_not: [
            { term: { paid: true } },
            { term: { 'paymentType.keyword': 'none' } },
            { term: { 'paymentType.keyword': PaymentType.Card } },
            { term: { rejected: true } },
          ],
        },
      },
    };

    if (paymentType) {
      body.query.bool.must.push({
        term: {
          'paymentType.keyword': paymentType,
        },
      });
    }

    if (query) {
      body.query.bool.must.push({ query_string: { query } });
    }

    if (guestId) {
      body.query.bool.must.push({ term: { 'guest.id': guestId } });
    }

    const response = await this.elasticsearch.nativeSearch(Order, {
      body,
      sort,
      size: limit,
      from: offset,
    });

    return this.elasticsearch.parseToGql(Order, response);
  }

  async getOutstandingGuests(args: OutstandingGuestsArgs) {
    const { limit, offset, sort, paymentType } = args;

    const aggregation = await this.orderRepository.aggregate([
      {
        $sort: sort?.dateCreated
          ? {
              dateCreated: sort.dateCreated === PaginationSort.Asc ? -1 : 1,
            }
          : sort?.id
          ? {
              _id: sort.id === PaginationSort.Asc ? -1 : 1,
            }
          : {
              _id: 1,
            },
      },
      {
        $match: {
          $and: [
            {
              paid: {
                $ne: true,
              },
            },
            {
              paymentType: {
                $ne: PaymentType.None,
              },
            },
            {
              paymentType: {
                $ne: PaymentType.Card,
              },
            },
            {
              hotel: {
                $eq: new ObjectId(this.hotel),
              },
            },
            paymentType
              ? {
                  paymentType: {
                    $eq: paymentType,
                  },
                }
              : {},
          ],
        },
      },
      {
        $facet: {
          count: [{ $count: 'count' }],
          data: [
            {
              $group: {
                _id: '$guest',
                totalPrice: { $sum: '$totalPrice' },
                noOrders: { $sum: 1 },
              },
            },
            {
              $lookup: {
                from: 'guest',
                localField: '_id',
                foreignField: '_id',
                as: 'guest',
              },
            },
          ],
        },
      },
    ]);

    let data: OutstandingGuestsResponse['data'];

    if (!aggregation.length) {
      return { data: [], count: 0 };
    }

    data = aggregation[0].data.map((document: any) => {
      delete document._id;
      document.guest = document.guest[0];

      document.guest.id = String(document.guest._id);
      delete document.guest._id;

      return document;
    });

    if (limit && offset) {
      data = data.splice(offset, limit);
    } else if (limit) {
      data = data.splice(0, limit);
    }

    const count = aggregation[0].count[0].count;

    return { data, count };
  }

  async getOutstandingOrdersStatistics(): Promise<OutstandingOrdersStatisticsResponse> {
    const aggregation = await this.orderRepository.aggregate([
      {
        $match: {
          $and: [
            {
              paid: {
                $ne: true,
              },
            },
            {
              paymentType: {
                $ne: PaymentType.None,
              },
            },
            {
              paymentType: {
                $ne: PaymentType.Card,
              },
            },
            {
              hotel: {
                $eq: new ObjectId(this.hotel),
              },
            },
          ],
        },
      },
      {
        $group: {
          _id: '$paymentType',
          noOrders: { $sum: 1 },
          totalPrice: { $sum: '$totalPrice' },
          guests: { $addToSet: '$guest' },
        },
      },
      {
        $project: {
          paymentType: 1,
          noOrders: 1,
          totalPrice: 1,
          noGuests: { $size: '$guests' },
        },
      },
    ]);

    const result: Partial<OutstandingOrdersStatisticsResponse> = {};

    const defaultValue = {
      cash: {
        paymentType: PaymentType.Cash,
        noGuests: 0,
        noOrders: 0,
        totalPrice: 0,
      },
      roomBill: {
        paymentType: PaymentType.RoomBill,
        noGuests: 0,
        noOrders: 0,
        totalPrice: 0,
      },
    };

    aggregation.forEach((group) => {
      const keyName = group._id === PaymentType.Cash ? 'cash' : 'roomBill';

      result[keyName] = {
        paymentType: group._id,
        noOrders: group.noOrders,
        totalPrice: group.totalPrice,
        noGuests: group.noGuests,
      };
    });

    if (!result.cash) {
      result.cash = defaultValue.cash;
    }

    if (!result.roomBill) {
      result.roomBill = defaultValue.roomBill;
    }

    return result as OutstandingOrdersStatisticsResponse;
  }

  async findOutstandingOrdersByGuest(guest: Guest, paymentType: PaymentType) {
    const outstandingOrders = this.repository.find({
      guest,
      paymentType,
      paid: { $ne: true },
    });

    return outstandingOrders;
  }

  get triggerAutoProgressOrder() {
    return this.autoProgressOrderClient.trigger.bind(
      this.autoProgressOrderClient
    );
  }
}
