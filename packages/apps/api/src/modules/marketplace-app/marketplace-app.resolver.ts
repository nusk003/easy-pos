import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AccessTokenSession } from '@src/modules/auth/auth.types';
import { ConnectRole, HotelGuard, UserRole } from '@src/modules/auth/guards';
import {
  Hotel,
  HotelMarketplaceAppSubscription,
} from '@src/modules/hotel/entities';
import { HotelService } from '@src/modules/hotel/hotel.service';
import { User } from '@src/modules/user/user.entity';
import { UserService } from '@src/modules/user/user.service';
import { Ses, UserSession } from '@src/utils/context';
import { generatePassword } from '@src/utils/encryption/generate-password';
import {
  AuthenticationError,
  BadRequestError,
  ConflictError,
  NotFoundError,
} from '@src/utils/errors';
import { SDKMutation, SDKQuery } from '@src/utils/gql';
import axios from 'axios';
import { v4 as uuid } from 'uuid';
import {
  CreateMarketplaceAppArgs,
  CreateMarketplaceAppSubscriptionArgs,
  DeleteMarketplaceAppArgs,
  DeleteMarketplaceAppSubscription,
  GetMarketplaceAppArgs,
  GetMarketplaceAppsArgs,
  UpdateMarketplaceAppArgs,
  UpdateMarketplaceAppSubscription,
} from './dto/marketplace-app.args';
import {
  MarketplaceApp,
  MarketplaceAppKeyType,
} from './marketplace-app.entity';
import { MarketplaceAppService } from './marketplace-app.service';

@Resolver()
export class MarketplaceAppResolver {
  constructor(
    private readonly marketplaceAppService: MarketplaceAppService,
    private readonly userService: UserService,
    private readonly hotelService: HotelService
  ) {}

  @UseGuards(HotelGuard(UserRole.HotelMember))
  @Query(() => [MarketplaceApp], { name: 'marketplaceApps' })
  @SDKQuery(() => [MarketplaceApp], { name: 'marketplaceApps' })
  async getMarketplaceApps(
    @Args() marketplaceAppsArgs: GetMarketplaceAppsArgs
  ): Promise<MarketplaceApp[]> {
    const marketplaceApps = await this.marketplaceAppService.findAll(
      marketplaceAppsArgs
    );
    return marketplaceApps;
  }

  @UseGuards(HotelGuard(UserRole.HotelMember))
  @Query(() => MarketplaceApp, { name: 'marketplaceApp', nullable: true })
  @SDKQuery(() => MarketplaceApp, { name: 'marketplaceApp' })
  async getMarketplaceApp(
    @Args() marketplaceAppArgs: GetMarketplaceAppArgs
  ): Promise<MarketplaceApp | null> {
    if (marketplaceAppArgs.where.id && marketplaceAppArgs.where.developer) {
      throw new BadRequestError(
        'The requested operation failed as both `id` and `developer` parameters were provided. Only one of these parameters is permitted.'
      );
    }

    if (!marketplaceAppArgs.where.id && !marketplaceAppArgs.where.developer) {
      throw new BadRequestError(
        'The requested operation failed as no `id` or `developer` parameters were provided.'
      );
    }

    const queryOpts = {
      live: marketplaceAppArgs.live,
      enabled: marketplaceAppArgs.enabled,
    };

    if (marketplaceAppArgs.where.developer) {
      return this.marketplaceAppService.findOneByDeveloper(
        marketplaceAppArgs.where.developer,
        queryOpts
      );
    }

    return this.marketplaceAppService.findOne(
      marketplaceAppArgs.where.id!,
      queryOpts
    );
  }

  @UseGuards(HotelGuard(UserRole.HotelMember))
  @Mutation(() => MarketplaceApp)
  @SDKMutation(() => MarketplaceApp)
  async createMarketplaceApp(
    @Args() createMarketplaceAppArgs: CreateMarketplaceAppArgs,
    @Ses() session: UserSession
  ): Promise<MarketplaceApp> {
    const user = await this.userService.findOne(session.userId);

    if (!user.developer) {
      throw new AuthenticationError();
    }

    const exitingMarketplaceApp =
      await this.marketplaceAppService.findOneByDeveloper(user.id);

    if (exitingMarketplaceApp) {
      throw new ConflictError(User, { id: user.id });
    }

    const marketplaceApp = new MarketplaceApp(createMarketplaceAppArgs);
    marketplaceApp.developer = this.userService.getReference(session.userId);
    this.marketplaceAppService.persist(marketplaceApp);
    await this.marketplaceAppService.flush();
    return marketplaceApp;
  }

