import { ArgsType, Field, InputType } from '@nestjs/graphql';
import {
  Order,
  OrderFeedback,
  OrderStatus,
  PaymentType,
} from '@src/modules/order/order.entity';
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
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

const createArgFields = <const>[
  'dateApproved',
  'dateReady',
  'dateCompleted',
  'dateScheduled',
  'items',
  'totalPrice',
  'roomNumber',
  'notes',
  'cardDetails',
  'paymentProvider',
  'paymentType',
  'orderReference',
  'paymentIntentId',
  'subtotal',
  'discount',
  'surcharges',
  'delivery',
  'collection',
];

const updateArgsFields = <const>['reasonRejected', 'feedback'];

@ArgsType()
export class CreateOrderArgs extends CreateArgsType(Order, createArgFields) {
  @IsMongoId()
  @Field()
  pricelistId: string;

  @IsMongoId()
  @IsOptional()
  @Field({ nullable: true })
  guestId?: string;
}

@InputType()
class OrderWhereInput extends CreateWhereInputType() {}

@InputType()
class UpdateOrderInput extends CreateUpdateInputType(Order, updateArgsFields) {
  @IsEnum(OrderStatus)
  @IsOptional()
  @Field(() => OrderStatus, { nullable: true })
  status?: OrderStatus;

  @Type(() => OrderFeedback)
  @ValidateNested()
  @IsOptional()
  @Field(() => OrderFeedback, { nullable: true })
  feedback?: OrderFeedback;
}

@ArgsType()
export class UpdateOrderArgs extends CreateUpdateArgsType(
  OrderWhereInput,
  UpdateOrderInput
) {}

@ArgsType()
export class WhereOrderArgs extends CreateWhereArgsType() {}

@InputType()
export class OrdersSortInput {
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
export class OrderPaginationArgs extends CreatePaginationArgsType(
  OrdersSortInput
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
export class OrderPaginationSearchArgs extends CreateSearchPaginationArgsType(
  OrdersSortInput
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
export class SearchOutstandingOrdersArgs extends CreateSearchPaginationArgsType(
  OrdersSortInput
) {
  @IsMongoId()
  @IsOptional()
  @Field({ nullable: true })
  guestId?: string;

  @IsEnum(PaymentType)
  @IsOptional()
  @Field(() => PaymentType, { nullable: true })
  paymentType?: PaymentType;
}

@ArgsType()
export class OutstandingGuestsArgs extends OrderPaginationArgs {
  @IsEnum(PaymentType)
  @IsOptional()
  @Field(() => PaymentType, { nullable: true })
  paymentType?: PaymentType;
}

@ArgsType()
export class SettleOrderArgs {
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
