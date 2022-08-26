import { Connection, IDatabaseDriver, MikroORM } from '@mikro-orm/core';
import { EntityManager, EntityRepository } from '@mikro-orm/mongodb';
import { mikroORMConfig } from '@src/config/mikro-orm.config';
import {
  Attraction,
  AttractionCategory,
} from '@src/modules/attraction/attraction.entity';
import { PlacesService } from '@src/modules/attraction/places.service';
import { lambdaValidate } from '@src/utils/dto';
import { LambdaNotFoundError } from '@src/utils/errors';
import { WSClient } from '@src/websockets/websockets.client';
import { Callback, Context } from 'aws-lambda';
import { Action } from '@hm/sdk';
import { GenerateAttractionPlacesArgs } from './dto/generate-attraction-places-args';

let orm: MikroORM<IDatabaseDriver<Connection>>;

class Handler {
  attractionRepository: EntityRepository<Attraction>;

  placesService: PlacesService;

  wsClient: WSClient;

  async init() {
    orm = await MikroORM.init(mikroORMConfig());
    const em = <EntityManager>orm.em.fork();

    this.attractionRepository = em.getRepository(Attraction);

    this.placesService = new PlacesService({ em });

    this.wsClient = new WSClient({ em });
  }

  async generateAttractionPlaces(
    generateAttractionPlacesArgs: GenerateAttractionPlacesArgs,
    _context: Context,
    _callback: Callback
  ) {
    const {
      hotelId,
      categories: categoriesMap,
      radius,
      requestBooking,
    } = await lambdaValidate(
      GenerateAttractionPlacesArgs,
      generateAttractionPlacesArgs
    );

    await this.init();

    const attraction = await this.attractionRepository.findOne(
      {
        hotel: hotelId,
      },
      { populate: ['hotel'] }
    );

    if (!attraction) {
      throw new LambdaNotFoundError(Attraction, { hotel: hotelId });
    }

    const { hotel } = attraction;

    const categories: AttractionCategory[] =
      await this.placesService.generateAttractionPlaces({
        hotel,
        categories: categoriesMap,
        radius,
        requestBooking,
      });

    attraction.catalog = {
      categories,
      labels: [],
    };

    await this.attractionRepository.flush();
    await this.wsClient.broadcastToUsers(attraction.hotel, {
      action: Action.GenerateAttractionPlaces,
      data: attraction,
    });

    return { statusCode: 200 };
  }
}

const h = new Handler();
export const handler = h.generateAttractionPlaces.bind(h);
