import { Action } from '@hm/sdk';
import { wrap } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/mongodb';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  ConnectRole,
  GuestRole,
  HotelGuard,
  UserRole,
} from '@src/modules/auth/guards';
import { BookingsService } from '@src/modules/booking/booking.service';
import { GroupService } from '@src/modules/group/group.service';
import { GuestService } from '@src/modules/guest/guest.service';
import { IntegrationType } from '@src/modules/hotel/entities';
import { HotelService } from '@src/modules/hotel/hotel.service';
import { IntegrationsApaleoService } from '@src/modules/integrations/services/integrations-apaleo.service';
import { IntegrationsMewsService } from '@src/modules/integrations/services/integrations-mews.service';
import { IntegrationsOmnivoreService } from '@src/modules/integrations/services/integrations-omnivore.service';
import { PaymentIntentStatus } from '@src/modules/payments/dto/payments.responses';
import { PaymentsService } from '@src/modules/payments/payments.service';
import { PricelistService } from '@src/modules/pricelist/pricelist.service';
import { SpaceService } from '@src/modules/space/space.service';
import { GuestSession, Ses, Session } from '@src/utils/context';
import { BadRequestError, InternalError } from '@src/utils/errors';
import { SDKMutation, SDKQuery } from '@src/utils/gql';
import { ObjectId } from 'mongodb';
import { customAlphabet } from 'nanoid';
import Stripe from 'stripe';
import {
  CreateOrderArgs,
  OrderPaginationArgs,
  OrderPaginationSearchArgs,
  OutstandingGuestsArgs,
  SearchOutstandingOrdersArgs,
  SettleOrderArgs,
  UpdateOrderArgs,
  WhereOrderArgs,
} from './dto/order.args';
import {
  CreateOrderResponse,
  OutstandingGuestsResponse,
  OutstandingOrdersStatisticsResponse,
  SearchOrdersResponse,
  SearchOutstandingOrdersResponse,
} from './dto/order.responses';
import { Order, OrderStatus, PaymentType } from './order.entity';
import { OrderService } from './order.service';

@Resolver()
export class OrderResolver {
  constructor(
    private readonly orderService: OrderService,
    private readonly mewsService: IntegrationsMewsService,
    private readonly apaleoService: IntegrationsApaleoService,
    private readonly omnivoreService: IntegrationsOmnivoreService,
    private readonly groupService: GroupService,
    private readonly hotelService: HotelService,
    private readonly bookingService: BookingsService,
    private readonly pricelistService: PricelistService,
    private readonly spaceService: SpaceService,
    private readonly guestService: GuestService,
    private readonly paymentsService: PaymentsService,
    private readonly em: EntityManager
  ) {}

  @UseGuards(
    HotelGuard(
      UserRole.HotelMember,
      GuestRole.Identified,
      ConnectRole.AccessToken
    )
  )
  @Query(() => [Order], { name: 'orders' })
  @SDKQuery(() => [Order], { name: 'orders' })
  async getOrders(
    @Args() orderPaginationArgs: OrderPaginationArgs,
    @Ses() session: Session
  ): Promise<Order[]> {
    const guestId =
      'guestId' in session ? session.guestId : orderPaginationArgs.guestId;

    if (guestId) {
      return this.orderService.findOrdersByGuest(guestId, {
        ...orderPaginationArgs,
        populate: ['pricelist', 'space'],
      });
    }

    return this.orderService.find({
      ...orderPaginationArgs,
      populate: ['guest', 'pricelist', 'space'],
    });
  }

  @UseGuards(HotelGuard(UserRole.HotelMember))
  @Query(() => Number, { name: 'activeOrdersCount' })
  @SDKQuery(() => Number, { name: 'activeOrdersCount' })
  async getActiveOrdersCount(): Promise<number> {
    const activeOrdersCount = await this.orderService.activeOrdersCount();
    return activeOrdersCount;
  }

