import { Entity, Index, ManyToOne, Property } from '@mikro-orm/core';
import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { Space } from '@src/modules/space/space.entity';
import { Availability, TenantBaseEntity } from '@src/utils/entity';
import { SDKField, SDKObject } from '@src/utils/gql';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { IntegrationProvider } from '@src/modules/hotel/entities';

export enum PricelistDeliveryType {
  Room = 'Room',
  Table = 'Table',
  Other = 'Other',
}
registerEnumType(PricelistDeliveryType, {
  name: 'PricelistDeliveryType',
});

export enum PricelistCollectionType {
  Other = 'other',
}
registerEnumType(PricelistCollectionType, {
  name: 'PricelistCollectionType',
});

export enum PricelistMultiplierType {
  Absolute = 'Absolute',
  Percentage = 'Percentage',
}
registerEnumType(PricelistMultiplierType, {
  name: 'PricelistMultiplierType',
});

export enum PricelistDiscountLevel {
  Order = 'Order',
  Item = 'Item',
}
registerEnumType(PricelistDiscountLevel, {
  name: 'PricelistDiscountLevel',
});

@ObjectType({ isAbstract: true })
@InputType('PricelistCollectionInput')
export class PricelistCollection {
  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  enabled?: boolean;

  @IsEnum(PricelistCollectionType)
  @Field(() => PricelistCollectionType)
  @SDKField()
  type: PricelistCollectionType;
}

@ObjectType({ isAbstract: true })
@InputType('PricelistDeliveryInput')
export class PricelistDelivery {
  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  enabled?: boolean;

  @IsEnum(PricelistDeliveryType)
  @Field(() => PricelistDeliveryType)
  @SDKField()
  type: PricelistDeliveryType;
}

@ObjectType({ isAbstract: true })
@InputType('PricelistLabelInput')
export class PricelistLabel {
  @IsUUID()
  @Field()
  @SDKField()
  id: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  @SDKField()
  name: string;
}

@ObjectType({ isAbstract: true })
@InputType('PricelistItemOptionInput')
export class PricelistItemOption {
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
@InputType('PricelistItemModifierInput')
export class PricelistItemModifier {
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

  @IsBoolean()
  @Field()
  @SDKField()
  required: boolean;

  @IsNumber({ maxDecimalPlaces: 0 })
  @Min(-1)
  @Field()
  @SDKField()
  maxSelection: number; // -1 indicates that max selection is infinite

  @Type(() => PricelistItemOption)
  @IsArray()
  @ValidateNested({ each: true })
  @Field(() => [PricelistItemOption])
  @SDKField(() => PricelistItemOption)
  options: PricelistItemOption[];
}

@ObjectType({ isAbstract: true })
@InputType('PricelistDiscountPOSSettingsInput')
export class PricelistDiscountPOSSettings {
  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  open?: boolean;
}

@ObjectType({ isAbstract: true })
@InputType('PricelistDiscountInput')
export class PricelistDiscount {
  @IsUUID()
  @Field()
  @SDKField()
  id: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  @SDKField()
  name: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(1)
  @Field()
  @SDKField()
  value: number;

  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  available?: boolean;

  @IsEnum(PricelistDiscountLevel)
  @IsOptional()
  @Field(() => PricelistDiscountLevel, { nullable: true })
  @SDKField()
  level?: PricelistDiscountLevel;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  minOrderAmount?: number;

  @IsEnum(PricelistMultiplierType)
  @Field(() => PricelistMultiplierType)
  @SDKField()
  type: PricelistMultiplierType;

  @Type(() => PricelistDiscountPOSSettings)
  @ValidateNested()
  @IsOptional()
  @Field(() => PricelistDiscountPOSSettings, { nullable: true })
  @SDKField()
  posSettings?: PricelistDiscountPOSSettings;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  posId?: string;

  @Type(() => PricelistDelivery)
  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  @Field(() => [PricelistDelivery], { nullable: true })
  @SDKField(() => PricelistDelivery)
  delivery?: PricelistDelivery[];

  @Type(() => PricelistCollection)
  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  @Field(() => [PricelistCollection], { nullable: true })
  @SDKField(() => PricelistCollection)
  collection?: PricelistCollection[];

