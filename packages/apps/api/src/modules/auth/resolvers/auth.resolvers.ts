import { Collection, Loaded, LoadedCollection, wrap } from '@mikro-orm/core';
import { forwardRef, Inject, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { __demo_group_id__, __hm_group_id__ } from '@src/constants';
import { AuthService } from '@src/modules/auth/auth.service';
import {
  AccessTokenSession,
  CookieName,
  GuestLoginSession,
  UserLoginSession,
  UserSession,
} from '@src/modules/auth/auth.types';
import {
  AnonGuestLoginArgs,
  ConnectMarketplaceAppArgs,
  DisconnectMarketplaceAppArgs,
  GetAccessTokenArgs,
  GetUserLoginTokenArgs,
  GuestLoginArgs,
  SendGuestTokenArgs,
  SendUserTokenArgs,
  UserLoginArgs,
} from '@src/modules/auth/dto/auth.args';
import {
  AccessTokenGrantLevel,
  ConnectMarketplaceAppResponse,
  GetAccessTokenResponse,
  GetUserLoginTokenResponse,
} from '@src/modules/auth/dto/auth.responses';
import {
  ConnectRole,
  GuestLoginAuthGuard,
  GuestRole,
  HotelGuard,
  UserGuard,
} from '@src/modules/auth/guards';
import { UserLoginAuthGuard } from '@src/modules/auth/guards/user-login-auth.guard';
import { Guest } from '@src/modules/guest/guest.entity';
import { GuestService } from '@src/modules/guest/guest.service';
import { Hotel } from '@src/modules/hotel/entities';
import { HotelService } from '@src/modules/hotel/hotel.service';
import { MarketplaceAppService } from '@src/modules/marketplace-app/marketplace-app.service';
import { Role, UserRole } from '@src/modules/role/role.entity';
import { User } from '@src/modules/user/user.entity';
import { UserService } from '@src/modules/user/user.service';
import { Ses } from '@src/utils/context';
import { Ctx } from '@src/utils/context/context.decorator';
import { Context } from '@src/utils/context/context.type';
import {
  AuthenticationError,
  BadRequestError,
  MissingHeaderError,
  NotFoundError,
} from '@src/utils/errors';
import { SDKMutation, SDKQuery } from '@src/utils/gql';
import dayjs from 'dayjs';
import { ObjectId } from 'mongodb';
import { sha256 } from 'js-sha256';

@Resolver()
export class AuthResolver {
  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    @Inject(forwardRef(() => GuestService))
    private guestService: GuestService,
    @Inject(forwardRef(() => HotelService))
    private hotelService: HotelService,
    @Inject(forwardRef(() => MarketplaceAppService))
    private marketplaceAppService: MarketplaceAppService,
    private authService: AuthService
  ) {}

  @Mutation(() => Boolean)
  @SDKMutation(() => Boolean)
  async sendUserToken(
    @Args() sendUserTokenArgs: SendUserTokenArgs
  ): Promise<boolean> {
    const { email } = sendUserTokenArgs;

    const user = await this.userService.findOneByEmail(email);

    const { token: verificationToken, expiry: verificationTokenExpiry } =
      this.authService.generateLoginToken();

    wrap(user).assign({
      verificationToken,
      verificationTokenExpiry,
    });
    await this.userService.flush();

    await this.authService.sendUserToken(
      user,
      sendUserTokenArgs.verificationTokenOnly
    );

    return true;
  }

  @UseGuards(UserLoginAuthGuard)
  @Mutation(() => User)
  @SDKMutation(() => User, { omit: ['group'] })
  async userLogin(@Ctx() context: Context): Promise<User> {
    const session = <UserLoginSession>context.req.user;

    const user = await this.userService.findOne(session.userId);
    const roles = await user.roles.loadItems();

    await this.authService.authenticateUser(user, context);

    let hotels: Hotel[];

    if (user.group.id === __hm_group_id__) {
      user.hotelManager = user.group.hotelManager;
      hotels = await this.hotelService.findAll();
    } else if (user.group.id === __demo_group_id__) {
      hotels = await user.hotels.loadItems();
    } else if (user.groupAdmin) {
      const groupHotels = await this.hotelService.findByGroupID(user.group.id);
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

  @Mutation(() => User)
  @SDKMutation(() => User, { omit: ['group'] })
  async userTokenLogin(
    @Ctx() context: Context,
    @Args() userLoginArgs: UserLoginArgs
  ): Promise<User> {
    const user = await this.userService.findOneByEmail(userLoginArgs.email);

    if (user.password !== sha256(userLoginArgs.password)) {
      throw new AuthenticationError();
    }

    // user.verificationToken = undefined;
    // user.verificationTokenExpiry = undefined;

    await this.userService.flush();

    const roles = await user.roles.loadItems();

    await this.authService.authenticateUser(user, context);

    let hotels: Hotel[];

    if (user.group.id === __hm_group_id__) {
      user.hotelManager = user.group.hotelManager;
      hotels = await this.hotelService.findAll();
    } else if (user.group.id === __demo_group_id__) {
      hotels = await user.hotels.loadItems();
    } else if (user.groupAdmin) {
      const groupHotels = await this.hotelService.findByGroupID(user.group.id);
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

  @UseGuards(UserGuard)
  @Mutation(() => Boolean)
  @SDKMutation(() => Boolean)
  async userLogout(@Ctx() context: Context): Promise<boolean> {
    await this.authService.logoutUser(context);
    return true;
  }

  @Mutation(() => Guest)
  @SDKMutation(() => Guest, {
    fields: ['id', 'dateCreated', 'dateUpdated', 'deviceId'],
  })
  async anonGuestLogin(
    @Ctx() context: Context,
    @Args() anonGuestLoginArgs: AnonGuestLoginArgs
  ): Promise<Guest> {
    const { deviceId } = anonGuestLoginArgs;
    const hotelId = <string | undefined>context.req.headers?.['hotel-id'];
    const authToken = <string | undefined>(
      (
        <string>context.req.headers?.['authorization'] ||
        <string>context.req.headers?.['Authorization'] ||
        <string>context.req.cookies?.[CookieName.Guest]
      )?.replace('Bearer ', '')
    );
    let guest = await this.guestService.findAnonGuest(deviceId);

    if (!guest) {
      guest = await this.guestService.createAnonGuest({
        deviceId,
        hotelId,
      });
      guest._id = new ObjectId();

      await this.guestService.indexOne(guest, { refresh: 'false' });
      await this.guestService.flush();
      await this.authService.authenticateGuest(guest, context, {
        anonAuth: true,
      });
    } else if (!authToken) {
      await this.authService.authenticateGuest(guest, context, {
        anonAuth: true,
      });
    } else {
      const key = this.authService.decryptJWT(authToken);
      await this.authService.reauthenticateAnonGuest(key, guest, context);
    }

    return guest;
  }

  @UseGuards(GuestLoginAuthGuard)
  @Mutation(() => Boolean)
  @SDKMutation(() => Boolean)
  async sendGuestToken(
    @Ctx() context: Context,
    @Args() sendGuestTokenArgs: SendGuestTokenArgs
  ): Promise<boolean> {
    const hotelId = <string | undefined>context.req.headers?.['hotel-id'];
    const authToken = <string>(
      (
        <string>context.req.headers?.['authorization'] ||
        <string>context.req.headers?.['Authorization'] ||
        <string>context.req.cookies?.[CookieName.Guest]
      )?.replace('Bearer ', '')
    );

    if (!hotelId) {
      throw new MissingHeaderError('hotel-id');
    }

    const hotel = await this.hotelService.findOne(hotelId);

    const { email, deviceId } = sendGuestTokenArgs;

    const guest = await this.guestService.findOneByEmail(email);

    if (guest.deleted) {
      throw new NotFoundError(Guest, { email });
    }

    const { token: verificationToken, expiry: verificationTokenExpiry } =
      this.authService.generateLoginToken();

    wrap(guest).assign({
      deviceId,
      verificationToken,
      verificationTokenExpiry,
    });

    const key = this.authService.decryptJWT(authToken);
    await this.authService.sendGuestToken(guest, hotel, key);

    this.guestService.persist(guest);
    await this.guestService.flush();
    await this.guestService.indexOne(guest);

    return true;
  }

  @UseGuards(GuestLoginAuthGuard)
  @Mutation(() => Guest)
  @SDKMutation(() => Guest, {
    fields: ['id'],
  })
  async guestLogin(
    @Ctx() context: Context,
    @Args() guestLoginArgs: GuestLoginArgs
  ): Promise<Guest> {
    const { deviceId, email, verificationToken } = guestLoginArgs;

    const guest = await this.guestService.findOneByEmail(email);

    if (
      guest.verificationToken !== verificationToken ||
      !guest.verificationTokenExpiry ||
      dayjs().isAfter(guest.verificationTokenExpiry)
    ) {
      throw new AuthenticationError();
    }

    if (guest.deleted) {
      guest.deleted = false;
    }

    guest.verificationToken = undefined;
    guest.verificationTokenExpiry = undefined;
    guest.deviceId = deviceId;

    await this.guestService.persist(guest);
    await this.guestService.deleteAnonGuests(deviceId);
    await this.guestService.flush();
    await this.guestService.indexOne(guest);

    await this.authService.authenticateGuest(guest, context);

    return guest;
  }

  @UseGuards(HotelGuard(GuestRole.Identified))
  @Mutation(() => Boolean)
  @SDKMutation(() => Boolean)
  async guestLogout(@Ctx() context: Context): Promise<boolean> {
    await this.authService.logoutUser(context);
    return true;
  }

  @UseGuards(GuestLoginAuthGuard)
  @Mutation(() => Guest)
  @SDKMutation(() => Guest, { fields: ['id'] })
  async guestTokenLogin(@Ctx() context: Context): Promise<Guest> {
    const session = context.req.user as unknown as GuestLoginSession;

    const { deviceId, guestId, sessionId } = session;

    const guest = await this.guestService.findOne(guestId);

    guest.verificationToken = undefined;
    guest.verificationTokenExpiry = undefined;
    guest.deviceId = deviceId;

    await this.guestService.persist(guest);
    await this.guestService.deleteAnonGuests(deviceId);
    await this.guestService.flush();
    await this.guestService.indexOne(guest);

    await this.authService.deleteSession(sessionId);
    await this.authService.authenticateGuest(guest, context);

    return guest;
  }

  @UseGuards(UserGuard)
  @Query(() => GetUserLoginTokenResponse, { name: 'userLoginToken' })
  @SDKQuery(() => GetUserLoginTokenResponse, { name: 'userLoginToken' })
  async getUserLoginToken(
    @Ses() session: UserSession,
    @Args() getUserLoginTokenArgs: GetUserLoginTokenArgs
  ): Promise<GetUserLoginTokenResponse> {
    const { redirectURL, hotelId, hideSidebar } = getUserLoginTokenArgs;

    let user: User;

    try {
      user = await this.userService.findOne(session.userId!);
    } catch {
      throw new AuthenticationError();
    }

    const loginLink = await this.authService.getUserToken(
      user,
      redirectURL,
      hotelId,
      hideSidebar
    );

    return { loginLink };
  }

  @UseGuards(HotelGuard(UserRole.HotelAdmin))
  @Mutation(() => ConnectMarketplaceAppResponse)
  @SDKMutation(() => ConnectMarketplaceAppResponse)
  async connectMarketplaceApp(
    @Ses() session: UserSession,
    @Args() connectMarketplaceAppArgs: ConnectMarketplaceAppArgs
  ): Promise<ConnectMarketplaceAppResponse> {
    const marketplaceApp = await this.marketplaceAppService.findOne(
      connectMarketplaceAppArgs.id
    );

    if (
      !marketplaceApp?.redirectURLs.includes(
        connectMarketplaceAppArgs.redirectURL
      )
    ) {
      throw new AuthenticationError();
    }

    const hotel = await this.hotelService.findOne(session.hotel!);

    const redirectURL = await this.authService.authenticateMarketplaceApp(
      marketplaceApp.id,
      session.userId,
      connectMarketplaceAppArgs.redirectURL
    );

    if (
      !hotel.integrations?.marketplaceApps?.find(
        (app) => app.id.toString() === marketplaceApp.id
      )
    ) {
      if (!hotel.integrations) {
        hotel.integrations = {};
      }

      if (!hotel.integrations.marketplaceApps) {
        hotel.integrations.marketplaceApps = [];
      }

      hotel.integrations.marketplaceApps.push({
        id: new ObjectId(marketplaceApp.id),
        name: marketplaceApp.name,
        type: marketplaceApp.type,
      });

      this.hotelService.persist(hotel);
      await this.hotelService.flush();
    }

    return {
      redirectURL,
    };
  }

  @UseGuards(HotelGuard(UserRole.HotelAdmin, ConnectRole.AccessToken))
  @Mutation(() => Boolean)
  @SDKMutation(() => Boolean)
  async disconnectMarketplaceApp(
    @Ses() session: UserSession | AccessTokenSession,
    @Args() disconnectMarketplaceAppArgs: DisconnectMarketplaceAppArgs
  ): Promise<boolean> {
    const marketplaceId =
      'accessToken' in session
        ? session.marketplaceId
        : disconnectMarketplaceAppArgs.id;

    if (!marketplaceId) {
      throw new BadRequestError(
        'The requested operation failed as no marketplace ID was provided.'
      );
    }

    const marketplaceApp = await this.marketplaceAppService.findOne(
      marketplaceId
    );

    const hotel = await this.hotelService.findOne(session.hotel!);

    const appIdx = hotel.integrations?.marketplaceApps?.findIndex(
      (app) => app.id === marketplaceApp?.id
    );

    if (appIdx !== undefined) {
      hotel.integrations!.marketplaceApps!.splice(appIdx, 1);
    }

    this.hotelService.persist(hotel);
    await this.hotelService.flush();

    if ('accessToken' in session) {
      await this.authService.expireSession(session);
    }

    return true;
  }

  @UseGuards(HotelGuard(ConnectRole.AccessToken))
  @Query(() => Boolean)
  @SDKQuery(() => Boolean)
  async accessTokenValid(): Promise<boolean> {
    return true;
  }

  @Query(() => GetAccessTokenResponse, { name: 'accessToken' })
  @SDKQuery(() => GetAccessTokenResponse, { name: 'accessToken' })
  async getAccessToken(
    @Args() getAccessTokenArgs: GetAccessTokenArgs
  ): Promise<GetAccessTokenResponse> {
    if (!getAccessTokenArgs.authToken && !getAccessTokenArgs.refreshToken) {
      throw new BadRequestError(
        'The requested operation failed as no `accessToken` or `refreshToken` were provided.'
      );
    }

    if (getAccessTokenArgs.authToken && getAccessTokenArgs.refreshToken) {
      throw new BadRequestError(
        'The requested operation failed as both `accessToken` and `refreshToken` parameters were provided. Only one of these parameters is permitted.'
      );
    }

    const { accessToken, refreshToken } =
      await this.authService.authenticateMarketplaceAppUser(
        getAccessTokenArgs.authToken || getAccessTokenArgs.refreshToken!,
        getAccessTokenArgs.hotelId
      );

    const grantLevel = [AccessTokenGrantLevel.User];

    if (getAccessTokenArgs.hotelId) {
      grantLevel.push(AccessTokenGrantLevel.Hotel);
    }

    return { accessToken, refreshToken, ttl: 60 * 60, grantLevel };
  }
}
