import { Collection, Loaded, LoadedCollection, wrap } from '@mikro-orm/core';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { HotelGuard, UserGuard, UserRole } from '@src/modules/auth/guards';
import { Hotel } from '@src/modules/hotel/entities';
import { HotelService } from '@src/modules/hotel/hotel.service';
import { Role } from '@src/modules/role/role.entity';
import { UserService } from '@src/modules/user/user.service';
import { Context, Ctx, Ses, UserSession } from '@src/utils/context';
import {
  AuthenticationError,
  InvalidSessionError,
  NotFoundError,
} from '@src/utils/errors';
import { SDKMutation, SDKQuery } from '@src/utils/gql';
import UAParser from 'ua-parser-js';
import {
  SubscribeUserPushNotificationsArgs,
  UnsubscribeUserPushNotificationsArgs,
  UpdateUserArgs,
  WhereUserArgs,
} from './dto/user.args';
import { User, UserPushSubscription } from './user.entity';

@Resolver()
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly hotelService: HotelService
  ) {}

  @UseGuards(HotelGuard(UserRole.HotelMember))
  @Query(() => [User], { name: 'users' })
  @SDKQuery(() => User, { name: 'users', omit: ['group'] })
  async getUsers(@Ses() session: UserSession): Promise<User[]> {
    const user = await this.userService.findOne(session.userId);
    await wrap(user.group).init();

    if (user.group.hotelManager) {
      const users = await this.userService.findAll();

      return users
        .map((u) => {
          u.hotelManager = !!u.group.hotelManager;
          return u;
        })
        .filter((user) => user.id !== session.userId);
    }

    const users = await this.userService.repository.find(
      {
        group: user.group.id,
      },
      { populate: ['group', 'hotels', 'roles'] }
    );

    return users.filter((user) => user.id !== session.userId);
  }

  @UseGuards(HotelGuard(UserRole.HotelMember))
  @Mutation(() => Boolean)
  @SDKMutation(() => Boolean)
  async deleteUser(
    @Ses() session: UserSession,
    @Args() whereUserArgs: WhereUserArgs
  ) {
    const user = await this.userService.findOne(session.userId);

    const deleteUser = await this.userService.findOne(whereUserArgs.where.id);

    await this.userService.delete(deleteUser);

    if (user.group.hotelManager) {
      await this.userService.flush();
      return true;
    }

    if (user.group.id === deleteUser.group.id) {
      if (user.groupAdmin) {
        await this.userService.flush();
        return true;
      }

      const userRoles = await user.roles.loadItems();
      const hotelRole = userRoles.find(
        (userRole) => userRole.hotel.id === session.hotel
      )?.role;

      if (hotelRole === UserRole.HotelAdmin && !deleteUser.groupAdmin) {
        await this.userService.flush();
        return true;
      }
    }

    throw new AuthenticationError();
  }

  @UseGuards(UserGuard)
  @Query(() => User, { name: 'user' })
  @SDKQuery(() => User, { name: 'user' })
  async getUser(@Ses() session: UserSession): Promise<User> {
    const user = await this.userService.findOne(session.userId);
    await wrap(user.group).init();
    const roles = await user.roles.loadItems();

    let hotels: Hotel[];

    if (user.group.hotelManager) {
      user.hotelManager = user.group.hotelManager;
      hotels = await this.hotelService.findAll();
    } else if (user.group.demo) {
      hotels = await user.hotels.loadItems();
    } else if (user.groupAdmin) {
      const groupHotels = await this.hotelService.findByGroupID();
      hotels = groupHotels;
    } else {
      hotels = await user.hotels.loadItems();
    }

    user.hotels = hotels as unknown as Collection<Hotel, unknown> &
      LoadedCollection<Loaded<Hotel, never>>;
    user.roles = roles as unknown as Collection<Role, unknown> &
      LoadedCollection<Loaded<Role, never>>;

    return user;
  }

  @UseGuards(HotelGuard(UserRole.HotelMember))
  @Mutation(() => User)
  @SDKMutation(() => User)
  async updateUser(
    @Ses() session: UserSession,
    @Args() updateUserArgs: UpdateUserArgs
  ): Promise<User> {
    const userId = updateUserArgs.where?.id || session.userId;

    const updateUser = await this.userService.findOne(userId);
    await wrap(updateUser.group).init();

    if (!updateUserArgs.where?.id) {
      delete updateUserArgs.data.hotels;
      wrap(updateUser).assign(updateUserArgs.data);
      await this.userService.flush();
      return updateUser;
    }

    const user = await this.userService.findOne(session.userId);
    await wrap(user.group).init();

    if (updateUserArgs.data.hotels?.length) {
      updateUser.groupAdmin = false;

      const userRoles = await user.roles.loadItems();

      userRoles.forEach((role) => {
        if (
          !updateUserArgs.data
            .hotels!.map((hotel) => hotel.id)
            .includes(role.hotel.id)
        ) {
          this.userService.deleteRole(role);
        }
      });

      let shouldActivateHotelAdmin = true;

      const updateUserHotels = await updateUser.hotels.loadItems();

      updateUserArgs.data.hotels.forEach((hotel) => {
        if (updateUserHotels.map((hotel) => hotel.id).includes(hotel.id)) {
          return;
        }

        updateUser.hotels.add(this.hotelService.getReference(hotel.id));

        const updateRole = new Role();
        updateRole.hotel = this.hotelService.getReference(hotel.id);
        updateRole.user = updateUser;
        updateRole.role = hotel.role;

        updateUser.roles.add(updateRole);

        if (
          userRoles.find((role) => role.hotel.id === hotel.id)?.role !==
          UserRole.HotelAdmin
        ) {
          shouldActivateHotelAdmin = false;
        }
      });

      if (!user.groupAdmin && !shouldActivateHotelAdmin) {
        throw new AuthenticationError();
      }
    } else if (updateUserArgs.data.groupAdmin) {
      updateUser.hotels.removeAll();
      await this.userService.deleteRolesbyUserID(updateUser.id);
      updateUser.groupAdmin = true;
    }

    if (user.group.hotelManager) {
      await this.userService.flush();
      return updateUser;
    }

    if (user.group.id === updateUser.group.id) {
      if (user.groupAdmin) {
        await this.userService.flush();
        return updateUser;
      }

      const userRoles = await user.roles.loadItems();
      const hotelRole = userRoles.find(
        (userRole) => userRole.hotel.id === session.hotel
      )?.role;

      if (hotelRole === UserRole.HotelAdmin && !updateUser.groupAdmin) {
        await this.userService.flush();
        return user;
      }
    }

    throw new AuthenticationError();
  }

  @UseGuards(HotelGuard(UserRole.HotelMember))
  @Mutation(() => User)
  @SDKMutation(() => User, { omit: ['hotels', 'roles', 'group'] })
  async subscribeUserPushNotifications(
    @Args()
    subscribeUserPushNotificationsArgs: SubscribeUserPushNotificationsArgs,
    @Ses() session: UserSession,
    @Ctx() context: Context
  ): Promise<User> {
    if (!session.userId) {
      throw new InvalidSessionError('user');
    }

    const { deviceId, pushSubscription, sound } =
      subscribeUserPushNotificationsArgs;

    const user = await this.userService.findOne(session.userId);

    const userAgent = new UAParser(context.req.headers['user-agent']);

    if (!user.pushSubscriptions) {
      user.pushSubscriptions = [] as unknown as UserPushSubscription[] &
        UserPushSubscription;
    }

    const existingPushSubscription = user.pushSubscriptions!.find(
      (sub) => sub.id === deviceId
    );

    if (existingPushSubscription) {
      existingPushSubscription.pushSubscription = pushSubscription;
      existingPushSubscription.sound =
        sound !== undefined ? sound : existingPushSubscription.sound;
      existingPushSubscription.enabled = true;
      existingPushSubscription.device = {
        vendor: userAgent.getDevice().vendor,
        model: userAgent.getDevice().model,
        type: userAgent.getDevice().type,
        browser: userAgent.getBrowser().name,
        os:
          userAgent.getOS().name === 'Mac OS'
            ? 'macOS'
            : userAgent.getOS().name,
      };

      const existingPushSubscriptionIdx = user.pushSubscriptions!.findIndex(
        (sub) => sub.id === deviceId
      );

      const { pushSubscriptions } = user;

      pushSubscriptions![existingPushSubscriptionIdx] =
        existingPushSubscription;

      wrap(user).assign({ pushSubscriptions });
    } else {
      const { pushSubscriptions } = user;

      pushSubscriptions!.push({
        id: deviceId,
        enabled: true,
        pushSubscription: pushSubscription,
        device: {
          vendor: userAgent.getDevice().vendor,
          model: userAgent.getDevice().model,
          type: userAgent.getDevice().type,
          browser: userAgent.getBrowser().name,
          os:
            userAgent.getOS().name === 'Mac OS'
              ? 'macOS'
              : userAgent.getOS().name,
        },
        dateUpdated: new Date(),
        sound: sound === undefined ? true : sound,
      });
    }

    await this.userService.flush();

    return user;
  }

  @UseGuards(HotelGuard(UserRole.HotelMember))
  @Mutation(() => User)
  @SDKMutation(() => User, { omit: ['hotels', 'roles', 'group'] })
  async unsubscribeUserPushNotifications(
    @Args()
    unsubscribeUserPushNotificationsArgs: UnsubscribeUserPushNotificationsArgs,
    @Ses() session: UserSession
  ): Promise<User> {
    if (!session.userId) {
      throw new InvalidSessionError('hotel');
    }

    const { deviceId } = unsubscribeUserPushNotificationsArgs;

    const user = await this.userService.findOne(session.userId);

    if (!user.pushSubscriptions) {
      throw new NotFoundError(User, {
        'user.pushSubscriptions.id': deviceId,
      });
    }

    const existingPushSubscriptionIdx = user.pushSubscriptions.findIndex(
      (sub) => sub.id === deviceId
    );

    if (existingPushSubscriptionIdx > -1) {
      const { pushSubscriptions } = user;

      pushSubscriptions[existingPushSubscriptionIdx].enabled = false;

      wrap(user).assign({ pushSubscriptions });
    } else {
      throw new NotFoundError(User, {
        'user.pushSubscriptions.id': deviceId,
      });
    }

    await this.userService.flush();

    return user;
  }
}
