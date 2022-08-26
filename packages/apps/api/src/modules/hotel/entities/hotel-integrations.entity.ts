import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { IsURL } from '@src/utils/class-validation';
import { SDKField, SDKObject } from '@src/utils/gql';
import { Type } from 'class-transformer';
import {
  Equals,
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { ObjectId } from 'mongodb';

export enum IntegrationType {
  PMS = 'PMS',
  POS = 'POS',
}
registerEnumType(IntegrationType, { name: 'IntegrationType' });

export enum IntegrationProvider {
  Apaleo = 'Apaleo',
  Mews = 'Mews',
  Agilysys = 'Agilysys',
  Opera = 'Opera',
  Protel = 'Protel',
  RoomKeyPMS = 'Room Key PMS',
  Guestline = 'Guestline',
  RMS = 'RMS',
  ClockPMS = 'Clock PMS',
  WebRezPro = 'WebRezPro',
  Dinerware = 'Dinerware',
  FocusPos = 'Focus Pos',
  MaitreD = 'Maitre D',
  Micros3700 = 'Micros 3700',
  MicrosSimphony = 'Micros Simphony',
  MicrosSimphonyFirstEdition = 'Micros Simphony First Edition',
  NcrAloha = 'NCR Aloha',
  PosItouch = 'POSitouch',
  Squirrel = 'Squirrel',
  Xpient = 'Xpient',
  OmnivoreVirtualPos = 'Omnivore Virtual POS',
}
registerEnumType(IntegrationProvider, {
  name: 'IntegrationProvider',
});

export enum HotelMarketplaceAppSubscriptionTopic {
  Booking = 'Booking',
  Order = 'Order',
  Space = 'Space',
}
registerEnumType(HotelMarketplaceAppSubscriptionTopic, {
  name: 'HotelMarketplaceAppSubscriptionTopic',
});

@ObjectType()
@InputType('HotelMarketplaceAppSubscriptionInput')
@SDKObject()
export class HotelMarketplaceAppSubscription {
  @IsUUID()
  @Field()
  @SDKField()
  id: string;

  @IsURL()
  @Field()
  @SDKField()
  endpoint: string;

  @IsEnum(HotelMarketplaceAppSubscriptionTopic, { each: true })
  @Field(() => [HotelMarketplaceAppSubscriptionTopic])
  @SDKField(() => String)
  topics: string[];
}

@ObjectType()
@InputType('HotelMarketplaceAppInput')
@SDKObject()
export class HotelMarketplaceApp {
  @Field(() => String)
  @SDKField(() => String)
  id: string | ObjectId;

  @IsString()
  @Field()
  @SDKField()
  name: string;

  @IsEnum(IntegrationType)
  @Field()
  @SDKField()
  type: IntegrationType;

  @Type(() => HotelMarketplaceAppSubscription)
  @ValidateNested()
  @IsOptional()
  subscriptions?: HotelMarketplaceAppSubscription[];
}

@ObjectType({ isAbstract: true })
@InputType('HotelIntegrationsMewsInput')
export class HotelIntegrationsMews {
  @Equals(IntegrationProvider.Mews)
  @Field(() => String)
  @SDKField()
  provider: IntegrationProvider.Mews;

  @Equals(IntegrationType.PMS)
  @Field(() => IntegrationType)
  @SDKField()
  type: IntegrationType.PMS;

  @IsString()
  @IsOptional()
  @Field()
  accessToken?: string;

  @IsString()
  @IsOptional()
  @Field()
  clientToken?: string;
}

@ObjectType({ isAbstract: true })
@InputType('HotelIntegrationsInput')
export class HotelIntegrations {
  @Type(() => HotelIntegrationsMews)
  @ValidateNested()
  @IsOptional()
  @Field(() => HotelIntegrationsMews, { nullable: true })
  @SDKField()
  mews?: HotelIntegrationsMews;

  @Type(() => HotelMarketplaceApp)
  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  @Field(() => [HotelMarketplaceApp], { nullable: true })
  @SDKField(() => HotelMarketplaceApp)
  marketplaceApps?: HotelMarketplaceApp[];
}
