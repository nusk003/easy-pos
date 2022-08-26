import { wrap } from '@mikro-orm/core';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GuestRole, HotelGuard, UserRole } from '@src/modules/auth/guards';
import { GuestService } from '@src/modules/guest/guest.service';
import {
  Hotel,
  HotelPayouts,
  PayoutInterval,
  PayoutsStrategy,
} from '@src/modules/hotel/entities';
import { HotelService } from '@src/modules/hotel/hotel.service';
import { UserService } from '@src/modules/user/user.service';
import { GuestSession, Ses, UserSession } from '@src/utils/context';
import {
  BadRequestError,
  ConflictError,
  InvalidSessionError,
  NotFoundError,
} from '@src/utils/errors';
import { SDKMutation, SDKQuery } from '@src/utils/gql';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import Stripe from 'stripe';
import {
  CreateGuestPaymentArgs,
  CreateHMPayAccountArgs,
  DeletePaymentMethodArgs,
  EnablePayoutsArgs,
  LinkStripeAccountArgs,
  UpdateHMPayExternalAccountArgs,
  UpdateStripeExternalAccountArgs,
} from './dto/payments.args';
import {
  CreateStripeAccountResponse,
  GuestPaymentMethodsResponse,
  HMPayAccountResponse,
  PayoutValueResponse,
  StripeAccountResponse,
} from './dto/payments.responses';
import { PaymentsService, StripePayoutSchedule } from './payments.service';

dayjs.extend(utc);

@Resolver()
export class PaymentsResolver {
  constructor(
    private readonly paymentService: PaymentsService,
    private readonly hotelService: HotelService,
    private readonly guestService: GuestService,
    private readonly userService: UserService
  ) {}

  @UseGuards(HotelGuard(GuestRole.Identified))
  @Mutation(() => Boolean)
  @SDKMutation(() => Boolean)
  async createGuestPaymentMethod(
    @Args() createGuestPaymentArgs: CreateGuestPaymentArgs,
    @Ses() session: GuestSession
  ): Promise<boolean> {
    const guest = await this.guestService.findOne(session.guestId);
    await this.paymentService.createGuestPaymentMethod(
      guest,
      createGuestPaymentArgs.name,
      createGuestPaymentArgs.token
    );

    return true;
  }

  @UseGuards(HotelGuard(GuestRole.Identified))
  @Mutation(() => Boolean)
  @SDKMutation(() => Boolean)
  async deleteGuestPaymentMethod(
    @Args() deletePaymentMethodArgs: DeletePaymentMethodArgs,
    @Ses() session: GuestSession
  ): Promise<boolean> {
    const guest = await this.guestService.findOne(session.guestId);
    await this.paymentService.deleteGuestPaymentMethod(
      guest,
      deletePaymentMethodArgs.paymentMethodId
    );
    return true;
  }

  @UseGuards(HotelGuard(GuestRole.Identified))
  @Query(() => [GuestPaymentMethodsResponse], {
    name: 'guestPaymentMethods',
  })
  @SDKQuery(() => [GuestPaymentMethodsResponse], {
    name: 'guestPaymentMethods',
  })
  async getGuestPaymentMethods(
    @Ses() session: GuestSession
  ): Promise<GuestPaymentMethodsResponse[]> {
    const guest = await this.guestService.findOne(session.guestId);
    return this.paymentService.getGuestPaymentMethods(guest);
  }

  @UseGuards(HotelGuard(UserRole.HotelAdmin))
  @Mutation(() => HMPayAccountResponse)
  @SDKMutation(() => HMPayAccountResponse)
  async createHMPayAccount(
    @Args() createHMPayAccountArgs: CreateHMPayAccountArgs,
    @Ses() session: UserSession
  ): Promise<HMPayAccountResponse> {
    const { accountNumber, sortCode } = createHMPayAccountArgs;

    if (!session.hotel) {
      throw new InvalidSessionError('hotel');
    }

    const hotel = await this.hotelService.findOne(session.hotel);

    if (!hotel.payouts) {
      hotel.payouts = {};
    }

    wrap(hotel).assign(
      {
        payouts: {
          hm: {
            accountNumber,
            accountNumberLast4: accountNumber.slice(accountNumber.length - 4),
            sortCode,
            dateCreated: new Date(),
          },
          enabled: PayoutsStrategy.HotelManagerPay,
        },
      },
      { mergeObjects: true }
    );

    await this.hotelService.flush();

    const account = <HMPayAccountResponse>hotel.payouts!.hm;
    delete account.accountNumber;

    return account;
  }