  @UseGuards(HotelGuard(UserRole.HotelMember))
  @Query(() => SearchOrdersResponse)
  @SDKQuery(() => SearchOrdersResponse)
  async searchOrders(
    @Args() orderPaginationSearchArgs: OrderPaginationSearchArgs
  ): Promise<SearchOrdersResponse> {
    const orders = await this.orderService.search(orderPaginationSearchArgs);
    return orders;
  }

  @UseGuards(
    HotelGuard(
      UserRole.HotelMember,
      GuestRole.Identified,
      ConnectRole.AccessToken
    )
  )
  @Query(() => Order, { name: 'order' })
  @SDKQuery(() => Order, { name: 'order' })
  async getOrder(
    @Args() whereOrderArgs: WhereOrderArgs,
    @Ses() session: Session
  ): Promise<Order> {
    const order = await this.orderService.findOne(
      whereOrderArgs.where.id,
      (<GuestSession>session).guestId
    );
    return order;
  }

  @UseGuards(
    HotelGuard(
      UserRole.HotelMember,
      GuestRole.Identified,
      ConnectRole.AccessToken
    )
  )
  @Mutation(() => CreateOrderResponse)
  @SDKMutation(() => CreateOrderResponse)
  async createOrder(
    @Args() createOrderArgs: CreateOrderArgs,
    @Ses() session: Session
  ): Promise<CreateOrderResponse> {
    const guestId = createOrderArgs.guestId || (<GuestSession>session).guestId!;

    if ('userId' in session && !guestId) {
      throw new BadRequestError(
        'The requested operation failed as no guest ID was provided.'
      );
    }

    const pricelist = await this.pricelistService.findOne(
      createOrderArgs.pricelistId
    );

    const order = new Order(createOrderArgs);

    const nanoid = customAlphabet('123456789abcdefhjknopqrtuv', 6);
    const orderReference = nanoid();

    const space = this.spaceService.getReference(pricelist.space.id);

    const guest = await this.guestService.findOne(guestId);

    const paymentSource = order.cardDetails?.id;

    let paymentIntent: Stripe.Response<Stripe.PaymentIntent> | undefined;

    const hotel = await this.hotelService.findOne(this.orderService.hotel);

    const marketplaceAppPOSID = hotel?.integrations?.marketplaceApps?.find(
      (app) => app.type === IntegrationType.POS
    )?.id;

    if (marketplaceAppPOSID) {
      order.posId = marketplaceAppPOSID.toString();
    }

    await this.em
      .transactional(async (em) => {
        order.hotel = this.orderService.hotelReference;

        if (createOrderArgs.paymentIntentId) {
          paymentIntent = await this.paymentsService.confirmPaymentIntent(
            order
          );
        } else if (paymentSource) {
          paymentIntent = await this.paymentsService.createPaymentIntent(
            guest,
            order.totalPrice,
            paymentSource
          );
        }

        if (paymentIntent?.status === 'requires_action') {
          return;
        }

        const orderDiscount = createOrderArgs?.discount;

        if (orderDiscount) {
          const discountIndex = pricelist.promotions?.discounts?.findIndex(
            (discount) => discount.id === orderDiscount.id
          );

          if (discountIndex && discountIndex > -1) {
            const discount = pricelist.promotions!.discounts![discountIndex]!;

            if (!discount?.count) {
              discount!.count = 0;
            }

            discount!.count += 1;

            pricelist.promotions!.discounts![discountIndex] = discount;

            em.persist(pricelist);
          }
        }

        if (order.cardDetails) {
          delete order.cardDetails.id;
        }

        if (order.dateScheduled) {
          order.dateScheduled = new Date(order.dateScheduled);
        }

        order.paymentIntentId = paymentIntent?.id;

        wrap(order).assign(
          {
            _id: new ObjectId(),
            guest,
            orderReference,
            pricelist,
            space,
            hotel: this.orderService.hotel,
            group: this.orderService.group,
          },
          { em }
        );

        const currentBooking = await this.bookingService.getCurrentBooking(
          guestId
        );

        if (order.paymentType === PaymentType.RoomBill && currentBooking) {
          await wrap(hotel.group).init();

          if (hotel?.integrations?.mews) {
            await this.mewsService.addOrderToReservation(order);
          } else if (hotel.group.integrations?.apaleo) {
            await this.apaleoService.addOrderToReservation(
              currentBooking,
              order
            );
          }
          order.paid = true;
        }

        if (pricelist.posSettings?.enabled) {
          const group = await this.groupService.findOne(
            this.pricelistService.group
          );
          if (group.integrations?.omnivore) {
            await this.omnivoreService.createTicket(order);
          }
        }

        await this.orderService.indexOne(order);

        em.persist(order);
      })
      .catch(async (err) => {
        console.error(err);
        if (paymentSource && paymentIntent?.id) {
          await this.paymentsService.cancelPaymentIntent(order);
        }
        throw new InternalError(err);
      });

    if (paymentIntent?.status === 'requires_action') {
      return {
        paymentIntent: {
          status: paymentIntent.status as PaymentIntentStatus,
          clientSecret: paymentIntent.client_secret || undefined,
        },
      };
    }

    const message = {
      data: {
        ...wrap(order).toJSON(),
        hotel: order.hotel.id,
        pricelist: {
          id: pricelist.id,
          name: pricelist.name,
        },
        space: {
          id: space.id,
          name: space.name,
        },
        guest: {
          id: guest.id,
          firstName: guest.firstName,
          lastName: guest.lastName,
        },
        items: undefined,
      },
      action: Action.NewOrder,
    };
    delete message.data.items;

    await this.orderService.guestAppPushNotifications.trigger({
      guest,
      priority: 'high',
      title: 'Thank you for submitting an order 👋',
      body: "We'll keep you updated with it's progress.",
      data: message,
      lambda: false,
    });

    await this.orderService.cloudConsolePushNotifications.trigger({
      data: message,
    });

    await this.orderService.wsClient.broadcastToUsers(hotel, message);

    if (pricelist.autoApprove) {
      await this.orderService.triggerAutoProgressOrder({
        order,
        waitDuration: 5,
        status: OrderStatus.Approved,
      });
    }

    const response: CreateOrderResponse = {
      order,
    };

    if (paymentIntent) {
      response.paymentIntent = {
        status: paymentIntent?.status as PaymentIntentStatus,
      };
    }

    this.orderService.webhookServiceClient.triggerWebhooks(
      order,
      Action.NewOrder
    );

    return response;
  }

