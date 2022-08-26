import { Entity, Property } from '@mikro-orm/core';
import { Field, Float, InputType, ObjectType } from '@nestjs/graphql';
import { IsURL } from '@src/utils/class-validation';
import { TenantBaseEntity } from '@src/utils/entity';
import { SDKField, SDKObject } from '@src/utils/gql';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

@ObjectType({ isAbstract: true })
@InputType('AttractionCoordinatesInput')
export class Coordinates {
  @IsLatitude()
  @Field()
  @SDKField()
  lat: number;

  @IsLongitude()
  @Field()
  @SDKField()
  lng: number;
}

@ObjectType({ isAbstract: true })
@InputType('AttractionPlaceLabelInput')
export class AttractionPlaceLabel {
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
@InputType('AttractionPlaceInput')
export class AttractionPlace {
  @IsUUID()
  @Field({ nullable: true })
  @SDKField()
  id: string;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  placeId?: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  @SDKField()
  name: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  @SDKField()
  address: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  @Max(5)
  @IsOptional()
  @Field(() => Float, { nullable: true })
  @SDKField()
  rating?: number;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  note?: string;

  @Type(() => Coordinates)
  @ValidateNested()
  @IsOptional()
  @Field(() => Coordinates, { nullable: true })
  @SDKField()
  coordinates?: Coordinates;

  @IsString({ each: true })
  @Field(() => [String])
  @SDKField(() => String)
  photos: string[];

  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  @SDKField()
  description?: string;

  @IsURL()
  @IsOptional()
  @Field(() => String, { nullable: true })
  @SDKField()
  website?: string;

  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  @SDKField()
  phone?: string;

  @IsBoolean()
  @IsOptional()
  @Field({ defaultValue: false })
  @SDKField()
  requestBooking?: boolean;

  @Type(() => AttractionPlaceLabel)
  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  @Field(() => [AttractionPlaceLabel], { defaultValue: [] })
  @SDKField(() => AttractionPlaceLabel)
  labels?: AttractionPlaceLabel[];
}

@ObjectType({ isAbstract: true })
@InputType('AttractionCategoryInput')
export class AttractionCategory {
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

  @Type(() => AttractionPlace)
  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  @Field(() => [AttractionPlace])
  @SDKField(() => AttractionPlace)
  places: AttractionPlace[];
}

@ObjectType({ isAbstract: true })
@InputType('AttractionCatalogInput')
export class AttractionCatalog {
  @Type(() => AttractionCategory)
  @IsArray()
  @ValidateNested({ each: true })
  @Field(() => [AttractionCategory])
  @SDKField(() => AttractionCategory)
  categories: AttractionCategory[];

  @Type(() => AttractionPlaceLabel)
  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  @Field(() => [AttractionPlaceLabel], { nullable: true })
  @SDKField(() => AttractionPlaceLabel)
  labels?: AttractionPlaceLabel[];
}

@Entity({ tableName: 'attraction' })
@ObjectType()
@SDKObject()
export class Attraction extends TenantBaseEntity {
  @Property({ nullable: true })
  @Type(() => AttractionCatalog)
  @ValidateNested()
  @IsOptional()
  @Field(() => AttractionCatalog, { nullable: true })
  @SDKField()
  catalog?: AttractionCatalog;

  @Property({ nullable: true })
  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  enabled?: boolean;

  @Property({ nullable: true })
  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  description?: string;

  constructor(
    attraction?: Partial<
      Pick<Attraction, 'description' | 'catalog' | 'enabled'>
    >
  ) {
    super();
    this.createEntity(attraction);
  }
}
