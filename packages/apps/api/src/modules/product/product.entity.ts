import { Entity, Property } from '@mikro-orm/core';
import { Field, ObjectType } from '@nestjs/graphql';
import { ESField, ESIndex } from '@src/libs/elasticsearch';
import { TenantBaseEntity } from '@src/utils/entity';
import { SDKField, SDKObject } from '@src/utils/gql';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

@Entity({ tableName: 'product' })
@ESIndex()
@ObjectType()
@SDKObject()
export class Product extends TenantBaseEntity {
  @Property()
  @ESField()
  @IsString()
  @IsNotEmpty()
  @Field()
  @SDKField()
  name: string;

  @Property()
  @ESField()
  @IsString()
  @IsNotEmpty()
  @Field()
  @SDKField()
  code: string;

  @Property()
  @ESField()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Field()
  @SDKField()
  stock: number;

  @Property()
  @ESField()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Field()
  @SDKField()
  sellPrice: number;

  @Property()
  @ESField()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Field()
  @SDKField()
  costPrice: number;

  constructor(
    product?: Partial<
      Pick<
        Product,
        'id' | 'name' | 'costPrice' | 'sellPrice' | 'stock' | 'code'
      >
    >
  ) {
    super();
    this.createEntity(product);
  }
}
