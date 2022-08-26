import { ESField, ESIndex, ShardingStrategy } from '@libs/elasticsearch';
import { Entity, Index, ManyToOne, OneToOne, Property } from '@mikro-orm/core';
import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { Guest } from '@src/modules/guest/guest.entity';
import { PayoutsStrategy } from '@src/modules/hotel/entities';
import {
  Pricelist,
  PricelistCollectionType,
  PricelistDeliveryType,
  PricelistMultiplierType,
  PricelistItemPOSPriceLevel,
  PricelistPOSSettingsFulfilment,
} from '@src/modules/pricelist/pricelist.entity';
import { Space } from '@src/modules/space/space.entity';
import { Thread } from '@src/modules/thread/thread.entity';
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
  Length,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export enum PaymentType {
  Cash = 'Cash',
  Card = 'Card',
  RoomBill = 'RoomBill',
  None = 'None',
}
registerEnumType(PaymentType, { name: 'PaymentType' });

export enum OrderStatus {
  Waiting = 'Waiting',
  Approved = 'Approved',
  Ready = 'Ready',
  Completed = 'Completed',
  Rejected = 'Rejected', // rejected by hotel
  Canceled = 'Canceled', // canceled by guest
}
registerEnumType(OrderStatus, { name: 'OrderStatus' });

@ObjectType({ isAbstract: true })
@InputType('CardDetailsInput')
class CardDetails {
  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  id?: string;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  country?: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  @SDKField()
  brand: string;

  @IsString()
  @IsNotEmpty()
  @Length(4, 4)
  @Field()
  @SDKField()
  last4: string;
}

@ObjectType({ isAbstract: true })
@InputType('PriceMultiplierInput')
class PriceMultiplier {
  @IsUUID()
  @Field()
  @SDKField()
  id: string;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  posId?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(1)
  @Field()
  @SDKField()
  value: number;

  @IsEnum(PricelistMultiplierType)
  @Field(() => PricelistMultiplierType)
  @SDKField()
  type: PricelistMultiplierType;

  @IsString()
  @IsNotEmpty()
  @Field()
  @SDKField()
  name: string;
}

@ObjectType({ isAbstract: true })
@InputType('OrderItemOptionInput')
export class OrderItemOption {
  @IsUUID()
  @Field()
  @SDKField()
  id: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  @SDKField()
  name: string;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  posId?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Field()
  @SDKField()
  price: number;
}

@ObjectType({ isAbstract: true })
@InputType('OrderItemModifierInput')
export class OrderItemModifier {
  @IsUUID()
  @Field()
  @SDKField()
  id: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  @SDKField()
  name: string;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  posId?: string;

  @Type(() => OrderItemOption)
  @IsArray()
  @ValidateNested({ each: true })
  @Field(() => [OrderItemOption])
  @SDKField(() => OrderItemOption)
  options: OrderItemOption[];
}

@ObjectType({ isAbstract: true })
@InputType('OrderItemPOSSettingsInput')
export class OrderItemPOSSettings {
  @Type(() => PricelistItemPOSPriceLevel)
  @ValidateNested()
  @IsOptional()
  @Field(() => PricelistItemPOSPriceLevel, { nullable: true })
  @SDKField(() => PricelistItemPOSPriceLevel)
  tableService?: PricelistItemPOSPriceLevel;

  @Type(() => PricelistItemPOSPriceLevel)
  @ValidateNested()
  @IsOptional()
  @Field(() => PricelistItemPOSPriceLevel, { nullable: true })
  @SDKField(() => PricelistItemPOSPriceLevel)
  roomService?: PricelistItemPOSPriceLevel;
}

@ObjectType({ isAbstract: true })
@InputType('OrderItemInput')
export class OrderItem {
  @IsUUID()
  @Field()
  @SDKField()
  id: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  @SDKField()
  name: string;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  posId?: string;

  @Type(() => OrderItemModifier)
  @IsArray()
  @ValidateNested({ each: true })
  @Field(() => [OrderItemModifier])
  @SDKField(() => OrderItemModifier)
  modifiers: OrderItemModifier[];

  @Type(() => PriceMultiplier)
  @ValidateNested()
  @IsOptional()
  @Field(() => PriceMultiplier, { nullable: true })
  @SDKField(() => PriceMultiplier)
  discount?: PriceMultiplier;

  @IsNumber({ maxDecimalPlaces: 0 })
  @Min(1)
  @Field()
  @SDKField()
  quantity: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsOptional()
  @Field({ nullable: true })
  roomServicePrice?: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsOptional()
  @Field({ nullable: true })
  regularPrice?: number;

