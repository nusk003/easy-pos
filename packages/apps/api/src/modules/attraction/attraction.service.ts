import { wrap } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/mongodb';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { CONTEXT } from '@nestjs/graphql';
import { FileManagementService } from '@src/libs/filemanagement/file-management.service';
import { AssetType } from '@src/libs/filemanagement/file-management.types';
import { Context } from '@src/utils/context/context.type';
import { InvalidSessionError, NotFoundError } from '@src/utils/errors';
import { TenantService } from '@src/utils/service';
import { Attraction } from './attraction.entity';
import {
  CreateAttractionArgs,
  UpdateAttractionArgs,
} from './dto/attraction.args';

@Injectable({ scope: Scope.REQUEST })
export class AttractionService extends TenantService<Attraction> {
  constructor(
    @InjectRepository(Attraction)
    private readonly attractionRepository: EntityRepository<Attraction>,
    private readonly fileManagementService: FileManagementService,
    @Inject(CONTEXT) context: Context
  ) {
    super(attractionRepository, context);
  }

  async find() {
    if (!this.hotel) {
      throw new InvalidSessionError('hotel');
    }

    const attraction = await this.attractionRepository.findOne({
      hotel: this.hotel,
    });

    if (!attraction) {
      throw new NotFoundError(Attraction, { hotel: this.hotel });
    }

    return attraction;
  }

  async create(createAttractionArgs: CreateAttractionArgs) {
    const attraction = new Attraction();
    wrap(attraction).assign(createAttractionArgs);
    this.persist(attraction);
    return attraction;
  }

  async update(updateAttractionArgs: UpdateAttractionArgs) {
    const attraction = await this.find();

    const places =
      updateAttractionArgs.data.catalog?.categories.flatMap((category, index) =>
        category.places.flatMap((place) => ({ ...place, categoryIndex: index }))
      ) || [];

    for await (const place of places) {
      if (place.photos[0].includes('data:image/')) {
        const placeIndex = updateAttractionArgs.data.catalog!.categories[
          place.categoryIndex
        ].places.findIndex((p) => p.id === place.id);

        if (placeIndex > -1) {
          const buffer = Buffer.from(
            place.photos[0].replace(/^data:image\/\w+;base64,/, ''),
            'base64'
          );

          const s3ObjectLink = await this.fileManagementService.uploadAsset(
            AssetType.AttractionsAssets,
            buffer,
            place.id,
            place?.photos[0],
            {
              ContentEncoding: 'base64',
              ContentType: 'image/png',
            }
          );

          place.photos = [s3ObjectLink];

          updateAttractionArgs.data.catalog!.categories[
            place.categoryIndex
          ].places[placeIndex] = place;
        }
      }
    }

    wrap(attraction).assign(updateAttractionArgs.data);
    this.persist(attraction);
    return attraction;
  }

  async delete() {
    const attraction = await this.find();
    await this.remove(attraction);
    return true;
  }
}