  @UseGuards(HotelGuard(UserRole.HotelAdmin))
  @Mutation(() => HMPayAccountResponse)
  @SDKMutation(() => HMPayAccountResponse)
  async updateHMPayExternalAccount(
    @Args() updateExternalAccountArgs: UpdateHMPayExternalAccountArgs,
    @Ses() session: UserSession
  ): Promise<HMPayAccountResponse> {
    const { sortCode, payoutSchedule, accountNumber } =
      updateExternalAccountArgs;

    if (!session.hotel) {
      throw new InvalidSessionError('hotel');
    }

    const hotel = await this.hotelService.findOne(session.hotel);

    if (!hotel.payouts?.hm) {
      throw new NotFoundError(Hotel, { 'hotel.payouts.hm': session.hotel });
    }

    wrap(hotel).assign(
      {
        payouts: {
          hm: {
            accountNumber,
            accountNumberLast4: accountNumber.slice(accountNumber.length - 4),
            sortCode: sortCode || hotel.payouts!.hm!.sortCode,
            payoutSchedule: payoutSchedule || hotel.payouts!.hm!.payoutSchedule,
          },
        },
      },
      { mergeObjects: true }
    );

    await this.hotelService.flush();

    const account = <HMPayAccountResponse>hotel.payouts!.hm;
    delete account.accountNumber;

    return account;
  }

  @UseGuards(HotelGuard(UserRole.HotelAdmin))
  @Query(() => [HMPayAccountResponse], { name: 'hmPayAccount' })
  @SDKQuery(() => [HMPayAccountResponse], { name: 'hmPayAccount' })
  async getHMPayAccount(
    @Ses() session: UserSession
  ): Promise<HMPayAccountResponse> {
    if (!session.hotel) {
      throw new InvalidSessionError('hotel');
    }
    const hotel = await this.hotelService.findOne(session.hotel);

    if (!hotel.payouts?.hm) {
      throw new NotFoundError(Hotel, { 'hotel.payouts.hm': session.hotel });
    }

    const account = <HMPayAccountResponse>hotel.payouts!.hm;
    delete account.accountNumber;

    return account;
  }

  @UseGuards(HotelGuard(UserRole.HotelAdmin))
  @Query(() => [PayoutValueResponse], { name: 'hmPayPayouts' })
  @SDKQuery(() => [PayoutValueResponse], { name: 'hmPayPayouts' })
  async getHMPayPayouts(
    @Ses() session: UserSession
  ): Promise<PayoutValueResponse[]> {
    if (!session.hotel) {
      throw new InvalidSessionError('hotel');
    }

    const today = dayjs().toDate();

    const medianPayoutDate = dayjs(today)
      .utc(true)
      .subtract(dayjs(today).date() <= 8 ? 1 : 0, 'months')
      .date(8)
      .startOf('day')
      .toDate();

    const lastPayoutDate = dayjs(medianPayoutDate)
      .subtract(1, 'month')
      .toDate();

    const nextPayoutDate = dayjs(medianPayoutDate).add(1, 'month').toDate();

    const lastPayout = await this.paymentService.getEstimatedPayouts(
      PayoutsStrategy.HotelManagerPay,
      lastPayoutDate,
      medianPayoutDate
    );

    const currentPayout = await this.paymentService.getEstimatedPayouts(
      PayoutsStrategy.HotelManagerPay,
      medianPayoutDate,
      nextPayoutDate
    );

    return [currentPayout, lastPayout];
  }