  @Type(() => PricelistPOSSettingsFulfilment)
  @IsOptional()
  @ValidateNested()
  @Field(() => PricelistPOSSettingsFulfilment, { nullable: true })
  @SDKField()
  posSettings?: PricelistPOSSettingsFulfilment;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Field()
  @SDKField()
  totalPrice: number;

  @Type(() => OrderItemPOSSettings)
  @IsOptional()
  @ValidateNested()
  @Field(() => OrderItemPOSSettings, { nullable: true })
  @SDKField()
  omnivoreSettings?: OrderItemPOSSettings;
}

@ObjectType({ isAbstract: true })
@InputType('OrderFeedbackInput')
export class OrderFeedback {
  @IsNumber({ maxDecimalPlaces: 0 })
  @Min(1)
  @Min(5)
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  rating?: number;
}

@Entity({ tableName: 'order' })
@ESIndex({ shardingStrategy: ShardingStrategy.Group })
@ObjectType()
@SDKObject()
export class Order extends TenantBaseEntity {
  @Property({ type: Date, nullable: true })
  @Index({ properties: ['dateApproved', 'hotel'] })
  @ESField(() => Date)
  @IsDate()
  @IsOptional()
  @Field(() => Date, { nullable: true })
  @SDKField(() => Date)
  dateApproved?: Date;

  @Property({ type: Date, nullable: true })
  @Index({ properties: ['dateReady', 'hotel'] })
  @ESField(() => Date)
  @IsDate()
  @IsOptional()
  @Field(() => Date, { nullable: true })
  @SDKField(() => Date)
  dateReady?: Date;

  @Property({ type: Date, nullable: true })
  @Index({ properties: ['dateCompleted', 'hotel'] })
  @ESField(() => Date)
  @IsDate()
  @IsOptional()
  @Field(() => Date, { nullable: true })
  @SDKField(() => Date)
  dateCompleted?: Date;

  @Property({ type: Date, nullable: true })
  @Index({ properties: ['dateScheduled', 'hotel'] })
  @ESField(() => Date)
  @IsDate()
  @IsOptional()
  @Field(() => Date, { nullable: true })
  @SDKField(() => Date)
  dateScheduled?: Date | null;

  @Property()
  @ESField()
  @Type(() => OrderItem)
  @IsArray()
  @ValidateNested({ each: true })
  @Field(() => [OrderItem])
  @SDKField(() => OrderItem)
  items: OrderItem[];

  @Property()
  @ESField()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Field()
  @SDKField()
  totalPrice: number;

  @Property()
  @ESField()
  @IsString()
  @IsNotEmpty()
  @Field()
  @SDKField()
  roomNumber: string;

  @Property({ nullable: true })
  @ESField()
  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  notes?: string;

  @Property({ nullable: true })
  @ESField()
  @Type(() => CardDetails)
  @ValidateNested()
  @IsOptional()
  @Field(() => CardDetails, { nullable: true })
  @SDKField()
  cardDetails?: CardDetails;

  @Property({ type: () => PayoutsStrategy, nullable: true })
  @Index({ properties: ['paymentProvider', 'hotel'] })
  @ESField(() => String)
  @IsEnum(PayoutsStrategy)
  @IsOptional()
  @Field(() => PayoutsStrategy, { nullable: true })
  @SDKField(() => String)
  paymentProvider?: PayoutsStrategy;

  @Property({ type: () => PaymentType })
  @Index({ properties: ['paymentType', 'hotel'] })
  @ESField(() => String)
  @IsEnum(PaymentType)
  @Field(() => PaymentType)
  @SDKField()
  paymentType: PaymentType;

  @Property({ nullable: true })
  @ESField()
  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  orderReference?: string;

  @Property({ nullable: true })
  @ESField()
  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  posId?: string;

  @Property({ nullable: true })
  @Index({ properties: ['paymentIntentId', 'hotel'] })
  @ESField()
  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  paymentIntentId?: string;

  @Property()
  @ESField()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Field()
  @SDKField()
  subtotal: number;

  @Property({ nullable: true })
  @ESField()
  @Type(() => PriceMultiplier)
  @ValidateNested()
  @IsOptional()
  @Field(() => PriceMultiplier, { nullable: true })
  @SDKField()
  discount?: PriceMultiplier;

  @Property({ nullable: true })
  @ESField()
  @Type(() => PriceMultiplier)
  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  @Field(() => [PriceMultiplier], { nullable: true })
  @SDKField(() => PriceMultiplier)
  surcharges?: PriceMultiplier[];