  @UseGuards(
    HotelGuard(
      UserRole.HotelMember,
      GuestRole.Identified,
      ConnectRole.AccessToken
    )
  )
  @Mutation(() => Order)
  @SDKMutation(() => Order)
  async updateOrder(
    @Args() updateOrderArgs: UpdateOrderArgs,
    @Ses() session: Session
  ): Promise<Order> {
    const order = await this.orderService.findOne(
      updateOrderArgs.where.id,
      (<GuestSession>session).guestId
    );

    const { status, feedback } = updateOrderArgs.data;

    await this.em.transactional(async (em) => {
      if (status === OrderStatus.Rejected) {
        wrap(order).assign({ rejected: true }, { em });
      } else if (status === OrderStatus.Approved) {
        wrap(order).assign({ dateApproved: new Date() }, { em });
      } else if (status === OrderStatus.Ready) {
        wrap(order).assign({ dateReady: new Date() }, { em });
      } else if (status === OrderStatus.Completed) {
        wrap(order).assign({ dateCompleted: new Date() }, { em });
      }

      if (feedback) {
        wrap(order).assign({ feedback }, { em });
      }

      await wrap(order.guest).init();
      await wrap(order.space).init();

      await this.orderService.indexOne(order);

      this.orderService.persist(order);
    });

    if (!status) {
      return order;
    }

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
      action: Action.UpdateOrder,
    };
    delete message.data.items;

