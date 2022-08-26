import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsURL } from '@src/utils/class-validation';
import { SDKField } from '@src/utils/gql';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

@ObjectType({ isAbstract: true })
@InputType('HotelAppExperimentalInput')
export class HotelAppExperimental {
  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  hideProfile?: boolean;
}

@ObjectType({ isAbstract: true })
@InputType('HotelAppMetadataIOSInput')
export class HotelAppMetadataIOS {
  @IsString()
  @IsNotEmpty()
  @Field()
  @SDKField()
  appStoreId: string;
}

@ObjectType({ isAbstract: true })
@InputType('HotelAppIOSScreenshotsInput')
export class HotelAppIOSScreenshots {
  @IsString()
  @IsNotEmpty()
  @Field()
  @SDKField()
  _1: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  @SDKField()
  _2: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  @SDKField()
  _3: string;
}

@ObjectType({ isAbstract: true })
@InputType('HotelAppAndroidScreenshotsInput')
export class HotelAppAndroidScreenshots extends HotelAppIOSScreenshots {
  @IsURL()
  @Field()
  @SDKField()
  featureGraphic: string;
}

@ObjectType({ isAbstract: true })
@InputType('HotelAppScreenshotsInput')
export class HotelAppScreenshots {
  @Type(() => HotelAppIOSScreenshots)
  @ValidateNested()
  @Field(() => HotelAppIOSScreenshots)
  @SDKField()
  ios: HotelAppIOSScreenshots;

  @Type(() => HotelAppIOSScreenshots)
  @ValidateNested()
  @Field(() => HotelAppIOSScreenshots)
  @SDKField()
  ios55: HotelAppIOSScreenshots;

  @Type(() => HotelAppAndroidScreenshots)
  @ValidateNested()
  @Field(() => HotelAppAndroidScreenshots)
  @SDKField()
  android: HotelAppAndroidScreenshots;
}

@ObjectType({ isAbstract: true })
@InputType('HotelAppMetadataInput')
export class HotelAppMetadata {
  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  title?: string;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  subtitle?: string;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  shortDescription?: string;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  fullDescription?: string;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  keywords?: string;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  icon?: string;

  @Type(() => HotelAppScreenshots)
  @ValidateNested()
  @IsOptional()
  @Field(() => HotelAppScreenshots, { nullable: true })
  @SDKField()
  screenshots?: HotelAppScreenshots;

  @Type(() => HotelAppMetadataIOS)
  @ValidateNested()
  @IsOptional()
  @Field(() => HotelAppMetadataIOS, { nullable: true })
  @SDKField()
  ios?: HotelAppMetadataIOS;
}

@ObjectType({ isAbstract: true })
@InputType('HotelAppAssetsInput')
export class HotelAppAssets {
  @IsURL()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  featuredImage?: string;

  @IsURL()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  featuredLogo?: string;
}

@ObjectType({ isAbstract: true })
@InputType('HotelAppInput')
export class HotelApp {
  @IsNumber({ maxDecimalPlaces: 0 })
  @Min(1)
  @Field({ nullable: true })
  @SDKField()
  versionCode?: number;

  @IsURL()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  domain?: string;

  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  disabled?: boolean;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  disabledReason?: string;

  @Type(() => HotelAppMetadata)
  @ValidateNested()
  @IsOptional()
  @Field(() => HotelAppMetadata, { nullable: true })
  @SDKField()
  metadata?: HotelAppMetadata;

  @Type(() => HotelAppAssets)
  @ValidateNested()
  @IsOptional()
  @Field(() => HotelAppAssets, { nullable: true })
  @SDKField()
  assets?: HotelAppAssets;

  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true, deprecationReason: '' })
  @SDKField()
  forceUpdate?: boolean;

  @Type(() => HotelAppExperimental)
  @ValidateNested()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  experimental?: HotelAppExperimental;
}
