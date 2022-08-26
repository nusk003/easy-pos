import { wrap } from '@mikro-orm/core';
import { UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { AuthService } from '@src/modules/auth/auth.service';
import { ConnectRole, GuestRole, HotelGuard } from '@src/modules/auth/guards';
import { Hotel } from '@src/modules/hotel/entities';
import { HotelService } from '@src/modules/hotel/hotel.service';
import { Order } from '@src/modules/order/order.entity';
import { UserRole } from '@src/modules/role/role.entity';
import { Context, Ctx, GuestSession, Ses, Session } from '@src/utils/context';
import {
  AuthenticationError,
  BadRequestError,
  InvalidSessionError,
  NotFoundError,
} from '@src/utils/errors';
import { SDKMutation, SDKQuery } from '@src/utils/gql';
import { ObjectId } from 'mongodb';
import {
  GetGuestArgs,
  GuestPaginationArgs,
  GuestPaginationSearchArgs,
  SubscribeGuestPushNotificationsArgs,
  UpdateGuestArgs,
} from './dto/guest.args';
import {
  GuestWithStatistics,
  SearchGuestsResponse,
} from './dto/guest.responses';
import { Guest, PushNotification } from './guest.entity';
import { GuestService } from './guest.service';

@Resolver(() => GuestWithStatistics)
export class GuestResolver {
  constructor(
    private readonly guestService: GuestService,
    private readonly hotelService: HotelService,
    private readonly authService: AuthService
  ) {}

  @UseGuards(HotelGuard(UserRole.HotelMember, ConnectRole.AccessToken))
  @Query(() => [Guest], { name: 'guests' })
  @SDKQuery(() => [Guest], { name: 'guests' })
  async getGuests(
    @Args() guestPaginationArgs: GuestPaginationArgs
  ): Promise<Guest[]> {
    const guests = await this.guestService.find({
      ...guestPaginationArgs,
      populate: ['threads', 'orders', 'hotels'],
    });

    return guests;
  }

  @UseGuards(
    HotelGuard(UserRole.HotelMember, GuestRole.NoHotel, ConnectRole.AccessToken)
  )
  @Query(() => GuestWithStatistics, { name: 'guest' })
  @SDKQuery(() => GuestWithStatistics, {
    name: 'guest',
    methodName: 'guestWithStatistics',
  })
  @SDKQuery(() => Guest, { name: 'guest' })
  async getGuest(
    @Args() guestArgs: GetGuestArgs,
    @Ses() session: Session,
    @Ctx() context: Context
  ): Promise<Guest> {
    const guestId = guestArgs.where?.id || (<GuestSession>session).guestId;

    if ('userId' in session && !guestId) {
      throw new BadRequestError(
        'The requested operation failed as no guest id was specified.'
      );
    }

    if (!guestId) {
      throw new InvalidSessionError('guest');
    }

    const guest = await this.guestService.findOne(guestId, {
      populate: ['bookings'],
    });

    if (guest.deleted) {
      throw new NotFoundError(Guest, { id: guestId });
    }

    if ('guestId' in session && session.hotel) {
      const hotel = await this.hotelService.findOne(session.hotel);

      if (!hotel) {
        throw new NotFoundError(Hotel, { id: session.hotel });
      }

      guest.dateLastSeen = new Date();

      let index = false;

      if (!guest.hotels.contains(hotel)) {
        index = true;
        guest.hotels.add(hotel);
      }

      await this.guestService.flush();

      if (index) {
        await this.guestService.indexOne(guest);
      }

      await this.authService.reauthenticateUser(session, context);
    }

    return guest;
  }

  @UseGuards(
    HotelGuard(UserRole.HotelMember, GuestRole.Anon, ConnectRole.AccessToken)
  )
  @Mutation(() => Guest)
  @SDKMutation(() => Guest)
  async updateGuest(
    @Args() updateGuestArgs: UpdateGuestArgs,
    @Ses() session: Session
  ): Promise<Guest> {
    const guestId =
      updateGuestArgs.where?.id || (<GuestSession>session).guestId;

    if (
      updateGuestArgs.where?.id &&
      session.hotel !== updateGuestArgs.where?.id
    ) {
      throw new AuthenticationError();
    }

    if (!guestId) {
      throw new InvalidSessionError('hotel');
    }

    const guest = await this.guestService.findOne(guestId);

    wrap(guest).assign(updateGuestArgs.data);

    await this.guestService.persist(guest);
    await this.guestService.flush();
    await this.guestService.indexOne(guest);

    return guest;
  }

  @UseGuards(HotelGuard(GuestRole.Anon))
  @Mutation(() => Guest)
  @SDKMutation(() => Guest, { omit: ['bookings'] })
  async subscribeGuestPushNotifications(
    @Args()
    subscribeGuestPushNotificationsArgs: SubscribeGuestPushNotificationsArgs,
    @Ses() session: GuestSession
  ): Promise<Guest> {
    const guest = await this.guestService.findOne(session.guestId);

    if (!guest.pushNotifications) {
      guest.pushNotifications = [] as unknown as PushNotification[] &
        PushNotification;
    }

    const hotelPushNotification = guest.pushNotifications.find(
      (pushNotification) => String(pushNotification.hotel) === session.hotel
    );

    if (!hotelPushNotification) {
      guest.pushNotifications.push({
        hotel: new ObjectId(session.hotel),
        tokens: [subscribeGuestPushNotificationsArgs.pushNotificationToken],
      });
    } else {
      if (
        !hotelPushNotification.tokens.includes(
          subscribeGuestPushNotificationsArgs.pushNotificationToken
        )
      ) {
        hotelPushNotification?.tokens.push(
          subscribeGuestPushNotificationsArgs.pushNotificationToken
        );
      }
    }

    await this.guestService.persist(guest);
    await this.guestService.flush();

    return guest;
  }

  @UseGuards(HotelGuard(UserRole.HotelMember))
  @Query(() => SearchGuestsResponse)
  @SDKQuery(() => SearchGuestsResponse)
  async searchGuests(
    @Args() guestPaginationSearchArgs: GuestPaginationSearchArgs
  ): Promise<SearchGuestsResponse> {
    return this.guestService.search(guestPaginationSearchArgs);
  }

  @ResolveField(() => Number)
  async totalSpend(@Parent() guest: Guest): Promise<number> {
    const orders = await guest.orders.loadItems();

    return orders.reduce((totalSpend, order) => {
      return totalSpend + order.totalPrice;
    }, 0);
  }

  @ResolveField(() => Number)
  async ordersCount(@Parent() guest: Guest): Promise<number> {
    return guest.orders.loadCount();
  }

  @ResolveField(() => Number)
  async itemsCount(@Parent() guest: Guest): Promise<number> {
    const orders = await guest.orders.loadItems();

    return orders.reduce((itemsCount, order) => {
      return itemsCount + order.items.length;
    }, 0);
  }

  @ResolveField(() => [Order])
  async orders(@Parent() guest: Guest): Promise<Order[]> {
    const orders = await guest.orders.loadItems();
    return orders;
  }
}
