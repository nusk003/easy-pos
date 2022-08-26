import { EntityRepository } from '@mikro-orm/mongodb';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { CONTEXT } from '@nestjs/graphql';
import { __cloud_console_url__ } from '@src/constants';
import { Guest } from '@src/modules/guest/guest.entity';
import { Hotel, PayoutsStrategy } from '@src/modules/hotel/entities';
import { Order } from '@src/modules/order/order.entity';
import { User } from '@src/modules/user/user.entity';
import { GuestSession } from '@src/utils/context';
import { Context } from '@src/utils/context/context.type';
import {
  BadRequestError,
  InvalidSessionError,
  NotFoundError,
} from '@src/utils/errors';
import { Awaited } from '@src/utils/types';
import { ObjectId } from 'mongodb';
import { InjectStripe } from 'nestjs-stripe';
import Stripe from 'stripe';

export interface GuestPaymentMethod {
  id: string;
  brand: string;
  country?: string;
  last4: string;
}

export type PaymentMethodsListResponse = Awaited<
  ReturnType<typeof Stripe['PaymentMethodsResource']['prototype']['list']>
>;

export type StripePayoutSchedule =
  Stripe.AccountUpdateParams.Settings.Payouts.Schedule;

export interface CreateStripeExternalAccountOptions {
  stripeAccountId: string;
  countryCode: string;
  currencyCode: string;
  accountNumber: string;
  sortCode: string;
}

