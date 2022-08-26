import { RequestParams } from '@elastic/elasticsearch';
import { wrap } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/mongodb';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { CONTEXT } from '@nestjs/graphql';
import { ElasticsearchService } from '@src/libs/elasticsearch';
import { WebhookServiceClient } from '@src/microservices/webhook-service/webhook-service.client';
import { UserSession } from '@src/modules/auth/auth.types';
import { DeletePricelistsArgs } from '@src/modules/pricelist/dto/pricelist.args';
import { Context } from '@src/utils/context/context.type';
import { PaginationSort } from '@src/utils/dto';
import { NotFoundError } from '@src/utils/errors';
import { TenantService } from '@src/utils/service';
import { Customer } from './customer.entity';
import {
  CustomerPaginationSearchArgs,
  DeleteCustomerArgs,
  UpdateCustomerArgs,
} from './dto/customer.args';

@Injectable({ scope: Scope.REQUEST })
export class CustomerService extends TenantService<Customer> {
  webhookServiceClient = new WebhookServiceClient();

  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: EntityRepository<Customer>,
    @Inject(CONTEXT) context: Context,
    private readonly elasticsearch: ElasticsearchService
  ) {
    super(customerRepository, context);
  }

  async findAll() {
    const spaces = await this.customerRepository.find({ hotel: this.hotel });
    return spaces;
  }

  async findOne(id: string) {
    const customer = await this.customerRepository.findOne(id);
    if (!customer) {
      throw new NotFoundError(Customer, { id });
    }
    return customer;
  }

  async findByNIC(nic: string) {
    const customer = await this.customerRepository.findOne({ nic });
    if (!customer) {
      throw new NotFoundError(Customer, { nic });
    }
    return customer;
  }

  async update(updateCustomerArgs: UpdateCustomerArgs) {
    const customer = await this.findOne(updateCustomerArgs.where.id);
    wrap(customer).assign(updateCustomerArgs.data);
    this.repository.persist(customer);
    return customer;
  }

  async delete(deleteCustomerArgs: DeleteCustomerArgs) {
    const customer = await this.findOne(deleteCustomerArgs.where.id);
    this.repository.remove(customer);
    return customer;
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
    customer: Customer,
    queryOpts?: Omit<RequestParams.Index, 'index' | 'body' | 'id'>
  ) {
    return this.elasticsearch.indexOne(Customer, customer, queryOpts);
  }

  async deleteOne(customer: Customer) {
    return this.elasticsearch.deleteOne(Customer, customer);
  }

  async search(args: CustomerPaginationSearchArgs) {
    const { query, limit, offset, sort } = args;

    return this.elasticsearch.searchCollection(Customer, {
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
