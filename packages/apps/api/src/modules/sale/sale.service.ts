import { FilterQuery } from '@mikro-orm/core';
import { EntityManager, EntityRepository } from '@mikro-orm/mongodb';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { CONTEXT } from '@nestjs/graphql';
import { ElasticsearchService } from '@src/libs/elasticsearch';
import { Context } from '@src/utils/context/context.type';
import { NotFoundError, UnauthorizedResourceError } from '@src/utils/errors';
import { FindOptions, TenantService } from '@src/utils/service';
import dayjs from 'dayjs';
import { Customer } from '../customer/customer.entity';
import { SalesPaginationSearchArgs } from './dto/sale.args';
import { Sale } from './sale.entity';

export interface FindSaleOptions<P extends string>
  extends FindOptions<Sale, P> {
  startDate?: Date;
  endDate?: Date;
}

@Injectable({ scope: Scope.REQUEST })
export class SaleService extends TenantService<Sale> {
  constructor(
    @InjectRepository(Sale)
    private readonly saleRepository: EntityRepository<Sale>,
    @Inject(CONTEXT) context: Context,
    private readonly elasticsearch: ElasticsearchService,
    em: EntityManager
  ) {
    super(saleRepository, context, {
      em,
    });
  }

  async find<P extends string>(opts?: FindSaleOptions<P>) {
    const query: FilterQuery<Sale> = { hotel: this.hotel };

    if (opts?.startDate !== undefined) {
      query.dateCreated = { $gt: opts.startDate };
    }

    if (opts?.endDate !== undefined) {
      query.dateCreated = { $lt: opts.endDate };
    }

    const sales = await this.saleRepository.find(query);

    return sales;
  }

  async findOrdersByGuest<P extends string>(
    customerId: string,
    opts?: FindOptions<Sale, P>
  ) {
    const sales = await this.saleRepository.find(
      {
        hotel: this.hotel,
        customer: customerId,
      },
      { populate: ['customer'] }
    );

    return sales;
  }

  async findOne(id: string, customerId?: string) {
    const sale = await this.saleRepository.findOne(id, {
      populate: ['customer'],
    });

    if (!sale) {
      throw new NotFoundError(Sale, { id });
    }

    if (customerId && sale.customer.id !== customerId) {
      throw new UnauthorizedResourceError(Customer, customerId);
    }

    return sale;
  }

  async indexOne(sale: Sale) {
    return this.elasticsearch.indexOne(Sale, sale);
  }

  async indexMany(sales: Sale[]) {
    return this.elasticsearch.indexMany(Sale, sales);
  }

  async search(args: SalesPaginationSearchArgs) {
    const { query, limit, offset, sort, endDate, startDate } = args;

    return this.elasticsearch.searchCollection(Sale, {
      query: {
        bool: {
          must: query
            ? {
                query_string: {
                  query,
                },
              }
            : {
                match_all: {},
              },
          filter:
            startDate && endDate
              ? {
                  range: {
                    dateCreated: {
                      gte: dayjs(startDate).format('YYYY-MM-DD'),
                      lt: dayjs(endDate).format('YYYY-MM-DD'),
                    },
                  },
                }
              : [],
        },
      },
      sort,
      limit,
      offset,
    });
  }
}
