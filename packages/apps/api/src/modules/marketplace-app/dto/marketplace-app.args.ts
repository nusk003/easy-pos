import { ArgsType, Field, InputType } from '@nestjs/graphql';
import {
  HotelMarketplaceAppSubscription,
  HotelMarketplaceAppSubscriptionTopic,
} from '@src/modules/hotel/entities';
import { MarketplaceApp } from '@src/modules/marketplace-app/marketplace-app.entity';
import {
  CreateArgsType,
  CreateDeleteArgsType,
  CreateUpdateArgsType,
  CreateUpdateInputType,
  CreateWhereArgsType,
  CreateWhereInputType,
} from '@src/utils/dto';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

const argFields = <const>[
  'name',
  'description',
  'type',
  'logo',
  'websiteURL',
  'documentationURL',
  'helpURL',
  'connectLink',
  'redirectURLs',
  'live',
  'enabled',
];

const updateArgFields = <const>[
  'name',
  'description',
  'type',
  'logo',
  'websiteURL',
  'documentationURL',
  'helpURL',
  'connectLink',
  'redirectURLs',
  'live',
  'enabled',
];

@ArgsType()
export class CreateMarketplaceAppArgs extends CreateArgsType(
  MarketplaceApp,
  argFields
) {}

@InputType()
class MarketplaceAppWhereInput extends CreateWhereInputType() {}

@InputType()
class UpdateMarketplaceAppInput extends CreateUpdateInputType(
  MarketplaceApp,
  updateArgFields
) {}

@ArgsType()
export class UpdateMarketplaceAppArgs extends CreateUpdateArgsType(
  MarketplaceAppWhereInput,
  UpdateMarketplaceAppInput
) {}

@ArgsType()
export class DeleteMarketplaceAppArgs extends CreateDeleteArgsType() {}

@ArgsType()
export class WhereMarketplaceAppArgs extends CreateWhereArgsType() {}

@ArgsType()
export class GetMarketplaceAppsArgs {
  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  live?: boolean;

  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  enabled?: boolean;
}

@InputType()
export class GetMarketplaceAppWhereInput {
  @IsMongoId()
  @IsOptional()
  @Field({ nullable: true })
  id?: string;

  @IsMongoId()
  @IsOptional()
  @Field({ nullable: true })
  developer?: string;
}

@ArgsType()
export class GetMarketplaceAppArgs extends GetMarketplaceAppsArgs {
  @Type(() => GetMarketplaceAppWhereInput)
  @Field(() => GetMarketplaceAppWhereInput)
  where: GetMarketplaceAppWhereInput;
}

@ArgsType()
export class CreateMarketplaceAppSubscriptionArgs {
  @IsString()
  @Field()
  endpoint: string;

  @IsEnum(HotelMarketplaceAppSubscriptionTopic, { each: true })
  @ArrayMinSize(1)
  @Field(() => [HotelMarketplaceAppSubscriptionTopic])
  topics: string[];
}

@InputType()
class MarketplaceAppSubscriptionWhereInput {
  @IsUUID()
  @Field()
  id: string;
}

@InputType()
class UpdateMarketplaceAppSubscriptionInput extends CreateUpdateInputType(
  HotelMarketplaceAppSubscription,
  ['endpoint', 'topics']
) {}

@ArgsType()
export class UpdateMarketplaceAppSubscription extends CreateUpdateArgsType(
  MarketplaceAppSubscriptionWhereInput,
  UpdateMarketplaceAppSubscriptionInput
) {}

@ArgsType()
export class DeleteMarketplaceAppSubscription extends CreateDeleteArgsType() {}