  @UseGuards(HotelGuard(UserRole.HotelAdmin))
  @Mutation(() => CreateStripeAccountResponse)
  @SDKMutation(() => CreateStripeAccountResponse)
  async createStripeAccount(
    @Ses() session: UserSession
  ): Promise<CreateStripeAccountResponse> {
    if (!session.hotel) {
      throw new InvalidSessionError('hotel');
    }

    const hotel = await this.hotelService.findOne(session.hotel);

    if (hotel?.payouts?.stripe?.accountId) {
      throw new ConflictError(Hotel, {
        'payouts.stripe.accountId': hotel?.payouts?.stripe?.accountId,
      });
    }

    const user = await this.userService.findOne(session.userId);

    const stripeAccount = await this.paymentService.createStripeAccount(
      user,
      hotel
    );

    const accountLink = await this.paymentService.getStripeAccountLink(
      stripeAccount.id
    );

    if (!hotel.payouts) {
      hotel.payouts = {};
    }

    wrap(hotel).assign(
      {
        payouts: {
          stripe: {
            accountId: stripeAccount.id,
            dateCreated: new Date(),
          },
          enabled: PayoutsStrategy.Stripe,
        },
      },
      { mergeObjects: true }
    );

    await this.hotelService.flush();

    return { accountLink };
  }

  @UseGuards(HotelGuard(UserRole.HotelAdmin))
  @Mutation(() => Boolean)
  @SDKMutation(() => Boolean)
  async linkStripeAccount(
    @Args() linkStripeAccountArgs: LinkStripeAccountArgs,
    @Ses() session: UserSession
  ): Promise<boolean> {
    if (!session.hotel) {
      throw new InvalidSessionError('hotel');
    }

    const hotel = await this.hotelService.findOne(session.hotel);

    if (hotel?.payouts?.stripe?.accountId) {
      throw new ConflictError(Hotel, {
        'payouts.stripe.accountId': hotel?.payouts?.stripe?.accountId,
      });
    }

    const response = await this.paymentService.linkStripeAccount(
      linkStripeAccountArgs.authCode
    );

    if (!hotel.payouts) {
      hotel.payouts = {};
    }

    wrap(hotel).assign(
      {
        payouts: {
          stripe: {
            linked: true,
            accountId: response.stripe_user_id!,
            publicKey: response.stripe_publishable_key,
            accessToken: response.access_token!,
            dateCreated: new Date(),
          },
          enabled: PayoutsStrategy.Stripe,
        },
      },
      { mergeObjects: true }
    );

    await this.hotelService.flush();

    return true;
  }

  @UseGuards(HotelGuard(UserRole.HotelAdmin))
  @Query(() => StripeAccountResponse, { name: 'stripeAccount' })
  @SDKQuery(() => StripeAccountResponse, { name: 'stripeAccount' })
  async getStripeAccount(
    @Ses() session: UserSession
  ): Promise<StripeAccountResponse> {
    if (!session.hotel) {
      throw new InvalidSessionError('hotel');
    }

    const hotel = await this.hotelService.findOne(session.hotel);

    if (!hotel.payouts?.stripe?.accountId) {
      throw new NotFoundError(Hotel, {
        'hotel.payouts.stripe.accountId': hotel.id,
      });
    }

    const stripeAccount = await this.paymentService.getStripeAccount(
      hotel.payouts.stripe.accountId
    );

    const externalAccount = <Stripe.BankAccount>(
      stripeAccount.external_accounts?.data[0]
    );

    const accountNumberLast4 = externalAccount?.last4;

    const payoutsSchedule = stripeAccount.settings?.payouts?.schedule;
    const payoutInterval = payoutsSchedule?.interval;

    let payoutDate;
    let payoutIntervalEnum: PayoutInterval;
    if (payoutInterval === 'monthly') {
      payoutIntervalEnum = PayoutInterval.Monthly;
      payoutDate = payoutsSchedule?.monthly_anchor;
    } else if (payoutInterval === 'weekly') {
      payoutIntervalEnum = PayoutInterval.Weekly;
      payoutDate = payoutsSchedule?.weekly_anchor;
    } else {
      payoutIntervalEnum = PayoutInterval.Daily;
      payoutDate = payoutsSchedule?.delay_days;
    }

    const payoutsEnabled = stripeAccount?.payouts_enabled;
    const paymentsEnabled = stripeAccount?.charges_enabled;

    const pendingVerification =
      stripeAccount?.requirements?.pending_verification;

    let accountLink;

    if (
      !paymentsEnabled ||
      (!payoutsEnabled && accountNumberLast4 && !pendingVerification?.length)
    ) {
      accountLink = await this.paymentService.getStripeAccountLink(
        stripeAccount.id
      );
    }

    return {
      accountNumberLast4,
      sortCode: externalAccount?.routing_number || undefined,
      payoutSchedule:
        payoutsSchedule && payoutDate
          ? {
              interval: payoutIntervalEnum,
              date: String(payoutDate),
            }
          : undefined,
      payoutsEnabled,
      paymentsEnabled,
      accountLink: accountLink,
      dateCreated: hotel.payouts.stripe.dateCreated,
      accountNumber: <never>undefined,
    };
  }