  @Property({ nullable: true })
  @ESField()
  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  reasonRejected?: string;

  @Property({ nullable: true })
  @Index({ properties: ['rejected', 'hotel'] })
  @ESField()
  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  rejected?: boolean;

  @Property({
    type: () => PricelistDeliveryType,
    nullable: true,
  })
  @ESField(() => String)
  @IsEnum(PricelistDeliveryType)
  @IsOptional()
  @Field(() => PricelistDeliveryType, { nullable: true })
  @SDKField()
  delivery?: PricelistDeliveryType;

  @Property({
    type: () => PricelistCollectionType,
    nullable: true,
  })
  @ESField(() => String)
  @IsEnum(PricelistCollectionType)
  @IsOptional()
  @Field(() => PricelistCollectionType, { nullable: true })
  @SDKField()
  collection?: PricelistCollectionType;

  @Property({ nullable: true })
  @Index({ properties: ['paid', 'hotel'] })
  @ESField()
  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  paid?: boolean;

  @Property({ nullable: true })
  @ESField()
  @Type(() => OrderFeedback)
  @ValidateNested()
  @IsOptional()
  @Field(() => OrderFeedback, { nullable: true })
  @SDKField()
  feedback?: OrderFeedback;

  @ManyToOne(() => Guest)
  @Index()
  @ESField(() => Guest, {
    fields: [
      'id',
      'firstName',
      'lastName',
      'mobile',
      'email',
      'mobileCountryCode',
    ],
  })
  @Type(() => Guest)
  @Field(() => Guest)
  @SDKField(() => Guest, { fields: ['id', 'firstName', 'lastName'] })
  guest: Guest;

  @ManyToOne()
  @Index()
  @Index({ properties: ['space', 'hotel'] })
  @ESField(() => Space, {
    fields: ['id', 'name'],
  })
  @Type(() => Space)
  @Field(() => Space)
  @SDKField(() => Space, { fields: ['id', 'name'] })
  space: Space;

  @ManyToOne()
  @Index()
  @Index({ properties: ['pricelist', 'hotel'] })
  @ESField(() => Pricelist, {
    fields: ['id', 'name'],
  })
  @Type(() => Pricelist)
  @Field(() => Pricelist)
  @SDKField(() => Pricelist, { fields: ['id', 'name'] })
  pricelist: Pricelist;

  @OneToOne({ entity: () => Thread, mappedBy: 'order', nullable: true })
  @Index({ properties: ['thread', 'hotel'] })
  @ESField(() => Thread, {
    mappedBy: (thread) => thread.id,
  })
  @Type(() => Thread)
  @IsOptional()
  @Field(() => Thread, { nullable: true })
  @SDKField(() => Thread, { fields: ['id'] })
  thread?: Thread;

  @Property({ nullable: true })
  @IsBoolean()
  @IsOptional()
  reminderEmailSent?: boolean;

  @ESField(() => OrderStatus, {
    getter: (order: Order) => {
      if (order.rejected) {
        return OrderStatus.Rejected;
      }
      if (order.dateCompleted) {
        return OrderStatus.Completed;
      }
      if (order.dateReady) {
        return OrderStatus.Ready;
      }
      if (order.dateApproved) {
        return OrderStatus.Approved;
      }
      return OrderStatus.Waiting;
    },
  })
  @Field(() => OrderStatus)
  @SDKField()
  get status(): OrderStatus {
    if (this.rejected) {
      return OrderStatus.Rejected;
    }
    if (this.dateCompleted) {
      return OrderStatus.Completed;
    }
    if (this.dateReady) {
      return OrderStatus.Ready;
    }
    if (this.dateApproved) {
      return OrderStatus.Approved;
    }
    return OrderStatus.Waiting;
  }

  constructor(
    order?: Partial<
      Pick<
        Order,
        | 'id'
        | 'dateApproved'
        | 'dateReady'
        | 'dateCompleted'
        | 'dateScheduled'
        | 'items'
        | 'totalPrice'
        | 'roomNumber'
        | 'notes'
        | 'cardDetails'
        | 'paymentProvider'
        | 'paymentType'
        | 'orderReference'
        | 'paymentIntentId'
        | 'subtotal'
        | 'discount'
        | 'reasonRejected'
        | 'rejected'
        | 'paid'
        | 'feedback'
      >
    >
  ) {
    super();
    this.createEntity(order);
  }
}
