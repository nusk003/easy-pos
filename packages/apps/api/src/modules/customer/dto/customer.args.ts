import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { Customer } from '@src/modules/customer/customer.entity';
import {
  CreateArgsType,
  CreateDeleteArgsType,
  CreateDeleteManyArgsType,
  CreatePaginationArgsType,
  CreateSearchPaginationArgsType,
  CreateUpdateArgsType,
  CreateUpdateInputType,
  CreateWhereArgsType,
  CreateWhereInputType,
  PaginationSort,
} from '@src/utils/dto';
import { IsBoolean, IsEnum } from 'class-validator';

const argFields = <const>['firstName', 'lastName', 'nic', 'phone', 'address'];

const updateArgFields = <const>[
  'firstName',
  'lastName',
  'nic',
  'phone',
  'address',
];

@ArgsType()
export class CreateCustomerArgs extends CreateArgsType(Customer, argFields) {}

@InputType()
class CustomerWhereInput extends CreateWhereInputType() {}

@InputType()
class UpdateCustomerInput extends CreateUpdateInputType(
  Customer,
  updateArgFields
) {}

@ArgsType()
export class UpdateCustomerArgs extends CreateUpdateArgsType(
  CustomerWhereInput,
  UpdateCustomerInput
) {}

@ArgsType()
export class DeleteCustomerArgs extends CreateDeleteArgsType() {}

@ArgsType()
export class WhereCustomerArgs extends CreateWhereArgsType() {}

@ArgsType()
export class DeleteCustomersArgs extends CreateDeleteManyArgsType() {}

@InputType()
export class CustomersSortInput {
  @IsEnum(PaginationSort)
  @Field(() => PaginationSort, { nullable: true })
  id?: PaginationSort;

  @IsEnum(PaginationSort)
  @Field(() => PaginationSort, { nullable: true })
  dateCreated?: PaginationSort;
}

@ArgsType()
export class CustomerPaginationArgs extends CreatePaginationArgsType(
  CustomersSortInput
) {}

@ArgsType()
export class CustomerPaginationSearchArgs extends CreateSearchPaginationArgsType(
  CustomerPaginationArgs
) {
  @IsBoolean()
  @Field({ defaultValue: true })
  outOfStockItems: boolean;
}
