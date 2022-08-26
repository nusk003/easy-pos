import { Action } from '@hm/sdk';
import { EntityManager } from '@mikro-orm/mongodb';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  ConnectRole,
  GuestRole,
  HotelGuard,
  UserRole,
} from '@src/modules/auth/guards';
import { SDKMutation, SDKQuery } from '@src/utils/gql';
import {
  CreateSpaceArgs,
  DeleteSpaceArgs,
  DeleteSpacesArgs,
  UpdateSpaceArgs,
  WhereSpaceArgs,
} from './dto/space.args';
import { Space } from './space.entity';
import { SpaceService } from './space.service';

@Resolver()
export class SpaceResolver {
  constructor(
    private readonly spaceService: SpaceService,
    private readonly em: EntityManager
  ) {}

  @UseGuards(
    HotelGuard(UserRole.HotelMember, GuestRole.Anon, ConnectRole.AccessToken)
  )
  @Query(() => [Space], { name: 'spaces' })
  @SDKQuery(() => [Space], { name: 'spaces' })
  async getSpaces(): Promise<Space[]> {
    const spaces = await this.spaceService.findAll();
    return spaces;
  }

  @UseGuards(
    HotelGuard(UserRole.HotelMember, GuestRole.Anon, ConnectRole.AccessToken)
  )
  @Query(() => Space, { name: 'space' })
  @SDKQuery(() => Space, { name: 'space' })
  async getSpaceByID(@Args() whereSpaceArgs: WhereSpaceArgs): Promise<Space> {
    const space = await this.spaceService.findOne(whereSpaceArgs.where.id);
    return space;
  }

  @UseGuards(HotelGuard(UserRole.HotelMember, ConnectRole.AccessToken))
  @Mutation(() => Space)
  @SDKMutation(() => Space, { omit: ['pricelists'] })
  async createSpace(@Args() createSpaceArgs: CreateSpaceArgs): Promise<Space> {
    const space = new Space(createSpaceArgs);
    this.spaceService.persist(space);
    await this.spaceService.flush();

    await this.spaceService.webhookServiceClient.triggerWebhooks(
      space,
      Action.NewSpace
    );

    return space;
  }

  @UseGuards(HotelGuard(UserRole.HotelMember, ConnectRole.AccessToken))
  @Mutation(() => Space)
  @SDKMutation(() => Space, { omit: ['pricelists'] })
  async updateSpace(@Args() updateSpaceArgs: UpdateSpaceArgs): Promise<Space> {
    const space = await this.spaceService.update(updateSpaceArgs);
    await this.spaceService.flush();

    await this.spaceService.webhookServiceClient.triggerWebhooks(
      space,
      Action.UpdateSpace
    );

    return space;
  }

  @UseGuards(HotelGuard(UserRole.HotelMember, ConnectRole.AccessToken))
  @Mutation(() => Boolean)
  @SDKMutation(() => Boolean)
  async deleteSpace(
    @Args() deleteSpaceArgs: DeleteSpaceArgs
  ): Promise<boolean> {
    await this.spaceService.delete(deleteSpaceArgs);
    await this.spaceService.flush();

    const space = new Space({ id: deleteSpaceArgs.where.id });
    space.hotel = this.spaceService.hotelReference;
    await this.spaceService.webhookServiceClient.triggerWebhooks(
      space,
      Action.DeleteSpace
    );

    return true;
  }

  @UseGuards(HotelGuard(UserRole.HotelMember))
  @Mutation(() => Boolean)
  @SDKMutation(() => Boolean)
  async deleteSpaces(@Args() deleteSpacesArgs: DeleteSpacesArgs) {
    await this.spaceService.deleteMany(deleteSpacesArgs);
    await this.spaceService.flush();

    const webhookSpaces = deleteSpacesArgs.where.map(({ id: spaceId }) => {
      const space = new Space({ id: spaceId });
      space.hotel = this.spaceService.hotelReference;
      this.em.persist(space);
      return space;
    });
    await this.spaceService.webhookServiceClient.triggerWebhooks(
      webhookSpaces,
      Action.DeleteSpace
    );

    return true;
  }
}
