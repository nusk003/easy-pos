import { wrap } from '@mikro-orm/core';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { __jwt_secret__ } from '@src/constants';
import { GuestRole, HotelGuard } from '@src/modules/auth/guards';
import { GroupService } from '@src/modules/group/group.service';
import { IntegrationProvider } from '@src/modules/hotel/entities';
import { HotelService } from '@src/modules/hotel/hotel.service';
import { PricelistMultiplierType } from '@src/modules/pricelist/pricelist.entity';
import { UserRole } from '@src/modules/role/role.entity';
import { Ses, UserSession } from '@src/utils/context';
import { InvalidSessionError } from '@src/utils/errors';
import { SDKMutation, SDKQuery } from '@src/utils/gql';
import {
  ApaleoAuthorizeArgs,
  GetOmnivoreOptionsArgs,
  MewsAuthorizeArgs,
  OmnivoreAuthorizeArgs,
} from './dto/integrations.args';
import { IntegrationsApaleoService } from './services/integrations-apaleo.service';
import { IntegrationsMewsService } from './services/integrations-mews.service';
import { IntegrationsOmnivoreService } from './services/integrations-omnivore.service';
import {
  ApaleoPropertyResponse,
  ApaleoTopics,
  OmnivoreDiscountsResponse,
  OmnivoreLocationsResponse,
  OmnivoreOption,
  OmnivoreOptionsResponse,
  WebhookJWTPayload,
} from './types';
import { MewsServiceResponse } from './types/mews/mews.responses';

@Resolver()
export class IntegrationsResolver {
  constructor(
    private readonly groupService: GroupService,
    private readonly hotelService: HotelService,
    private readonly apaleoService: IntegrationsApaleoService,
    private readonly mewsService: IntegrationsMewsService,
    private readonly omnivoreService: IntegrationsOmnivoreService,
    private readonly jwtService: JwtService
  ) {}

  @UseGuards(HotelGuard(UserRole.HotelMember))
  @Mutation(() => Boolean)
  @SDKMutation(() => Boolean)
  async authorizeApaleo(
    @Args() { code }: ApaleoAuthorizeArgs,
    @Ses() session: UserSession
  ) {
    const hotelId = session?.hotel;
    const groupId = session?.group;

    if (!hotelId || !groupId) {
      throw new InvalidSessionError('hotel');
    }

    await this.apaleoService.authorize(code);

    const payload: WebhookJWTPayload = {
      id: IntegrationProvider.Apaleo,
      group: groupId,
    };

    const token = this.jwtService.sign(payload, { secret: __jwt_secret__ });

    await this.apaleoService.clearSubscriptions();
    await this.apaleoService.createSubscription(token, [
      ApaleoTopics.Reservation,
    ]);

    await this.hotelService.flush();

    return true;
  }

  @UseGuards(HotelGuard(UserRole.HotelMember))
  @Query(() => [ApaleoPropertyResponse], { name: 'apaleoProperties' })
  @SDKQuery(() => [ApaleoPropertyResponse], { name: 'apaleoProperties' })
  async getApaleoProperties() {
    return this.apaleoService.getProperties();
  }

  @UseGuards(HotelGuard(UserRole.HotelMember))
  @Query(() => [MewsServiceResponse], { name: 'mewsServices' })
  @SDKQuery(() => [MewsServiceResponse], { name: 'mewsServices' })
  async getMewsServices() {
    const services = await this.mewsService.getServices();
    return services.map(({ Id, Type, Name }) => ({
      id: Id,
      name: Name,
      type: Type,
    }));
  }

  @UseGuards(HotelGuard(UserRole.HotelMember))
  @Query(() => [OmnivoreLocationsResponse], { name: 'omnivoreLocations' })
  @SDKQuery(() => [OmnivoreLocationsResponse], { name: 'omnivoreLocations' })
  async getOmnivoreLocations(@Ses() session: UserSession) {
    const hotelId = session.hotel;
    const hotel = await this.hotelService.findOne(hotelId!);
    if (!hotel) {
      throw new InvalidSessionError('hotel');
    }

    await wrap(hotel.group).init();

    if (!hotel.group.integrations?.omnivore) {
      return [];
    }

    const locations = await this.omnivoreService.getLocations();
    return locations.map(({ id, pos_type }) => ({
      id,
      provider:
        pos_type === 'mock' ? IntegrationProvider.OmnivoreVirtualPos : pos_type,
    }));
  }

  @UseGuards(HotelGuard(UserRole.HotelMember))
  @Query(() => [OmnivoreDiscountsResponse], { name: 'omnivoreDiscounts' })
  @SDKQuery(() => [OmnivoreDiscountsResponse], { name: 'omnivoreDiscounts' })
  async getOmnivoreDiscounts(
    @Args() { locationId }: GetOmnivoreOptionsArgs
  ): Promise<OmnivoreDiscountsResponse[]> {
    const discounts = await this.omnivoreService.getDiscounts(locationId);
    return discounts.map(
      ({
        id,
        name,
        type,
        value,
        available,
        max_amount,
        max_percent,
        min_amount,
        min_percent,
        min_ticket_total,
        applies_to,
        open,
      }) => ({
        id,
        posId: id,
        name,
        type:
          type === 'dollar'
            ? PricelistMultiplierType.Absolute
            : PricelistMultiplierType.Percentage,
        value: type === 'dollar' ? Number(value) / 100 : value,
        open,
        available,
        order: applies_to.ticket,
        item: applies_to.item,
        ...(max_amount !== null && { maxAmount: max_amount / 100 }),
        ...(max_percent !== null && { maxPercent: max_percent }),
        ...(min_amount !== null && { minAmount: min_amount / 100 }),
        ...(min_percent !== null && { minPercent: min_percent }),
        ...(min_ticket_total !== null && {
          minOrderAmount: min_ticket_total / 100,
        }),
      })
    );
  }