  @UseGuards(HotelGuard(UserRole.HotelAdmin))
  @Query(() => [PayoutValueResponse], { name: 'stripePayouts', nullable: true })
  @SDKQuery(() => [PayoutValueResponse], { name: 'stripePayouts' })
  async getStripePayouts(
    @Ses() session: UserSession
  ): Promise<PayoutValueResponse[] | undefined> {
    if (!session.hotel) {
      throw new InvalidSessionError('hotel');
    }

    const hotel = await this.hotelService.findOne(session.hotel);

    if (!hotel.payouts?.stripe?.accountId) {
      throw new NotFoundError(Hotel, {
        'hotel.payouts.stripe.accountId': hotel.id,
      });
    }

    const stripeAccount = await this.paymentService.getStripeAccount(
      hotel.payouts.stripe.accountId
    );

    const payoutsSchedule = stripeAccount.settings?.payouts?.schedule;
    const payoutInterval = payoutsSchedule?.interval;

    const payoutsEnabled = stripeAccount?.payouts_enabled;

    if (!payoutsEnabled) {
      return undefined;
    }

    const lastPayout = await this.paymentService.getLastStripePayout(
      stripeAccount.id
    );

    if (!lastPayout.arrivalDate) {
      return undefined;
    }

    let currentPayoutArrivalDate = new Date(lastPayout.arrivalDate);
    if (payoutInterval === 'daily') {
      currentPayoutArrivalDate = dayjs(currentPayoutArrivalDate)
        .add(1, 'days')
        .toDate();
    } else if (payoutInterval === 'weekly') {
      currentPayoutArrivalDate = dayjs(currentPayoutArrivalDate)
        .add(7, 'days')
        .toDate();
    } else {
      currentPayoutArrivalDate = dayjs(currentPayoutArrivalDate)
        .add(1, 'months')
        .toDate();
    }

    const currentPayout = await this.paymentService.getEstimatedPayouts(
      PayoutsStrategy.Stripe,
      lastPayout.arrivalDate,
      currentPayoutArrivalDate
    );

    return [currentPayout, lastPayout];
  }