@Injectable({ scope: Scope.REQUEST })
export class PaymentsService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: EntityRepository<Order>,
    @InjectRepository(Hotel)
    private readonly hotelRepository: EntityRepository<Hotel>,
    @InjectRepository(Guest)
    private readonly guestRepository: EntityRepository<Guest>,
    @Inject(CONTEXT) private context: Context,
    @InjectStripe() private readonly stripeClient: Stripe
  ) {}

  async createPaymentIntent(
    guest: Guest,
    totalPrice: number,
    paymentSource: string
  ) {
    const session = <GuestSession>this.context.req.user;

    if (!session.hotel) {
      throw new InvalidSessionError('hotel');
    }

    const hotel = await this.hotelRepository.findOne(session.hotel);

    if (!hotel) {
      throw new NotFoundError(Hotel, { id: session.hotel });
    }

    const amount = Math.round(totalPrice * 100);

    if (hotel.payouts?.enabled === PayoutsStrategy.Stripe) {
      if (hotel.payouts.stripe!.accountId) {
        return this.stripeClient.paymentIntents.create(
          {
            amount,
            currency: hotel.currencyCode,
            payment_method_types: ['card'],
            payment_method: paymentSource,
            customer: guest.payments!.stripe!.commonCustomerId,
            description: 'Paid via Hotel Manager',
            confirm: true,
            confirmation_method: 'manual',
          },
          { stripeAccount: hotel.payouts.stripe!.accountId }
        );
      }

      const customerToken = await this.stripeClient.tokens.create(
        {
          customer: guest.payments!.stripe!.commonCustomerId,
          card: paymentSource,
        },
        {
          stripeAccount: hotel.payouts.stripe!.accountId,
        }
      );

      const customer = await this.stripeClient.customers.create(
        {
          source: customerToken.id,
        },
        {
          stripeAccount: hotel.payouts.stripe!.accountId,
        }
      );

      return this.stripeClient.paymentIntents.create(
        {
          amount,
          currency: hotel.currencyCode,
          payment_method_types: ['card'],
          payment_method: <string>customer.default_source,
          customer: customer.id,
          confirm: true,
          confirmation_method: 'manual',
        },
        {
          stripeAccount: hotel.payouts.stripe!.accountId,
        }
      );
    } else if (hotel.payouts?.enabled === PayoutsStrategy.HotelManagerPay) {
      return this.stripeClient.paymentIntents.create({
        amount,
        currency: hotel.currencyCode,
        payment_method_types: ['card'],
        payment_method: paymentSource,
        customer: guest.payments!.stripe!.commonCustomerId,
        description: JSON.stringify({ hotelId: hotel._id }),
        confirm: true,
        confirmation_method: 'manual',
      });
    }
  }

  async confirmPaymentIntent(order: Order) {
    const hotel = await this.hotelRepository.findOne(order.hotel.id);

    if (!hotel) {
      throw new NotFoundError(Hotel, { id: order.hotel.id });
    }

    if (!order.paymentIntentId) {
      throw new BadRequestError(
        'Invalid order document. Must provide an order with a specified paymentIntent in order to confirm.'
      );
    }

    if (order.paymentProvider === PayoutsStrategy.Stripe) {
      return this.stripeClient.paymentIntents.confirm(order.paymentIntentId, {
        stripeAccount: hotel.payouts!.stripe!.accountId,
      });
    } else if (order.paymentProvider === PayoutsStrategy.HotelManagerPay) {
      return this.stripeClient.paymentIntents.confirm(order.paymentIntentId);
    }
  }

  async cancelPaymentIntent(order: Order) {
    const hotel = await this.hotelRepository.findOne(order.hotel.id);

    if (!hotel) {
      throw new NotFoundError(Hotel, { id: order.hotel.id });
    }

    if (!order.paymentIntentId) {
      throw new BadRequestError(
        'Invalid order document. Must provide an order with a specified paymentIntent in order to cancel.'
      );
    }

    if (order.paymentProvider === PayoutsStrategy.Stripe) {
      await this.stripeClient.paymentIntents.cancel(order.paymentIntentId, {
        stripeAccount: hotel.payouts!.stripe!.accountId,
      });
    } else if (order.paymentProvider === PayoutsStrategy.HotelManagerPay) {
      await this.stripeClient.paymentIntents.cancel(order.paymentIntentId);
    }
  }

  async createGuestPaymentMethod(guest: Guest, name: string, token: string) {
    const session = <GuestSession>this.context.req.user;

    if (!session.hotel) {
      throw new InvalidSessionError('hotel');
    }

    const hotel = await this.hotelRepository.findOne(session.hotel);

    if (!hotel) {
      throw new NotFoundError(Hotel, { id: session.hotel });
    }

    if (guest.payments?.stripe?.commonCustomerId) {
      await this.stripeClient.customers.createSource(
        guest.payments.stripe.commonCustomerId,
        {
          source: token,
        },
        hotel.payouts?.stripe?.accountId
          ? { stripeAccount: hotel.payouts?.stripe?.accountId }
          : {}
      );
    } else {
      const customer = await this.stripeClient.customers.create(
        {
          name,
          email: guest.email,
          source: token,
        },
        hotel.payouts?.stripe?.accountId
          ? { stripeAccount: hotel.payouts?.stripe?.accountId }
          : {}
      );

      guest.payments = {
        ...guest.payments,
        stripe: { ...guest.payments?.stripe, commonCustomerId: customer.id },
      };

      this.guestRepository.persist(guest);
      await this.guestRepository.flush();
    }
  }

  async getGuestPaymentMethods(guest: Guest): Promise<GuestPaymentMethod[]> {
    const session = <GuestSession>this.context.req.user;

    const hotel = await this.hotelRepository.findOne(session.hotel!);

    if (!hotel) {
      throw new NotFoundError(Hotel, { id: session.hotel });
    }

    if (
      hotel?.payouts?.enabled === PayoutsStrategy.Disabled ||
      !guest.payments?.stripe
    ) {
      return [];
    }

    const cards = await this.stripeClient.paymentMethods.list(
      {
        customer: guest.payments.stripe.commonCustomerId!,
        type: 'card',
      },
      hotel.payouts?.stripe?.accountId
        ? { stripeAccount: hotel.payouts?.stripe?.accountId }
        : {}
    );

    return cards!.data.map((data) => ({
      id: data.id,
      brand: data.card!.brand,
      country: data.card!.country || undefined,
      last4: data.card!.last4,
    }));
  }

  async deleteGuestPaymentMethod(guest: Guest, paymentMethodId: string) {
    const session = <GuestSession>this.context.req.user;

    if (!session.hotel) {
      throw new InvalidSessionError('hotel');
    }

    const hotel = await this.hotelRepository.findOne(session.hotel);

    if (!hotel) {
      throw new NotFoundError(Hotel, { id: session.hotel });
    }

    await this.stripeClient.customers.deleteSource(
      guest.payments!.stripe!.commonCustomerId!,
      paymentMethodId,
      hotel.payouts?.stripe?.accountId
        ? { stripeAccount: hotel.payouts?.stripe?.accountId }
        : {}
    );
  }

  async getEstimatedPayouts(
    payoutsStrategy: PayoutsStrategy,
    startDate: Date,
    endDate: Date
  ) {
    const session = <GuestSession>this.context.req.user;

    if (!session.hotel) {
      throw new InvalidSessionError('hotel');
    }

    const aggregation = await this.orderRepository.aggregate([
      {
        $match: {
          paymentProvider: payoutsStrategy,
          dateCreated: { $gte: startDate, $lte: endDate },
          hotel: {
            $eq: new ObjectId(session.hotel),
          },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalPrice' },
          count: { $sum: 1 },
        },
      },
    ]);

    if (aggregation?.[0]) {
      const { total, count } = aggregation[0];

      return { totalPrice: total * 0.986 - count * 0.2, arrivalDate: endDate };
    }

    return {
      totalPrice: 0,
      arrivalDate: endDate,
    };
  }

  async createStripeAccount(user: User, hotel: Hotel) {
    const stripeAccount = await this.stripeClient.accounts.create({
      type: 'custom',
      country: hotel.countryCode,
      email: user.email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });

    return stripeAccount;
  }

  async linkStripeAccount(code: string) {
    const response = await this.stripeClient.oauth.token({
      grant_type: 'authorization_code',
      code,
      scope: 'read_write',
    });

    return response;
  }

  async getStripeAccountLink(accountId: string) {
    const accountLink = await this.stripeClient.accountLinks.create({
      account: accountId,
      refresh_url: `${__cloud_console_url__}/manage/payments/stripe/refresh`,
      return_url: `${__cloud_console_url__}/manage/payments/stripe`,
      type: 'custom_account_verification',
      collect: 'eventually_due',
    });

    return accountLink.url;
  }

  async getStripeAccount(accountId: string) {
    const account = await this.stripeClient.accounts.retrieve(accountId);
    return account;
  }

  async getStripeExternalAccount(accountId: string) {
    try {
      const externalAccount =
        await this.stripeClient.accounts.listExternalAccounts(accountId);
      return externalAccount.data[0];
    } catch (err) {
      return undefined;
    }
  }

  async createStripeExternalAccount(opts: CreateStripeExternalAccountOptions) {
    await this.stripeClient.accounts.createExternalAccount(
      opts.stripeAccountId,
      <any>{
        external_account: {
          object: 'bank_account',
          country: opts.countryCode,
          currency: opts.currencyCode,
          account_number: opts.accountNumber,
          routing_number: opts.sortCode,
        },
        default_for_currency: true,
      }
    );
  }

  async updateStripePayoutSchedule(
    stripeAccountId: string,
    schedule: StripePayoutSchedule
  ) {
    await this.stripeClient.accounts.update(stripeAccountId, {
      settings: { payouts: { schedule } },
    });
  }

  async deleteStripeExternalAccount(
    stripeAccountId: string,
    bankAccountId: string
  ) {
    await this.stripeClient.accounts.deleteExternalAccount(
      stripeAccountId,
      bankAccountId
    );
  }

  async getLastStripePayout(stripeAccountId: string) {
    const lastPayoutResponse = await this.stripeClient.payouts.list(
      {
        limit: 1,
      },
      {
        stripeAccount: stripeAccountId,
      }
    );

    if (lastPayoutResponse?.data?.[0]) {
      const payout = lastPayoutResponse.data[0];
      return {
        totalPrice: payout.amount / 100,
        arrivalDate: new Date(payout.arrival_date * 1000),
      };
    }

    return {
      totalPrice: 0,
      arrivalDate: undefined,
    };
  }
}