  @UseGuards(HotelGuard(UserRole.HotelMember))
  @Mutation(() => MarketplaceApp)
  @SDKMutation(() => MarketplaceApp)
  async updateMarketplaceApp(
    @Args() updateMarketplaceAppArgs: UpdateMarketplaceAppArgs,
    @Ses() session: UserSession
  ): Promise<MarketplaceApp> {
    const exitingMarketplaceApp =
      await this.marketplaceAppService.findOneByDeveloper(session.userId);

    if (exitingMarketplaceApp?.id !== updateMarketplaceAppArgs.where.id) {
      throw new AuthenticationError();
    }

    const marketplaceApp = await this.marketplaceAppService.update(
      updateMarketplaceAppArgs
    );
    await this.marketplaceAppService.flush();
    return marketplaceApp;
  }

  @UseGuards(HotelGuard(UserRole.HotelMember))
  @Mutation(() => Boolean)
  @SDKMutation(() => Boolean)
  async deleteMarketplaceApp(
    @Args() deleteMarketplaceAppArgs: DeleteMarketplaceAppArgs,
    @Ses() session: UserSession
  ): Promise<boolean> {
    const exitingMarketplaceApp =
      await this.marketplaceAppService.findOneByDeveloper(session.userId);

    if (exitingMarketplaceApp?.id !== deleteMarketplaceAppArgs.where.id) {
      throw new AuthenticationError();
    }

    await this.marketplaceAppService.delete(deleteMarketplaceAppArgs);
    await this.marketplaceAppService.flush();
    return true;
  }

  @UseGuards(HotelGuard(ConnectRole.AccessToken))
  @Query(() => [HotelMarketplaceAppSubscription], {
    name: 'marketplaceAppSubscriptions',
  })
  @SDKQuery(() => [HotelMarketplaceAppSubscription], {
    name: 'marketplaceAppSubscriptions',
  })
  async getMarketplaceAppSubscriptions(
    @Ses() session: AccessTokenSession
  ): Promise<HotelMarketplaceAppSubscription[]> {
    const hotel = await this.hotelService.findOne(session.hotel!);

    const marketplaceApp = hotel.integrations?.marketplaceApps?.find(
      (app) => app.id.toString() === session.marketplaceId
    );

    return marketplaceApp?.subscriptions || [];
  }

  @UseGuards(HotelGuard(ConnectRole.AccessToken))
  @Mutation(() => HotelMarketplaceAppSubscription)
  @SDKMutation(() => HotelMarketplaceAppSubscription)
  async createMarketplaceAppSubscription(
    @Args()
    createMarketplaceAppSubscriptionArgs: CreateMarketplaceAppSubscriptionArgs,
    @Ses() session: AccessTokenSession
  ): Promise<HotelMarketplaceAppSubscription> {
    const { endpoint, topics } = createMarketplaceAppSubscriptionArgs;

    const hotel = await this.hotelService.findOne(session.hotel!);

    const marketplaceAppIdx = hotel.integrations?.marketplaceApps?.findIndex(
      (app) => app.id.toString() === session.marketplaceId
    );

    if (
      marketplaceAppIdx === undefined ||
      !hotel.integrations?.marketplaceApps?.[marketplaceAppIdx]
    ) {
      throw new NotFoundError(Hotel, {
        marketplaceAppId: session.marketplaceId,
      });
    }

    const subscription = {
      endpoint,
      topics,
      id: uuid(),
    };

    if (!hotel.integrations.marketplaceApps[marketplaceAppIdx].subscriptions) {
      hotel.integrations.marketplaceApps[marketplaceAppIdx].subscriptions = [];
    }

    try {
      await axios.post(subscription.endpoint);
    } catch {
      throw new BadRequestError(
        `The requested operation failed as the provided endpoint \`${subscription.endpoint}\` did not respond with a 2xx status code`
      );
    }

    hotel.integrations.marketplaceApps[marketplaceAppIdx].subscriptions!.push(
      subscription
    );

    this.hotelService.persist(hotel);
    await this.hotelService.flush();

    return subscription;
  }

