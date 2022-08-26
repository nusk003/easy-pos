import { FilterQuery, wrap } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/mongodb';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { CONTEXT } from '@nestjs/graphql';
import { FileManagementService } from '@src/libs/filemanagement/file-management.service';
import { AssetType } from '@src/libs/filemanagement/file-management.types';
import { WebhookServiceClient } from '@src/microservices/webhook-service/webhook-service.client';
import { Order } from '@src/modules/order/order.entity';
import { Space } from '@src/modules/space/space.entity';
import { Context } from '@src/utils/context/context.type';
import { NotFoundError } from '@src/utils/errors';
import { TenantService } from '@src/utils/service';
import { ObjectId } from 'mongodb';
import {
  DeletePricelistArgs,
  DeletePricelistsArgs,
  UpdatePricelistArgs,
  WherePricelistArgs,
} from './dto/pricelist.args';
import {
  PricelistFeedback,
  PricelistFeedbackRating,
} from './dto/pricelist.responses';
import { Pricelist } from './pricelist.entity';

@Injectable({ scope: Scope.REQUEST })
export class PricelistService extends TenantService<Pricelist> {
  webhookServiceClient = new WebhookServiceClient();

  constructor(
    @InjectRepository(Pricelist)
    private readonly pricelistRepository: EntityRepository<Pricelist>,
    @InjectRepository(Space)
    private readonly spaceRepository: EntityRepository<Space>,
    @InjectRepository(Order)
    private readonly orderRepository: EntityRepository<Order>,
    private readonly fileManagementService: FileManagementService,
    @Inject(CONTEXT) context: Context
  ) {
    super(pricelistRepository, context);
  }

  async findAll() {
    const pricelists = await this.pricelistRepository.find(
      { hotel: this.hotel },
      { populate: ['space'] }
    );
    return pricelists;
  }

  async findOne(id: string) {
    const pricelist = await this.pricelistRepository.findOne(id, {
      populate: ['space'],
    });
    if (!pricelist) {
      throw new NotFoundError(Pricelist, { id });
    }
    return pricelist;
  }

  async find(opts: FilterQuery<Pricelist> = {}) {
    const pricelists = await this.pricelistRepository.find(opts, {
      populate: ['space'],
    });
    return pricelists;
  }

  async update(updatePricelistArgs: UpdatePricelistArgs) {
    const pricelist = await this.findOne(updatePricelistArgs.where.id);

    const spaceId = updatePricelistArgs.data.spaceId;

    if (spaceId) {
      pricelist.space = this.spaceRepository.getReference(spaceId);
      await wrap(pricelist.space).init();
    }

    const items =
      updatePricelistArgs.data.catalog?.categories.flatMap((category, index) =>
        category.items.flatMap((item) => ({ ...item, categoryIndex: index }))
      ) || [];

    for await (const item of items) {
      if (item.photos?.[0].includes('data:image/')) {
        const itemIndex = updatePricelistArgs.data.catalog!.categories[
          item.categoryIndex
        ].items.findIndex((i) => i.id === item.id);

        if (itemIndex > -1) {
          const buffer = Buffer.from(
            item.photos[0].replace(/^data:image\/\w+;base64,/, ''),
            'base64'
          );

          const s3ObjectLink = await this.fileManagementService.uploadAsset(
            AssetType.PricelistAssets,
            buffer,
            item.id,
            item?.photos[0],
            {
              ContentEncoding: 'base64',
              ContentType: 'image/png',
            }
          );

          item.photos = [s3ObjectLink];

          updatePricelistArgs.data.catalog!.categories[
            item.categoryIndex
          ].items[itemIndex] = item;
        }
      }
    }

    wrap(pricelist).assign(updatePricelistArgs.data, { mergeObjects: false });
    this.persist(pricelist);
    return pricelist;
  }

  async delete(deletePricelistArgs: DeletePricelistArgs) {
    const pricelist = await this.findOne(deletePricelistArgs.where.id);
    this.remove(pricelist);
    return pricelist;
  }

  async deleteMany(deletePricelistsArgs: DeletePricelistsArgs) {
    const ids = deletePricelistsArgs.where.map((w) => w.id);

    const pricelists = await this.find({ id: ids });

    pricelists.forEach((pricelist) => {
      this.remove(pricelist);
    });
  }

  async getPricelistFeedback({
    where,
  }: WherePricelistArgs): Promise<PricelistFeedback> {
    const ratingsAggregation: PricelistFeedbackRating[] =
      await this.orderRepository.aggregate([
        {
          $match: {
            pricelist: { $eq: new ObjectId(where.id) },
            $and: [
              { feedback: { $ne: undefined } },
              { feedback: { $ne: null } },
            ],
          },
        },
        {
          $group: {
            _id: '$feedback.rating',
            count: { $sum: 1 },
          },
        },
        { $project: { _id: 0, value: '$_id', count: 1 } },
      ]);

    if (
      ratingsAggregation[0]?.value === undefined ||
      ratingsAggregation[0].value === null
    ) {
      return {
        averageRating: 0,
        noReviews: 0,
        recentOrders: [],
        ratings: [...Array(5)].map((_, idx) => ({
          count: 0,
          value: idx + 1,
          percentage: 0,
        })),
      };
    }

    const noReviews = ratingsAggregation.reduce((total, feedback) => {
      return feedback.count + total;
    }, 0);

    const averageRating = Number(
      (
        ratingsAggregation.reduce((total, feedback) => {
          return feedback.count * feedback.value + total;
        }, 0) / noReviews
      ).toFixed(2)
    );

    const ratings = [...Array(5)].map((_, idx) => {
      const rating = ratingsAggregation.find((r) => r.value === idx + 1);
      const percentage = rating
        ? Number((rating.count / noReviews).toFixed(2))
        : 0;
      const count = rating?.count || 0;

      return { count, value: idx + 1, percentage };
    });

    const recentOrders = await this.orderRepository.find(
      {
        pricelist: where.id,
        $and: [{ feedback: { $ne: undefined } }, { feedback: { $ne: null } }],
      },
      {
        populate: ['guest', 'pricelist', 'space'],
        orderBy: { dateCreated: -1 },
        offset: 0,
        limit: 10,
      }
    );

    return {
      averageRating,
      noReviews,
      recentOrders,
      ratings,
    };
  }
}
