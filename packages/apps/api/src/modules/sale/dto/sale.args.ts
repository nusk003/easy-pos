import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { PaymentType } from '@src/modules/order/order.entity';
import {
  CreateArgsType,
  CreatePaginationArgsType,
  CreateSearchPaginationArgsType,
  CreateUpdateArgsType,
  CreateUpdateInputType,
  CreateWhereArgsType,
  CreateWhereInputType,
  PaginationSort,
} from '@src/utils/dto';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
} from 'class-validator';
import { Sale } from '../sale.entity';

const createArgFields = <const>[
  'items',
  'totalPrice',
  'salesReference',
  'subtotal',
  'instalmentPlan',
];

const updateArgsFields = <const>['instalmentPlan'];

@ArgsType()
export class CreateSaleArgs extends CreateArgsType(Sale, createArgFields) {
  @IsString()
  @Field()
  customerNIC: string;
}

@InputType()
class SaleWhereInput extends CreateWhereInputType() {}

@InputType()
class UpdateSaleInput extends CreateUpdateInputType(Sale, updateArgsFields) {}

@ArgsType()
export class UpdateSaleArgs extends CreateUpdateArgsType(
  SaleWhereInput,
  UpdateSaleInput
) {}

@ArgsType()
export class WhereOrderArgs extends CreateWhereArgsType() {}

@InputType()
export class SalesSortInput {
  @IsEnum(PaginationSort)
  @IsOptional()
  @Field(() => PaginationSort, { nullable: true })
  id?: PaginationSort;

  @IsEnum(PaginationSort)
  @IsOptional()
  @Field(() => PaginationSort, { nullable: true })
  dateCreated?: PaginationSort;
}

@ArgsType()
export class SalePaginationArgs extends CreatePaginationArgsType(
  SalesSortInput
) {
  @IsMongoId()
  @IsOptional()
  @Field({ nullable: true })
  guestId?: string;

  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  completed?: boolean;

  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  rejected?: boolean;

  @IsDate()
  @IsOptional()
  @Field({ nullable: true })
  startDate?: Date;

  @IsDate()
  @IsOptional()
  @Field({ nullable: true })
  endDate?: Date;
}

@ArgsType()
export class SalesPaginationSearchArgs extends CreateSearchPaginationArgsType(
  SalesSortInput
) {
  @IsDate()
  @IsOptional()
  @Field({ nullable: true })
  startDate?: Date;

  @IsDate()
  @IsOptional()
  @Field({ nullable: true })
  endDate?: Date;
}

@ArgsType()
export class OutstandingCustomersArgs extends SalePaginationArgs {
  @IsEnum(PaymentType)
  @IsOptional()
  @Field(() => PaymentType, { nullable: true })
  paymentType?: PaymentType;
}

@ArgsType()
export class SettleSaleArgs {
  @IsMongoId()
  @IsOptional()
  @Field({ nullable: true })
  orderId?: string;

  @IsMongoId()
  @IsOptional()
  @Field({ nullable: true })
  guestId?: string;

  @IsString()
  @IsOptional()
  @Field(() => PaymentType, { nullable: true })
  paymentType?: PaymentType;
}
