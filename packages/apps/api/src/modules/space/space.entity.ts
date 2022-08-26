import {
  Cascade,
  Collection,
  Entity,
  OneToMany,
  Property,
} from '@mikro-orm/core';
import { Field, ObjectType } from '@nestjs/graphql';
import { Pricelist } from '@src/modules/pricelist/pricelist.entity';
import { IsCollection } from '@src/utils/class-validation';
import { Availability, TenantBaseEntity } from '@src/utils/entity';
import { SDKField, SDKObject } from '@src/utils/gql';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

@Entity({ tableName: 'space' })
@ObjectType()
@SDKObject()
export class Space extends TenantBaseEntity {
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
  location: string;

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
  enabled?: boolean;

  @OneToMany(() => Pricelist, (pricelist) => pricelist.space, {
    cascade: [Cascade.ALL],
  })
  @IsCollection(() => Pricelist)
  @Field(() => [Pricelist])
  @SDKField(() => Pricelist)
  pricelists = new Collection<Pricelist>(this);

  constructor(
    space?: Partial<Pick<Space, 'id' | 'name' | 'location' | 'availability'>>
  ) {
    super();
    this.createEntity(space);
  }
}