  @IsNumber({ maxDecimalPlaces: 0 })
  @Min(0)
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  count?: number;
}

@ObjectType({ isAbstract: true })
@InputType('PricelistPromotionsInput')
export class PricelistPromotions {
  @Type(() => PricelistDiscount)
  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  @Field(() => [PricelistDiscount], { nullable: true })
  @SDKField(() => PricelistDiscount)
  discounts?: PricelistDiscount[];
}

@ObjectType({ isAbstract: true })
@InputType('PricelistItemPOSPriceLevelInput')
export class PricelistItemPOSPriceLevel {
  @IsString()
  @IsNotEmpty()
  @Field()
  @SDKField()
  posId: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  @SDKField()
  name: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Field()
  @SDKField()
  price: number;
}

@ObjectType({ isAbstract: true })
@InputType('PricelistPOSSettingsFulfilmentInput')
export class PricelistPOSSettingsFulfilment {
  @IsString()
  @IsNotEmpty()
  @Field()
  @SDKField()
  posId: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  @SDKField()
  name: string;
}

@ObjectType({ isAbstract: true })
@InputType('PricelistItemPOSSettingsInput')
export class PricelistItemPOSSettings {
  @Type(() => PricelistItemPOSPriceLevel)
  @ValidateNested()
  @Field(() => PricelistItemPOSPriceLevel)
  @SDKField()
  roomService: PricelistItemPOSPriceLevel;

  @Type(() => PricelistItemPOSPriceLevel)
  @ValidateNested()
  @Field(() => PricelistItemPOSPriceLevel)
  @SDKField()
  tableService: PricelistItemPOSPriceLevel;

  @Type(() => PricelistItemPOSPriceLevel)
  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  @Field(() => [PricelistItemPOSPriceLevel], { nullable: true })
  @SDKField(() => PricelistItemPOSPriceLevel)
  priceLevels?: PricelistItemPOSPriceLevel[];
}

@ObjectType({ isAbstract: true })
@InputType('PricelistItemInput')
export class PricelistItem {
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
  description?: string;

  @IsString({ each: true })
  @IsOptional()
  @Field(() => [String], { nullable: true })
  @SDKField(() => String)
  photos?: string[];

  @Type(() => PricelistItemModifier)
  @IsArray()
  @ValidateNested({ each: true })
  @Field(() => [PricelistItemModifier])
  @SDKField(() => PricelistItemModifier)
  modifiers: PricelistItemModifier[];

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Field()
  @SDKField()
  regularPrice: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Field()
  @SDKField()
  roomServicePrice: number;

  @Type(() => PricelistItemPOSSettings)
  @ValidateNested()
  @IsOptional()
  @Field(() => PricelistItemPOSSettings, { nullable: true })
  @SDKField()
  posSettings?: PricelistItemPOSSettings;

  @Type(() => PricelistLabel)
  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  @Field(() => [PricelistLabel], { nullable: true })
  @SDKField(() => PricelistLabel)
  labels?: PricelistLabel[];

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  note?: string;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  posId?: string;

  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  snoozed?: boolean;

  @Type(() => PricelistPromotions)
  @ValidateNested()
  @IsOptional()
  @Field(() => PricelistPromotions, { nullable: true })
  @SDKField()
  promotions?: PricelistPromotions;
}

@ObjectType({ isAbstract: true })
@InputType('PricelistCategoryInput')
export class PricelistCategory {
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
  description?: string;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  posId?: string;

  @Type(() => PricelistItem)
  @IsArray()
  @ValidateNested({ each: true })
  @Field(() => [PricelistItem])
  @SDKField(() => PricelistItem)
  items: PricelistItem[];
}

@ObjectType({ isAbstract: true })
@InputType('PricelistCatalogInput')
export class PricelistCatalog {
  @Type(() => PricelistCategory)
  @IsArray()
  @ValidateNested({ each: true })
  @Field(() => [PricelistCategory])
  @SDKField(() => PricelistCategory)
  categories: PricelistCategory[];

  @Type(() => PricelistLabel)
  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  @Field(() => [PricelistLabel], { nullable: true })
  @SDKField(() => PricelistLabel)
  labels?: PricelistLabel[];
}

@ObjectType({ isAbstract: true })
@InputType('PricelistEnabledPaymentsInput')
export class PricelistEnabledPayments {
  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  card?: boolean;

  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  roomBill?: boolean;

  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  cash?: boolean;
}

@ObjectType({ isAbstract: true })
@InputType('PricelistSurchargeInput')
export class PricelistSurcharge {
  @IsUUID()
  @Field()
  @SDKField()
  id: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  @SDKField()
  name: string;

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

  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  @Field(() => [PricelistDelivery], { nullable: true })
  @SDKField(() => PricelistDelivery)
  delivery?: PricelistDelivery[];

