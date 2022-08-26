import { attraction as attractionMock } from '@dev/seed-data/collections/attractions.factory';
import {
  Client as PlacesClient,
  PlaceAutocompleteType,
  PlacePhoto,
} from '@googlemaps/google-maps-services-js';
import {
  PlacesNearbyRanking,
  PlacesNearbyResponseData,
} from '@googlemaps/google-maps-services-js/dist/places/placesnearby';
import { MongoEntityManager, MongoDriver } from '@mikro-orm/mongodb';
import { __dev__, __google_maps_api_key__ } from '@src/constants';
import { GenerateAttractionPlacesArgs } from '@src/microservices/generate-attraction-places/dto/generate-attraction-places-args';
import { GenerateAttractionPlacesClient } from '@src/microservices/generate-attraction-places/generate-attraction-places.client';
import { Hotel } from '@src/modules/hotel/entities';
import { WSClient } from '@src/websockets/websockets.client';
import { Action } from '@hm/sdk';
import { orderBy } from 'lodash';
import { v4 as uuid } from 'uuid';
import {
  AttractionCategory,
  AttractionPlace,
  Coordinates,
} from './attraction.entity';
import { SearchCustomAttractionPlaceResponse } from './dto/attraction.responses';

interface PlacesServiceOptions {
  em: MongoEntityManager<MongoDriver>;
}

interface GenerateAttractionPlacesOptions
  extends Omit<GenerateAttractionPlacesArgs, 'hotelId'> {
  hotel: Hotel;
}

export class PlacesService {
  private placesClient: PlacesClient;

  private wsClient: WSClient;

  constructor(opts: PlacesServiceOptions) {
    this.placesClient = new PlacesClient({});
    this.wsClient = new WSClient({ em: opts.em });
  }

  async getPlacesByCoordinates(
    coordinates: Coordinates,
    category: string,
    radius: number
  ) {
    const places = await this.placesClient.placesNearby({
      params: {
        key: __google_maps_api_key__,
        location: coordinates,
        radius: radius,
        type: category,
        rankby: PlacesNearbyRanking.prominence,
      },
    });

    return places.data;
  }

  async getPhoto(photoRef: PlacePhoto) {
    const { photo_reference, height, width } = photoRef;
    const photo = await this.placesClient.placePhoto({
      params: {
        key: __google_maps_api_key__,
        photoreference: photo_reference,
        maxheight: height,
        maxwidth: width,
      },
      responseType: 'stream',
    });

    return photo.data.responseUrl;
  }

  async getMockCategories({
    hotel,
    categories: categoriesMap,
    requestBooking,
  }: GenerateAttractionPlacesOptions) {
    const categoriesData = attractionMock.catalog!.categories;
    const categories: AttractionCategory[] = [];

    for (const category of categoriesData) {
      if (!categoriesMap.map((c) => c.name).includes(category.name)) {
        continue;
      }

      if (requestBooking) {
        category.places = category.places.map((p) => ({
          ...p,
          requestBooking,
        }));
      }

      categories.push(category);

      await new Promise<void>((resolve) => {
        setTimeout(async () => {
          await this.wsClient.broadcastToUsers(hotel, {
            action: Action.GenerateAttractionCategory,
            data: category,
          });
          resolve();
        }, 500 * categories.length);
      });
    }

    return new Promise<AttractionCategory[]>((resolve) => {
      setTimeout(() => {
        resolve(categories);
      }, 500 * categories.length);
    });
  }

  async generateAttractionPlaces({
    hotel,
    categories: categoriesMap,
    radius,
    requestBooking,
  }: GenerateAttractionPlacesOptions): Promise<AttractionCategory[]> {
    if (__dev__) {
      return this.getMockCategories({
        hotel,
        categories: categoriesMap,
        radius,
        requestBooking,
      });
    }

    const categories: AttractionCategory[] = [];

    for await (const categoryMap of categoriesMap) {
      const { keywords, name } = categoryMap;

      const partialPlaces: PlacesNearbyResponseData['results'] = [];

      for await (const keyword of keywords) {
        const response = await this.getPlacesByCoordinates(
          hotel.address.coordinates!,
          keyword,
          radius
        );
        partialPlaces.push(...response.results);
      }

      const sortedPartialPlaces = orderBy(
        partialPlaces.filter((p) => p.photos?.length),
        ({ rating }) => rating || 0,
        'desc'
      ).slice(0, 20);

      const places: AttractionPlace[] = [];

      for await (const partialPlace of sortedPartialPlaces) {
        const placeId = partialPlace.place_id;
        if (placeId) {
          const place = await this.getPlaceDetails(placeId);

          if (!place.photos.length) {
            continue;
          }

          places.push({ ...place, requestBooking });
        }
      }

      const category = {
        id: uuid(),
        name,
        places,
      };

      categories.push(category);

      await this.wsClient.broadcastToUsers(hotel, {
        action: Action.GenerateAttractionCategory,
        data: category,
      });
    }

    return categories;
  }

  async searchCustomPlace(query: string) {
    const response = await this.placesClient.placeAutocomplete({
      params: {
        input: query,
        key: __google_maps_api_key__,
        types: PlaceAutocompleteType.establishment,
      },
    });

    const places: SearchCustomAttractionPlaceResponse[] = [];

    const results = response.data.predictions.slice(0, 2);

    results.forEach(({ place_id, structured_formatting }) => {
      places.push({
        placeId: place_id,
        title: structured_formatting.main_text,
        description: structured_formatting.secondary_text,
      });
    });

    return places;
  }

  async getPlaceDetails(placeId: string): Promise<AttractionPlace> {
    const response = await this.placesClient.placeDetails({
      params: {
        key: __google_maps_api_key__,
        place_id: placeId,
      },
    });

    const { result } = response.data;

    const lat = result.geometry?.location.lat;
    const lng = result.geometry?.location.lng;

    return {
      address: result.formatted_address!,
      id: uuid(),
      name: result.name!,
      coordinates:
        lat && lng
          ? {
              lat,
              lng,
            }
          : undefined,
      phone: result.formatted_phone_number,
      rating: result.rating || 0,
      website: result.website,
      placeId,
      photos: result.photos?.[0] ? [await this.getPhoto(result.photos[0])] : [],
    };
  }

  async triggerGenerateAttractionPlaces(args: GenerateAttractionPlacesArgs) {
    const generatePlaceClient = new GenerateAttractionPlacesClient();
    await generatePlaceClient.trigger(args);
  }
}
