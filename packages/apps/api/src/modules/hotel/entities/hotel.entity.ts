import {
  Collection,
  Entity,
  Filter,
  Index,
  ManyToMany,
  ManyToOne,
  Property,
} from '@mikro-orm/core';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Coordinates } from '@src/modules/attraction/attraction.entity';
import { Group } from '@src/modules/group/entities';
import { User } from '@src/modules/user/user.entity';
import { IsCollection, IsCurrencyCode } from '@src/utils/class-validation';
import { BaseEntity } from '@src/utils/entity';
import { SDKField, SDKObject } from '@src/utils/gql';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsISO31661Alpha2,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { HotelApp } from './hotel-app.entity';
import { BookingsSettings } from './hotel-bookings-settings.entity';
import { HotelCustomLink } from './hotel-custom-link.entity';
import { HotelIntegrations } from './hotel-integrations.entity';
import { MessagesSettings } from './hotel-messages-settings.entity';
import { HotelPayouts } from './hotel-payouts.entity';
import { HotelPMSSettings } from './hotel-pms-settings.entity';

@ObjectType({ isAbstract: true })
@InputType('HotelAddressInput')
export class HotelAddress {
  @IsString()
  @IsNotEmpty()
  @Field()
  @SDKField()
  line1: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  @SDKField()
  line2: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  @SDKField()
  town: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  @SDKField()
  country: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  @SDKField()
  postalCode: string;

  @Type(() => Coordinates)
  @ValidateNested()
  @IsOptional()
  @Field(() => Coordinates, { nullable: true })
  @SDKField()
  coordinates?: Coordinates;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  placeId?: string;
}

@Entity({ tableName: 'hotel' })
@Filter({
  name: 'active',
  cond: {
    $or: [{ deleted: { $exists: false } }, { deleted: { $eq: false } }],
  },
  default: false,
})
@ObjectType()
@SDKObject()
export class Hotel extends BaseEntity {
  @Property()
  @Index()
  @IsString()
  @IsNotEmpty()
  @Field()
  @SDKField()
  name: string;

  @Property()
  @IsString()
  @IsNotEmpty()
  @Field()
  @SDKField()
  telephone: string;

  @Property()
  @Type(() => HotelAddress)
  @ValidateNested()
  @Field(() => HotelAddress)
  @SDKField()
  address: HotelAddress;

  @Property()
  @IsString()
  @IsNotEmpty()
  @Field()
  @SDKField()
  website: string;

  @Property()
  @IsCurrencyCode()
  @Field()
  @SDKField()
  currencyCode: string;

  @Property()
  @IsISO31661Alpha2()
  @Field()
  @SDKField()
  countryCode: string;

  @Property({ nullable: true })
  @Type(() => HotelApp)
  @ValidateNested()
  @IsOptional()
  @Field(() => HotelApp, { nullable: true })
  @SDKField()
  app?: HotelApp;

  @Property({ nullable: true })
  @Type(() => HotelPayouts)
  @ValidateNested()
  @IsOptional()
  @Field(() => HotelPayouts, { nullable: true })
  @SDKField()
  payouts?: HotelPayouts;

  @Property({ nullable: true })
  @Type(() => MessagesSettings)
  @IsOptional()
  @Field(() => MessagesSettings, { nullable: true })
  @SDKField()
  messagesSettings?: MessagesSettings;

  @Property({ nullable: true })
  @Type(() => BookingsSettings)
  @ValidateNested()
  @IsOptional()
  @Field(() => BookingsSettings, { nullable: true })
  @SDKField()
  bookingsSettings?: BookingsSettings;

  @Property({ nullable: true })
  @Type(() => HotelPMSSettings)
  @ValidateNested()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  pmsSettings?: HotelPMSSettings;

  @Property({ nullable: true })
  @Type(() => HotelCustomLink)
  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  @Field(() => [HotelCustomLink], { nullable: true })
  @SDKField(() => HotelCustomLink)
  customLinks?: HotelCustomLink[];

  @Property({ nullable: true })
  @Type(() => HotelIntegrations)
  @ValidateNested()
  @IsOptional()
  @Field(() => HotelIntegrations, { nullable: true })
  @SDKField()
  integrations?: HotelIntegrations;

  @ManyToMany(() => User, 'hotels', { owner: true })
  @IsCollection(() => User)
  @Field(() => [User])
  users = new Collection<User>(this);

  @ManyToOne(() => Group)
  @Index()
  @Type(() => Group)
  @Field(() => Group)
  @SDKField(() => Group)
  group: Group;

  constructor(
    hotel?: Partial<
      Pick<
        Hotel,
        | 'id'
        | 'name'
        | 'telephone'
        | 'address'
        | 'currencyCode'
        | 'countryCode'
        | 'app'
        | 'payouts'
      >
    >
  ) {
    super();
    this.createEntity(hotel);
  }
}
