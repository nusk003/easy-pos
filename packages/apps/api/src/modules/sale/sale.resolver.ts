import { wrap } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/mongodb';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  ConnectRole,
  GuestRole,
  HotelGuard,
  UserRole,
} from '@src/modules/auth/guards';
import { HotelService } from '@src/modules/hotel/hotel.service';
import { GuestSession, Ses, Session } from '@src/utils/context';
import { InternalError } from '@src/utils/errors';
import { SDKMutation, SDKQuery } from '@src/utils/gql';
import dayjs from 'dayjs';
import { ObjectId } from 'mongodb';
import { customAlphabet } from 'nanoid';
import { CustomerService } from '../customer/customer.service';
import { ProductService } from '../product/product.service';
import {
  CreateSaleArgs,
  SalePaginationArgs,
  SalesPaginationSearchArgs,
  UpdateSaleArgs,
  WhereOrderArgs,
} from './dto/sale.args';
import { CreateSaleResponse, SearchSalesResponse } from './dto/sale.responses';
import { Sale } from './sale.entity';
import { SaleService } from './sale.service';

@Resolver()
export class SaleResolver {
  constructor(
    private readonly saleService: SaleService,
    private readonly productService: ProductService,
    private readonly hotelService: HotelService,
    private readonly customerService: CustomerService,
    private readonly em: EntityManager
  ) {}

  @UseGuards(
    HotelGuard(
      UserRole.HotelMember,
      GuestRole.Identified,
      ConnectRole.AccessToken
    )
  )
  @Query(() => [Sale], { name: 'sales' })
  @SDKQuery(() => [Sale], { name: 'sales' })
  async getSales(
    @Args() salePaginationArgs: SalePaginationArgs
  ): Promise<Sale[]> {
    return this.saleService.find({
      ...salePaginationArgs,
      populate: ['customer'],
    });
  }

  @UseGuards(HotelGuard(UserRole.HotelMember))
  @Query(() => SearchSalesResponse)
  @SDKQuery(() => SearchSalesResponse)
  async searchSales(
    @Args() salePaginationSearchArgs: SalesPaginationSearchArgs
  ): Promise<SearchSalesResponse> {
    const sales = await this.saleService.search(salePaginationSearchArgs);
    return sales;
  }

  @UseGuards(
    HotelGuard(
      UserRole.HotelMember,
      GuestRole.Identified,
      ConnectRole.AccessToken
    )
  )
  @Query(() => Sale, { name: 'sale' })
  @SDKQuery(() => Sale, { name: 'sale' })
  async getSale(
    @Args() whereOrderArgs: WhereOrderArgs,
    @Ses() session: Session
  ): Promise<Sale> {
    const sale = await this.saleService.findOne(
      whereOrderArgs.where.id,
      (<GuestSession>session).guestId
    );
    return sale;
  }

  @UseGuards(
    HotelGuard(
      UserRole.HotelMember,
      GuestRole.Identified,
      ConnectRole.AccessToken
    )
  )
  @Mutation(() => CreateSaleResponse)
  @SDKMutation(() => CreateSaleResponse)
  async createSale(
    @Args() createSaleArgs: CreateSaleArgs
  ): Promise<CreateSaleResponse> {
    const customerNIC = createSaleArgs.customerNIC;
    delete (<any>createSaleArgs).customerNIC;

    const sale = new Sale(createSaleArgs);

    const nanoid = customAlphabet('123456789abcdefhjknopqrtuv', 6);
    const salesReference = nanoid();

    const customer = await this.customerService.findByNIC(customerNIC);

    sale.instalmentPlan?.terms?.map((term) => {
      term.dueDate = dayjs(term.dueDate).toDate();
    });

    await this.em
      .transactional(async (em) => {
        sale.hotel = this.saleService.hotelReference;

        const itemPromises = sale.items.map(async (item) => {
          const product = await this.productService.findOne(item.productId);
          product.stock = product.stock - item.quantity;
          await this.productService.indexOne(product);
          em.persist(product);
        });

        await Promise.all(itemPromises);

        wrap(sale).assign(
          {
            _id: new ObjectId(),
            customer,
            salesReference,
            hotel: this.saleService.hotel,
            group: this.saleService.group,
          },
          { em }
        );

        await this.saleService.indexOne(sale);

        em.persist(sale);
      })
      .catch(async (err) => {
        throw new InternalError(err);
      });

    return { sale };
  }

  @UseGuards(
    HotelGuard(
      UserRole.HotelMember,
      GuestRole.Identified,
      ConnectRole.AccessToken
    )
  )
  @Mutation(() => Sale)
  @SDKMutation(() => Sale)
  async updateSale(@Args() updateSaleArgs: UpdateSaleArgs): Promise<Sale> {
    const sale = await this.saleService.findOne(updateSaleArgs.where.id);

    const { instalmentPlan } = updateSaleArgs.data;

    wrap(sale).assign({ instalmentPlan });

    await this.em.transactional(async (em) => {
      await wrap(sale.customer).init();

      await this.saleService.indexOne(sale);

      em.persist(sale);
    });

    return sale;
  }
}
