import { Action } from '@hm/sdk';
import { wrap } from '@mikro-orm/core';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserSession } from '@src/modules/auth/auth.types';
import {
  ConnectRole,
  GuestRole,
  HotelGuard,
  UserRole,
} from '@src/modules/auth/guards';
import { GroupService } from '@src/modules/group/group.service';
import { HotelService } from '@src/modules/hotel/hotel.service';
import { IntegrationsOmnivoreService } from '@src/modules/integrations/services/integrations-omnivore.service';
import { SpaceService } from '@src/modules/space/space.service';
import { Ses } from '@src/utils/context';
import { InvalidSessionError } from '@src/utils/errors';
import { SDKMutation, SDKQuery } from '@src/utils/gql';
import {
  CreatePricelistArgs,
  DeletePricelistArgs,
  DeletePricelistsArgs,
  UpdatePricelistArgs,
  WherePricelistArgs,
} from './dto/pricelist.args';
import { PricelistFeedback } from './dto/pricelist.responses';
import { Pricelist } from './pricelist.entity';
import { PricelistService } from './pricelist.service';

@Resolver()
export class PricelistResolver {
  constructor(
    private readonly pricelistService: PricelistService,
    private readonly spaceService: SpaceService,
    private readonly groupService: GroupService,
    private readonly hotelService: HotelService,
    private readonly omnivoreService: IntegrationsOmnivoreService
  ) {}

  @UseGuards(
    HotelGuard(UserRole.HotelMember, GuestRole.Anon, ConnectRole.AccessToken)
  )
  @Query(() => [Pricelist], { name: 'pricelists' })
  @SDKQuery(() => [Pricelist], { name: 'pricelists' })
  async getPricelists(): Promise<Pricelist[]> {
    const pricelists = await this.pricelistService.findAll();
    return pricelists;
  }

  @UseGuards(
    HotelGuard(UserRole.HotelMember, GuestRole.Anon, ConnectRole.AccessToken)
  )
  @Query(() => Pricelist, { name: 'pricelist' })
  @SDKQuery(() => Pricelist, { name: 'pricelist' })
  async getPricelistByID(
    @Args() wherePricelistArgs: WherePricelistArgs
  ): Promise<Pricelist> {
    const pricelist = await this.pricelistService.findOne(
      wherePricelistArgs.where.id
    );
    return pricelist;
  }

  @UseGuards(HotelGuard(UserRole.HotelMember))
  @Query(() => PricelistFeedback, {
    name: 'pricelistFeedback',
  })
  @SDKQuery(() => PricelistFeedback, {
    name: 'pricelistFeedback',
  })
  async getPricelistFeedback(
    @Args() wherePricelistArgs: WherePricelistArgs
  ): Promise<PricelistFeedback> {
    const pricelistFeedback = await this.pricelistService.getPricelistFeedback(
      wherePricelistArgs
    );
    return pricelistFeedback;
  }

  @UseGuards(HotelGuard(UserRole.HotelMember, ConnectRole.AccessToken))
  @Mutation(() => Pricelist)
  @SDKMutation(() => Pricelist)
  async createPricelist(@Args() createPricelistArgs: CreatePricelistArgs) {
    const pricelist = new Pricelist(createPricelistArgs);
    pricelist.space = await this.spaceService.findOne(
      createPricelistArgs.spaceId
    );

    const group = await this.groupService.findOne(this.pricelistService.group);

    const posId = createPricelistArgs.posSettings?.posId;

    if (group.integrations?.omnivore && posId) {
      const catalog = await this.omnivoreService.getCatalogFromOmnivore(posId);
      pricelist.catalog = catalog;
    }

    this.pricelistService.persist(pricelist);
    await this.pricelistService.flush();

    await this.pricelistService.webhookServiceClient.triggerWebhooks(
      pricelist,
      Action.NewPricelist
    );

    return pricelist;
  }

  @UseGuards(HotelGuard(UserRole.HotelMember, ConnectRole.AccessToken))
  @Mutation(() => Pricelist)
  @SDKMutation(() => Pricelist)
  async updatePricelist(@Args() updatePricelistArgs: UpdatePricelistArgs) {
    const pricelist = await this.pricelistService.update(updatePricelistArgs);
    await this.pricelistService.flush();

    await this.pricelistService.webhookServiceClient.triggerWebhooks(
      pricelist,
      Action.UpdatePricelist
    );

    return pricelist;
  }

  @UseGuards(HotelGuard(UserRole.HotelMember, ConnectRole.AccessToken))
  @Mutation(() => Boolean)
  @SDKMutation(() => Boolean)
  async deletePricelist(@Args() deletePricelistArgs: DeletePricelistArgs) {
    await this.pricelistService.delete(deletePricelistArgs);
    await this.pricelistService.flush();

    const pricelist = new Pricelist({ id: deletePricelistArgs.where.id });
    pricelist.hotel = this.pricelistService.hotelReference;
    await this.pricelistService.webhookServiceClient.triggerWebhooks(
      pricelist,
      Action.DeletePricelist
    );

    return true;
  }

  @UseGuards(HotelGuard(UserRole.HotelMember))
  @Mutation(() => Boolean)
  @SDKMutation(() => Boolean)
  async deletePricelists(@Args() deletePricelistsArgs: DeletePricelistsArgs) {
    await this.pricelistService.deleteMany(deletePricelistsArgs);
    await this.pricelistService.flush();

    const triggerWebhooks = deletePricelistsArgs.where.map(
      async ({ id: pricelistId }) => {
        const pricelist = new Pricelist({ id: pricelistId });
        pricelist.hotel = this.pricelistService.hotelReference;
        await this.pricelistService.webhookServiceClient.triggerWebhooks(
          pricelist,
          Action.DeletePricelist
        );
      }
    );

    await Promise.all(triggerWebhooks);

    return true;
  }

  @UseGuards(HotelGuard(UserRole.HotelMember))
  @Mutation(() => Boolean)
  @SDKMutation(() => Boolean)
  async resyncPOS(@Ses() session: UserSession) {
    const hotelId = session?.hotel;
    const groupId = session?.group;

    if (!hotelId || !groupId) {
      throw new InvalidSessionError('hotel');
    }

    const hotel = await this.hotelService.findOne(hotelId);

    await wrap(hotel.group).init();

    const pricelists = await this.pricelistService.findAll();

    const resyncPromises = pricelists.map(async (pricelist) => {
      let updatedPricelist: Pricelist | undefined;
      if (pricelist.posSettings?.posId)
        if (hotel.group.integrations?.omnivore) {
          updatedPricelist = await this.omnivoreService.resyncPOS(pricelist);
        }

      if (updatedPricelist) {
        this.pricelistService.persist(updatedPricelist);
      }
    });

    await Promise.all(resyncPromises);

    await this.pricelistService.flush();

    return true;
  }
}
