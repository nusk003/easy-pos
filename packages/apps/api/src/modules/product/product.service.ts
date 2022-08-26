import { wrap } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/mongodb';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { CONTEXT } from '@nestjs/graphql';
import { ElasticsearchService } from '@src/libs/elasticsearch';
import { WebhookServiceClient } from '@src/microservices/webhook-service/webhook-service.client';
import { DeletePricelistsArgs } from '@src/modules/pricelist/dto/pricelist.args';
import { Context } from '@src/utils/context/context.type';
import { NotFoundError } from '@src/utils/errors';
import { TenantService } from '@src/utils/service';
import { UserSession } from '@src/modules/auth/auth.types';
import {
  DeleteProductArgs,
  ProductPaginationSearchArgs,
  UpdateProductArgs,
} from './dto/product.args';
import { Product } from './product.entity';
import { RequestParams } from '@elastic/elasticsearch';
import { PaginationSort } from '@src/utils/dto';

@Injectable({ scope: Scope.REQUEST })
export class ProductService extends TenantService<Product> {
  webhookServiceClient = new WebhookServiceClient();

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: EntityRepository<Product>,
    @Inject(CONTEXT) context: Context,
    private readonly elasticsearch: ElasticsearchService
  ) {
    super(productRepository, context);
  }

  async findAll() {
    const spaces = await this.productRepository.find({ hotel: this.hotel });
    return spaces;
  }

  async findOne(id: string) {
    const space = await this.productRepository.findOne(id);
    if (!space) {
      throw new NotFoundError(Product, { id });
    }
    return space;
  }

  async update(updateSpaceArgs: UpdateProductArgs) {
    const space = await this.findOne(updateSpaceArgs.where.id);
    wrap(space).assign(updateSpaceArgs.data);
    this.repository.persist(space);
    return space;
  }

  async delete(deleteSpaceArgs: DeleteProductArgs) {
    const product = await this.findOne(deleteSpaceArgs.where.id);
    this.repository.remove(product);
    return product;
  }

  async deleteMany(deletePricelistsArgs: DeletePricelistsArgs) {
    const ids = deletePricelistsArgs.where.map((w) => w.id);

    const pricelists = await this.repository.find({ id: ids });

    pricelists.forEach((pricelist) => {
      this.remove(pricelist);
    });
  }

  get session() {
    return <UserSession>this.context.req.user;
  }

  async indexOne(
    product: Product,
    queryOpts?: Omit<RequestParams.Index, 'index' | 'body' | 'id'>
  ) {
    return this.elasticsearch.indexOne(Product, product, queryOpts);
  }

  async deleteOne(product: Product) {
    return this.elasticsearch.deleteOne(Product, product);
  }

  async search(args: ProductPaginationSearchArgs) {
    const { query, limit, offset, sort } = args;

    return this.elasticsearch.searchCollection(Product, {
      query: {
        bool: {
          must: [
            query
              ? {
                  query_string: {
                    query,
                  },
                }
              : {
                  match_all: {},
                },
          ].filter(Boolean),
        },
      },
      sort: {
        dateCreated: PaginationSort.Desc,
      },
      limit,
      offset,
    });
  }
}