    if (order.status === OrderStatus.Approved) {
      await this.orderService.guestAppPushNotifications.trigger({
        guest: order.guest,
        title: 'Your order has been approved 😊',
        body: `Our staff is busy preparing your order from ${order.space.name}! We'll get it to you as soon as we can.`,
        data: message,
        priority: 'high',
      });
    } else if (
      order.status === OrderStatus.Rejected &&
      !('guestId' in session)
    ) {
      await this.orderService.guestAppPushNotifications.trigger({
        guest: order.guest,
        title: 'We were unable to process your order 😕',
        body: 'Unfortunately we are not able to handle your order right now. Click here for more details.',
        data: message,
        priority: 'high',
      });
    }

    if (order.status === OrderStatus.Approved) {
      await this.orderService.triggerAutoProgressOrder({
        order,
        waitDuration: 86400,
        status: OrderStatus.Ready,
      });
    } else if (order.status === OrderStatus.Ready) {
      await this.orderService.triggerAutoProgressOrder({
        order,
        waitDuration: 86400,
        status: OrderStatus.Completed,
      });
    }

    this.orderService.webhookServiceClient.triggerWebhooks(
      order,
      Action.UpdateOrder
    );

    return order;
  }

  @UseGuards(HotelGuard(UserRole.HotelMember))
  @Query(() => SearchOutstandingOrdersResponse)
  @SDKQuery(() => SearchOutstandingOrdersResponse)
  async searchOutstandingOrders(
    @Args()
    searchOutstandingOrdersArgs: SearchOutstandingOrdersArgs
  ): Promise<SearchOutstandingOrdersResponse> {
    const outstandingOrders = await this.orderService.searchOutstandingOrders(
      searchOutstandingOrdersArgs
    );
    return outstandingOrders;
  }

  @UseGuards(HotelGuard(UserRole.HotelMember))
  @Query(() => OutstandingGuestsResponse, { name: 'outstandingGuests' })
  @SDKQuery(() => OutstandingGuestsResponse, { name: 'outstandingGuests' })
  async getOutstandingGuests(
    @Args() getOutstandingGuestsArgs: OutstandingGuestsArgs
  ): Promise<OutstandingGuestsResponse> {
    const outstandingGuests = await this.orderService.getOutstandingGuests(
      getOutstandingGuestsArgs
    );

    return outstandingGuests;
  }

  @UseGuards(HotelGuard(UserRole.HotelMember))
  @Query(() => OutstandingOrdersStatisticsResponse, {
    name: 'outstandingOrdersStatistics',
  })
  @SDKQuery(() => OutstandingOrdersStatisticsResponse, {
    name: 'outstandingOrdersStatistics',
  })
  async getOutstandingOrdersStatistics(): Promise<OutstandingOrdersStatisticsResponse> {
    const outstandingOrdersStatistics =
      await this.orderService.getOutstandingOrdersStatistics();

    return outstandingOrdersStatistics;
  }

  @UseGuards(HotelGuard(UserRole.HotelMember))
  @Mutation(() => Boolean)
  @SDKMutation(() => Boolean)
  async settleOrders(
    @Args() settleOrderArgs: SettleOrderArgs
  ): Promise<boolean> {
    const { guestId, orderId, paymentType } = settleOrderArgs;

    if (guestId && orderId) {
      throw new BadRequestError(
        'The requested operation failed as only one of guestId and orderId can be specified.'
      );
    }

    if (!guestId && !orderId) {
      throw new BadRequestError(
        'The requested operation failed as no guestId or orderId were specified.'
      );
    }

    if (guestId && !paymentType) {
      throw new BadRequestError(
        'The requested operation failed as no paymentType was specified.'
      );
    }

    if (orderId) {
      const order = await this.orderService.findOne(orderId);
      wrap(order).assign({ paid: true });
      this.orderService.persist(order);
      await this.orderService.flush();
      await this.orderService.indexOne(order);
      return true;
    } else {
      const guest = this.guestService.getReference(guestId!);
      const orders = await this.orderService.findOutstandingOrdersByGuest(
        guest,
        paymentType!
      );

      orders.forEach((order) => {
        wrap(order).assign({ paid: true });
        this.orderService.persist(order);
      });

      await this.orderService.flush();
      await this.orderService.indexMany(orders);

      return true;
    }
  }
}