  @Type(() => PricelistCollection)
  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  @Field(() => [PricelistCollection], { nullable: true })
  @SDKField(() => PricelistCollection)
  collection?: PricelistCollection[];
}

@ObjectType({ isAbstract: true })
@InputType('PricelistPOSSettingsInput')
@SDKObject({ abstract: true })
export class PricelistPOSSettings {
  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  enabled?: boolean;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  posId?: string;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  revenueCenterId?: string;

  @Type(() => PricelistPOSSettingsFulfilment)
  @ValidateNested()
  @Field(() => PricelistPOSSettingsFulfilment)
  @SDKField()
  tableService: PricelistPOSSettingsFulfilment;

  @Type(() => PricelistPOSSettingsFulfilment)
  @ValidateNested()
  @Field(() => PricelistPOSSettingsFulfilment)
  @SDKField()
  roomService: PricelistPOSSettingsFulfilment;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  employeeId?: string;

  @IsEnum(IntegrationProvider)
  @IsOptional()
  @Field(() => String, { nullable: true })
  @SDKField()
  provider?: IntegrationProvider;
}

@Entity({ tableName: 'pricelist' })
@ObjectType()
@SDKObject()
export class Pricelist extends TenantBaseEntity {
  @Property()
  @IsString()
  @IsNotEmpty()
  @Field()
  @SDKField()
  name: string;

  @Property({ nullable: true })
  @IsString()
  @Field({ nullable: true })
  @SDKField()
  description?: string;

  @Property()
  @Type(() => Availability)
  @ValidateNested()
  @Field(() => Availability)
  @SDKField()
  availability: Availability;

  @Property({ nullable: true })
  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  commerce?: boolean;

  @Property({ nullable: true })
  @Type(() => PricelistCollection)
  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  @Field(() => [PricelistCollection], { nullable: true })
  @SDKField(() => PricelistCollection)
  collection?: PricelistCollection[];

  @Property({ nullable: true })
  @Type(() => PricelistDelivery)
  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  @Field(() => [PricelistDelivery], { nullable: true })
  @SDKField(() => PricelistDelivery)
  delivery?: PricelistDelivery[];

  @Property({ nullable: true })
  @Type(() => PricelistCatalog)
  @ValidateNested()
  @IsOptional()
  @Field(() => PricelistCatalog, { nullable: true })
  @SDKField()
  catalog?: PricelistCatalog;

  @Property({ nullable: true })
  @Type(() => PricelistCatalog)
  @ValidateNested()
  @IsOptional()
  @Field(() => PricelistPOSSettings, { nullable: true })
  @SDKField()
  posSettings?: PricelistPOSSettings;

  @Property({ nullable: true })
  @Type(() => PricelistPromotions)
  @ValidateNested()
  @IsOptional()
  @Field(() => PricelistPromotions, { nullable: true })
  @SDKField()
  promotions?: PricelistPromotions;

  @Property({ nullable: true })
  @Type(() => PricelistSurcharge)
  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  @Field(() => [PricelistSurcharge], { nullable: true })
  @SDKField(() => PricelistSurcharge)
  surcharges?: PricelistSurcharge[];

  @Property({ nullable: true })
  @Type(() => PricelistEnabledPayments)
  @ValidateNested()
  @IsOptional()
  @Field(() => PricelistEnabledPayments, { nullable: true })
  @SDKField()
  enabledPayments?: PricelistEnabledPayments;

  @Property({ nullable: true })
  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  autoApprove?: boolean;

  @Property({ nullable: true })
  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  feedback?: boolean;

  @Property({ nullable: true })
  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  posId?: string;

  @ManyToOne(() => Space)
  @Index()
  @Index({ properties: ['space', 'hotel'] })
  @Type(() => Space)
  @Field(() => Space)
  @SDKField(() => Space, { omit: ['pricelists'] })
  space: Space;

  constructor(pricelist?: Partial<Pricelist>) {
    super();
    this.createEntity(pricelist);
  }
}
