import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { HotelGuard, UserRole } from '@src/modules/auth/guards';
import { SDKMutation, SDKQuery } from '@src/utils/gql';
import { Customer } from './customer.entity';
import { CustomerService } from './customer.service';
import {
  CreateCustomerArgs,
  CustomerPaginationSearchArgs,
  DeleteCustomerArgs,
  UpdateCustomerArgs,
  WhereCustomerArgs,
} from './dto/customer.args';
import { SearchCustomersResponse } from './dto/customer.responses';

@Resolver()
export class CustomerResolver {
  constructor(private readonly customerService: CustomerService) {}

  @UseGuards(HotelGuard(UserRole.HotelMember))
  @Query(() => [Customer], { name: 'customers' })
  @SDKQuery(() => [Customer], { name: 'customers' })
  async getProducts(): Promise<Customer[]> {
    const customers = await this.customerService.findAll();
    return customers;
  }

  @UseGuards(HotelGuard(UserRole.HotelMember))
  @Query(() => SearchCustomersResponse)
  @SDKQuery(() => SearchCustomersResponse)
  async searchCustomers(
    @Args() customerPaginationSearchArgs: CustomerPaginationSearchArgs
  ): Promise<SearchCustomersResponse> {
    return this.customerService.search(customerPaginationSearchArgs);
  }

  @UseGuards(HotelGuard(UserRole.HotelMember))
  @Query(() => Customer, { name: 'customer' })
  @SDKQuery(() => Customer, { name: 'customer' })
  async getCustomerByID(
    @Args() whereCustomerArgs: WhereCustomerArgs
  ): Promise<Customer> {
    const customer = await this.customerService.findOne(
      whereCustomerArgs.where.id
    );
    return customer;
  }

  @UseGuards(HotelGuard(UserRole.HotelMember))
  @Mutation(() => Customer)
  @SDKMutation(() => Customer)
  async createCustomer(
    @Args() createCustomerArgs: CreateCustomerArgs
  ): Promise<Customer> {
    const customer = new Customer(createCustomerArgs);
    this.customerService.persist(customer);
    await this.customerService.flush();
    await this.customerService.indexOne(customer);
    return customer;
  }

  @UseGuards(HotelGuard(UserRole.HotelMember))
  @Mutation(() => Customer)
  @SDKMutation(() => Customer)
  async updateCustomer(
    @Args() updateCustomerArgs: UpdateCustomerArgs
  ): Promise<Customer> {
    const customer = await this.customerService.update(updateCustomerArgs);
    await this.customerService.flush();
    await this.customerService.indexOne(customer);
    return customer;
  }

  @UseGuards(HotelGuard(UserRole.HotelMember))
  @Mutation(() => Boolean)
  @SDKMutation(() => Boolean)
  async deleteCustomer(
    @Args() deleteCustomerArgs: DeleteCustomerArgs
  ): Promise<boolean> {
    await this.customerService.delete(deleteCustomerArgs);
    await this.customerService.flush();
    const customer = new Customer({ id: deleteCustomerArgs.where.id });
    customer.hotel = this.customerService.hotelReference;
    await this.customerService.deleteOne(customer);
    return true;
  }
}