  @UseGuards(HotelGuard(ConnectRole.AccessToken))
  @Mutation(() => HotelMarketplaceAppSubscription)
  @SDKMutation(() => HotelMarketplaceAppSubscription)
  async updateMarketplaceAppSubscription(
    @Args()
    updateMarketplaceAppSubscriptionArgs: UpdateMarketplaceAppSubscription,
    @Ses() session: AccessTokenSession
  ): Promise<HotelMarketplaceAppSubscription> {
    const {
      where: { id: subscriptionId },
      data: subscription,
    } = updateMarketplaceAppSubscriptionArgs;

    if (subscription.endpoint !== undefined) {
      try {
        await axios.post(subscription.endpoint);
      } catch {
        throw new BadRequestError(
          `The requested operation failed as the provided endpoint \`${subscription.endpoint}\` did not respond with a 2xx status code`
        );
      }
    }

    const hotel = await this.hotelService.findOne(session.hotel!);

    const marketplaceApp = hotel.integrations?.marketplaceApps?.find(
      (app) => app.id.toString() === session.marketplaceId
    );

    const idx = marketplaceApp?.subscriptions?.findIndex(
      (sub) => sub.id === subscriptionId
    );

    if (idx === undefined || !marketplaceApp?.subscriptions?.[idx]) {
      throw new NotFoundError(HotelMarketplaceAppSubscription, {
        id: subscriptionId,
      });
    }

    marketplaceApp.subscriptions[idx] = {
      ...marketplaceApp.subscriptions[idx],
      ...subscription,
    };

    this.hotelService.persist(hotel);
    await this.hotelService.flush();

    return marketplaceApp.subscriptions[idx];
  }

  @UseGuards(HotelGuard(ConnectRole.AccessToken))
  @Mutation(() => Boolean)
  @SDKMutation(() => Boolean)
  async deleteMarketplaceAppSubscription(
    @Args()
    deleteMarketplaceAppSubscriptionArgs: DeleteMarketplaceAppSubscription,
    @Ses() session: AccessTokenSession
  ): Promise<boolean> {
    const {
      where: { id: subscriptionId },
    } = deleteMarketplaceAppSubscriptionArgs;

    const hotel = await this.hotelService.findOne(session.hotel!);

    const marketplaceApp = hotel.integrations?.marketplaceApps?.find(
      (app) => app.id.toString() === session.marketplaceId
    );

    const idx = marketplaceApp?.subscriptions?.findIndex(
      (sub) => sub.id === subscriptionId
    );

    if (idx !== undefined) {
      marketplaceApp?.subscriptions?.splice(idx, 1);
    }

    this.hotelService.persist(hotel);
    await this.hotelService.flush();

    return true;
  }

  @UseGuards(HotelGuard(ConnectRole.AccessToken))
  @Mutation(() => Boolean)
  @SDKMutation(() => Boolean)
  async deleteMarketplaceAppSubscriptions(
    @Ses() session: AccessTokenSession
  ): Promise<boolean> {
    const hotel = await this.hotelService.findOne(session.hotel!);

    const marketplaceApp = hotel.integrations?.marketplaceApps?.find(
      (app) => app.id.toString() === session.marketplaceId
    );

    delete marketplaceApp?.subscriptions;

    this.hotelService.persist(hotel);
    await this.hotelService.flush();

    return true;
  }

  @UseGuards(HotelGuard(UserRole.HotelMember))
  @Mutation(() => String)
  @SDKMutation(() => String)
  async generateMarketplaceAppKey(
    @Ses() session: UserSession
  ): Promise<string> {
    const user = await this.userService.findOne(session.userId);

    if (!user.developer) {
      throw new AuthenticationError();
    }

    const marketplaceApp = await this.marketplaceAppService.findOneByDeveloper(
      user.id
    );

    if (!marketplaceApp) {
      throw new NotFoundError(MarketplaceApp, { developer: user.id });
    }

    const key = generatePassword();

    marketplaceApp.key = {
      key,
      type: MarketplaceAppKeyType.Default,
    };

    await this.marketplaceAppService.persist(marketplaceApp).flush();

    return key;
  }
}
