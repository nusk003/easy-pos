import { Entity, OneToOne, Property } from '@mikro-orm/core';
import { Field, ObjectType } from '@nestjs/graphql';
import { IntegrationType } from '@src/modules/hotel/entities';
import { User } from '@src/modules/user/user.entity';
import { IsURL } from '@src/utils/class-validation';
import { BaseEntity } from '@src/utils/entity';
import { SDKField, SDKObject } from '@src/utils/gql';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export enum MarketplaceAppKeyType {
  Super = 'Super',
  Default = 'Default',
}

@ObjectType()
@SDKObject({ abstract: true })
export class MarketplaceAppKey {
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsEnum(MarketplaceAppKeyType)
  type: MarketplaceAppKeyType;
}

@Entity({ tableName: 'marketplace_app' })
@ObjectType()
@SDKObject()
export class MarketplaceApp extends BaseEntity {
  @Property()
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
  description: string;

  @Property({ type: () => IntegrationType })
  @IsEnum(IntegrationType)
  @Field(() => IntegrationType)
  @SDKField()
  type: IntegrationType;

  @Property()
  @IsURL()
  @Field()
  @SDKField()
  logo: string;

  @Property()
  @IsURL()
  @Field()
  @SDKField()
  websiteURL: string;

  @Property()
  @IsURL()
  @Field()
  @SDKField()
  documentationURL: string;

  @Property()
  @IsURL()
  @Field()
  @SDKField()
  helpURL: string;

  @Property()
  @IsURL({ each: true })
  @Field(() => [String])
  @SDKField(() => String)
  redirectURLs: string[];

  @Property()
  @IsURL()
  @Field(() => String)
  @SDKField(() => String)
  connectLink: string;

  @Property()
  @IsBoolean()
  @Field()
  @SDKField()
  live: boolean;

  @Property()
  @IsBoolean()
  @Field()
  @SDKField()
  enabled: boolean;

  @Property({ nullable: true })
  @Type(() => MarketplaceAppKey)
  @ValidateNested({ each: true })
  @IsOptional()
  key?: MarketplaceAppKey;

  @OneToOne()
  @Field()
  @SDKField(() => User, { fields: ['id'] })
  developer: User;

  constructor(marketplaceApp?: Partial<MarketplaceApp>) {
    super();
    this.createEntity(marketplaceApp);
  }
}
