import { EntityManager } from '@mikro-orm/mongodb';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FileManagementService } from '@src/libs/filemanagement/file-management.service';
import { AssetType } from '@src/libs/filemanagement/file-management.types';
import { GuestRole, HotelGuard, UserRole } from '@src/modules/auth/guards';
import { Ses, UserSession } from '@src/utils/context';
import { ConflictError, ErrorCodes } from '@src/utils/errors';
import { SDKMutation, SDKQuery } from '@src/utils/gql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { Attraction, AttractionPlace } from './attraction.entity';
import { AttractionService } from './attraction.service';
import {
  AttractionPlaceByPlaceIDArgs,
  CreateAttractionArgs,
  GenerateAttractionPlacesArgs,
  SearchCustomAttractionPlaceArgs,
  UpdateAttractionArgs,
} from './dto/attraction.args';
import {
  GenerateAttractionPlacesCategoryResponse,
  SearchCustomAttractionPlaceResponse,
} from './dto/attraction.responses';
import { categoriesMap } from './map/googlePlacesToCategories';
import { PlacesService } from './places.service';

@Resolver()
export class AttractionResolver {
  placesService: PlacesService;

  constructor(
    private readonly attractionService: AttractionService,
    private readonly em: EntityManager
  ) {
    this.placesService = new PlacesService({ em: this.em });
  }

  @UseGuards(HotelGuard(UserRole.HotelMember))
  @Mutation(() => Attraction)
  @SDKMutation(() => Attraction, { fields: ['description'] })
  async createAttraction(
    @Ses() session: UserSession,
    @Args() createAttractionArgs: CreateAttractionArgs
  ): Promise<Attraction> {
    const existingAttraction = await this.attractionService.repository.findOne({
      hotel: session.hotel,
    });

    if (existingAttraction) {
      throw new ConflictError(Attraction, { id: existingAttraction.id });
    }

    if (!createAttractionArgs.catalog) {
      createAttractionArgs.catalog = { categories: [], labels: [] };
    }

    const attraction = this.attractionService.create(createAttractionArgs);
    await this.attractionService.flush();
    return attraction;
  }

  @UseGuards(HotelGuard(UserRole.HotelMember, GuestRole.Anon))
  @Query(() => Attraction, { name: 'attraction', nullable: true })
  @SDKQuery(() => Attraction, { name: 'attraction' })
  async getAttraction(): Promise<Attraction | null> {
    try {
      const attraction = await this.attractionService.find();
      return attraction;
    } catch (err) {
      if (err.extensions?.code === ErrorCodes.NotFound) {
        return null;
      }

      throw err;
    }
  }

  @UseGuards(HotelGuard(UserRole.HotelMember))
  @Mutation(() => Attraction)
  @SDKMutation(() => Attraction)
  async updateAttraction(
    @Args() updateAttractionArgs: UpdateAttractionArgs
  ): Promise<Attraction> {
    const attraction = await this.attractionService.update(
      updateAttractionArgs
    );
    await this.attractionService.flush();
    return attraction;
  }

  @UseGuards(HotelGuard(UserRole.HotelMember))
  @Mutation(() => Boolean)
  @SDKMutation(() => Boolean)
  async deleteAttraction(): Promise<boolean> {
    const deleteAttraction = await this.attractionService.delete();
    await this.attractionService.flush();
    return deleteAttraction;
  }

  @UseGuards(HotelGuard(UserRole.HotelMember))
  @Mutation(() => Boolean)
  @SDKMutation(() => Boolean)
  async generateAttractionPlaces(
    @Ses() session: UserSession,
    @Args()
    { categories, radius, requestBooking }: GenerateAttractionPlacesArgs
  ): Promise<boolean> {
    const hotelId = session.hotel!;

    const filteredCategories = categoriesMap.filter((categoryMap) => {
      return categories.find((category) => category.name === categoryMap.name);
    });

    await this.placesService.triggerGenerateAttractionPlaces({
      hotelId,
      categories: filteredCategories,
      radius,
      requestBooking,
    });

    return true;
  }

  @Query(() => [GenerateAttractionPlacesCategoryResponse], {
    name: 'generateAttractionPlacesCategories',
  })
  @SDKQuery(() => [GenerateAttractionPlacesCategoryResponse], {
    name: 'generateAttractionPlacesCategories',
  })
  async getGenerateAttractionPlacesCategories(): Promise<
    GenerateAttractionPlacesCategoryResponse[]
  > {
    const categories: Array<GenerateAttractionPlacesCategoryResponse> = [];
    categoriesMap.forEach(({ name }) => {
      categories.push({ name });
    });
    return categories;
  }

  @Query(() => [SearchCustomAttractionPlaceResponse])
  @SDKQuery(() => [SearchCustomAttractionPlaceResponse])
  async searchCustomAttractionPlace(
    @Args() { query }: SearchCustomAttractionPlaceArgs
  ): Promise<SearchCustomAttractionPlaceResponse[]> {
    return this.placesService.searchCustomPlace(query);
  }

  @Query(() => AttractionPlace, { name: 'attractionPlacebyPlaceID' })
  @SDKQuery(() => AttractionPlace, { name: 'attractionPlacebyPlaceID' })
  async getAttractionPlacebyPlaceID(
    @Args() { placeId }: AttractionPlaceByPlaceIDArgs
  ): Promise<AttractionPlace> {
    return this.placesService.getPlaceDetails(placeId);
  }
}
