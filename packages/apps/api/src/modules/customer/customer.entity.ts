import { Entity, Property } from '@mikro-orm/core';
import { Field, ObjectType } from '@nestjs/graphql';
import { ESField, ESIndex } from '@src/libs/elasticsearch';
import { TenantBaseEntity } from '@src/utils/entity';
import { SDKField, SDKObject } from '@src/utils/gql';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

@Entity({ tableName: 'customer' })
@ESIndex()
@ObjectType()
@SDKObject()
export class Customer extends TenantBaseEntity {
  @Property()
  @ESField()
  @IsString()
  @IsNotEmpty()
  @Field()
  @SDKField()
  firstName: string;

  @Property()
  @ESField()
  @IsString()
  @IsNotEmpty()
  @Field()
  @SDKField()
  lastName: string;

  @Property()
  @ESField()
  @IsString()
  @IsNotEmpty()
  @Field()
  @SDKField()
  nic: string;

  @Property()
  @ESField()
  @IsString()
  @IsNotEmpty()
  @Field()
  @SDKField()
  phone: string;

  @Property()
  @ESField()
  @IsString()
  @IsNotEmpty()
  @Field()
  @SDKField()
  address: string;

  constructor(
    customer?: Partial<
      Pick<
        Customer,
        'id' | 'firstName' | 'lastName' | 'nic' | 'phone' | 'address'
      >
    >
  ) {
    super();
    this.createEntity(customer);
  }
}