  @UseGuards(HotelGuard(UserRole.HotelAdmin))
  @Mutation(() => Boolean)
  @SDKMutation(() => Boolean)
  async updateStripeExternalAccount(
    @Args() updateExternalAccountArgs: UpdateStripeExternalAccountArgs,
    @Ses() session: UserSession
  ): Promise<boolean> {
    const { sortCode, payoutSchedule, accountNumber } =
      updateExternalAccountArgs;

    if (payoutSchedule.interval === PayoutInterval.Daily) {
      if (payoutSchedule.monthlyInterval || payoutSchedule.weeklyInterval) {
        throw new BadRequestError(
          'The requested operation failed as either a monthly or weekly interval was set. A daily interval does not support these options.'
        );
      }
    } else if (payoutSchedule.interval === PayoutInterval.Weekly) {
      if (!payoutSchedule.weeklyInterval) {
        throw new BadRequestError(
          'The requested operation failed as no weekly interval was set.'
        );
      }

      if (payoutSchedule.monthlyInterval) {
        throw new BadRequestError(
          'The requested operation failed as a monthly interval was set. A weekly interval does not support this option.'
        );
      }
    } else if (!payoutSchedule.monthlyInterval) {
      if (!payoutSchedule.monthlyInterval) {
        throw new BadRequestError(
          'The requested operation failed as no monthly interval was set.'
        );
      }

      if (payoutSchedule.weeklyInterval) {
        throw new BadRequestError(
          'The requested operation failed as a weekly interval was set. A monthly interval does not support this option.'
        );
      }
    }

    if (!session.hotel) {
      throw new InvalidSessionError('hotel');
    }

    const hotel = await this.hotelService.findOne(session.hotel);

    const stripeAccountId = hotel.payouts?.stripe?.accountId;

    if (!stripeAccountId) {
      throw new NotFoundError(Hotel, {
        'hotel.payouts.stripe.accountId': hotel.id,
      });
    }

    if (!hotel.payouts?.stripe) {
      throw new NotFoundError(Hotel, { 'hotel.payouts.stripe': session.hotel });
    }

    const stripeBankAccount =
      await this.paymentService.getStripeExternalAccount(stripeAccountId);

    await this.paymentService.createStripeExternalAccount({
      stripeAccountId,
      accountNumber,
      sortCode,
      countryCode: hotel.countryCode,
      currencyCode: hotel.currencyCode,
    });

    if (stripeBankAccount?.id) {
      await this.paymentService.deleteStripeExternalAccount(
        stripeAccountId,
        stripeBankAccount.id
      );
    }

    const schedule: StripePayoutSchedule = {};
    schedule.interval =
      payoutSchedule.interval.toLowerCase() as StripePayoutSchedule['interval'];

    if (payoutSchedule.interval === PayoutInterval.Weekly) {
      schedule.weekly_anchor =
        payoutSchedule.weeklyInterval?.toLowerCase() as StripePayoutSchedule['weekly_anchor'];
    } else if (payoutSchedule.interval === PayoutInterval.Monthly) {
      schedule.monthly_anchor = payoutSchedule.monthlyInterval;
    }

    await this.paymentService.updateStripePayoutSchedule(
      stripeAccountId,
      schedule
    );

    return true;
  }

  @UseGuards(HotelGuard(UserRole.HotelAdmin))
  @Mutation(() => HotelPayouts)
  @SDKMutation(() => HotelPayouts)
  async enableHotelPayouts(
    @Args() enablePayoutsArgs: EnablePayoutsArgs,
    @Ses() session: UserSession
  ): Promise<HotelPayouts> {
    const { payoutsStrategy } = enablePayoutsArgs;

    if (!session.hotel) {
      throw new InvalidSessionError('hotel');
    }

    const hotel = await this.hotelService.findOne(session.hotel);

    if (!hotel.payouts) {
      throw new NotFoundError(Hotel, { payouts: session.hotel });
    }

    wrap(hotel).assign(
      {
        payouts: {
          enabled: payoutsStrategy,
        },
      },
      { mergeObjects: true }
    );

    await this.hotelService.flush();

    return hotel.payouts;
  }

  @UseGuards(HotelGuard(UserRole.HotelAdmin))
  @Mutation(() => HotelPayouts)
  @SDKMutation(() => HotelPayouts)
  async disableHotelPayouts(
    @Ses() session: UserSession
  ): Promise<HotelPayouts> {
    if (!session.hotel) {
      throw new InvalidSessionError('hotel');
    }

    const hotel = await this.hotelService.findOne(session.hotel);

    if (!hotel.payouts) {
      throw new NotFoundError(Hotel, { payouts: session.hotel });
    }

    wrap(hotel).assign(
      {
        payouts: {
          enabled: PayoutsStrategy.Disabled,
        },
      },
      { mergeObjects: true }
    );

    await this.hotelService.flush();

    return hotel.payouts;
  }
}
