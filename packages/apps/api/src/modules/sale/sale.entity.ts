import { ESField, ESIndex, ShardingStrategy } from '@libs/elasticsearch';
import { Entity, Index, ManyToOne, Property } from '@mikro-orm/core';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { PricelistDeliveryType } from '@src/modules/pricelist/pricelist.entity';
import { TenantBaseEntity } from '@src/utils/entity';
import { SDKField, SDKObject } from '@src/utils/gql';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { Customer } from '../customer/customer.entity';

@ObjectType({ isAbstract: true })
@InputType('SaleItemInput')
export class SaleItem {
  @IsUUID()
  @Field()
  @SDKField()
  id: string;

  @IsString()
  @Field()
  @SDKField()
  productId: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  @SDKField()
  title: string;

  @IsNumber({ maxDecimalPlaces: 0 })
  @Min(1)
  @Field()
  @SDKField()
  quantity: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Field()
  @SDKField()
  totalSell: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Field()
  @SDKField()
  totalCost: number;
}

@ObjectType({ isAbstract: true })
@InputType('SaleInstalmentTermInput')
export class SaleInstalmentTerm {
  @IsUUID()
  @Field()
  @SDKField()
  id: string;

  @IsDate()
  @Field(() => Date, { nullable: true })
  @SDKField()
  dueDate: Date;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Field()
  @SDKField()
  dueAmount: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Field()
  @SDKField()
  paidAmount: number;

  @IsBoolean()
  @Field()
  @SDKField()
  get completed(): boolean {
    if (this.dueAmount === this.paidAmount) return true;
    return false;
  }
}

@ObjectType({ isAbstract: true })
@InputType('SaleInstalmentPlanInput')
export class SaleInstalmentPlan {
  @IsNumber({ maxDecimalPlaces: 0 })
  @Min(1)
  @Field()
  @SDKField()
  noTerms: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Field()
  @SDKField()
  initialPayment: number;

  @Field(() => [SaleInstalmentTerm])
  @SDKField(() => SaleInstalmentTerm)
  terms: SaleInstalmentTerm[];
}

@Entity({ tableName: 'sale' })
@ESIndex({ shardingStrategy: ShardingStrategy.Group })
@ObjectType()
@SDKObject()
export class Sale extends TenantBaseEntity {
  @Property()
  @ESField()
  @Type(() => SaleItem)
  @IsArray()
  @ValidateNested({ each: true })
  @Field(() => [SaleItem])
  @SDKField(() => SaleItem)
  items: SaleItem[];

  @Property()
  @ESField()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Field()
  @SDKField()
  totalPrice: number;

  @Property({ nullable: true })
  @ESField()
  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  salesReference?: string;

  @Property()
  @ESField()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Field()
  @SDKField()
  subtotal: number;

  @ManyToOne(() => Customer)
  @Index()
  @ESField(() => Customer)
  @Type(() => Customer)
  @Field(() => Customer)
  @SDKField(() => Customer, {
    fields: ['id', 'firstName', 'lastName', 'nic', 'phone', 'address'],
  })
  customer: Customer;

  @Property({
    type: () => SaleInstalmentPlan,
    nullable: true,
  })
  @ESField()
  @Type(() => SaleInstalmentPlan)
  @Field(() => SaleInstalmentPlan)
  @SDKField()
  instalmentPlan?: SaleInstalmentPlan;

  constructor(
    order?: Partial<
      Pick<
        Sale,
        | 'id'
        | 'customer'
        | 'salesReference'
        | 'items'
        | 'totalPrice'
        | 'subtotal'
      >
    >
  ) {
    super();
    this.createEntity(order);
  }
}