  @UseGuards(HotelGuard(UserRole.HotelMember))
  @Query(() => OmnivoreOptionsResponse, { name: 'omnivoreOptions' })
  @SDKQuery(() => OmnivoreOptionsResponse, { name: 'omnivoreOptions' })
  async getOmnivoreOptions(@Args() { locationId }: GetOmnivoreOptionsArgs) {
    const employees = await this.omnivoreService.getEmployees(locationId);
    const orderTypes = await this.omnivoreService.getOrderTypes(locationId);
    const revenueCenters = await this.omnivoreService.getRevenueCenters(
      locationId
    );
    return {
      employees: employees._embedded.employees.map(
        ({ id, first_name, last_name }) => ({
          id,
          name: `${first_name} ${last_name}`,
        })
      ),
      orderTypes: orderTypes._embedded.order_types.map(({ id, name }) => ({
        id,
        name,
      })),
      revenueCenters: revenueCenters._embedded.revenue_centers.map(
        ({ id, name }) => ({ id, name })
      ),
    };
  }

  @UseGuards(HotelGuard(GuestRole.Anon))
  @Query(() => [OmnivoreOption], { name: 'omnivoreTables' })
  @SDKQuery(() => [OmnivoreOption], { name: 'omnivoreTables' })
  async getOmnivoreTables(@Args() { locationId }: GetOmnivoreOptionsArgs) {
    const tables = await this.omnivoreService.getTables(locationId);

    return tables._embedded.tables.map(({ id, name }) => ({
      id,
      name,
    }));
  }

  @UseGuards(HotelGuard(UserRole.HotelMember))
  @Mutation(() => Boolean)
  @SDKMutation(() => Boolean)
  async authorizeMews(
    @Args() { accessToken, clientToken }: MewsAuthorizeArgs,
    @Ses() session: UserSession
  ) {
    const hotelId = session?.hotel;
    const groupId = session?.group;

    if (!hotelId || !groupId) {
      throw new InvalidSessionError('hotel');
    }

    await this.mewsService.authorize(accessToken, clientToken);

    await this.hotelService.flush();

    await this.mewsService.connectMewsStream();

    return true;
  }

  @UseGuards(HotelGuard(UserRole.HotelMember))
  @Mutation(() => Boolean)
  @SDKMutation(() => Boolean)
  async authorizeOmnivore(
    @Args() { apiKey }: OmnivoreAuthorizeArgs,
    @Ses() session: UserSession
  ) {
    const hotelId = session?.hotel;
    const groupId = session?.group;

    if (!hotelId || !groupId) {
      throw new InvalidSessionError('hotel');
    }

    await this.omnivoreService.authorize(apiKey);

    await this.groupService.flush();

    return true;
  }

  @UseGuards(HotelGuard(UserRole.HotelMember))
  @Mutation(() => Boolean)
  @SDKMutation(() => Boolean)
  async disconnectOmnivore(@Ses() session: UserSession) {
    const hotelId = session?.hotel;

    if (!hotelId) {
      throw new InvalidSessionError('hotel');
    }

    const group = await this.groupService.findOneByHotelId(hotelId);

    delete group.integrations?.omnivore;

    this.groupService.persist(group);

    await this.groupService.flush();

    return true;
  }

  @UseGuards(HotelGuard(UserRole.HotelMember))
  @Mutation(() => Boolean)
  @SDKMutation(() => Boolean)
  async disconnectApaleo(@Ses() session: UserSession) {
    const hotelId = session?.hotel;

    if (!hotelId) {
      throw new InvalidSessionError('hotel');
    }

    const group = await this.groupService.findOneByHotelId(hotelId);

    try {
      await this.apaleoService.clearSubscriptions();
      // eslint-disable-next-line no-empty
    } catch {}

    const hotels = await group.hotels.loadItems();

    hotels.forEach((hotel) => {
      hotel.pmsSettings = undefined;
      this.hotelService.persist(hotel);
    });

    delete group.integrations?.apaleo;

    this.groupService.persist(group);

    await this.groupService.flush();

    return true;
  }

  @UseGuards(HotelGuard(UserRole.HotelMember))
  @Mutation(() => Boolean)
  @SDKMutation(() => Boolean)
  async disconnectMews(@Ses() session: UserSession) {
    const hotelId = session?.hotel;

    if (!hotelId) {
      throw new InvalidSessionError('hotel');
    }

    const hotel = await this.hotelService.findOne(hotelId);

    delete hotel.integrations?.mews;
    delete hotel.pmsSettings;

    this.hotelService.persist(hotel);

    await this.mewsService.disconnectMewsStream();

    await this.hotelService.flush();

    return true;
  }
}
