import {
  Collection,
  Entity,
  ManyToMany,
  OneToMany,
  Property,
} from '@mikro-orm/core';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Guest } from '@src/modules/guest/guest.entity';
import { Hotel, HotelApp } from '@src/modules/hotel/entities';
import { User } from '@src/modules/user/user.entity';
import { IsCollection } from '@src/utils/class-validation';
import { BaseEntity } from '@src/utils/entity';
import { SDKField, SDKObject } from '@src/utils/gql';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { GroupIntegrations } from './group-integrations.entity';

@ObjectType({ isAbstract: true })
@InputType('GroupAppInput')
@SDKObject({ abstract: true })
class GroupApp extends HotelApp {
  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  aggregator?: boolean;
}

@Entity({ tableName: 'group' })
@ObjectType()
@SDKObject()
export class Group extends BaseEntity {
  @Property()
  @IsString()
  @Field()
  name: string;

  @Property({ nullable: true })
  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  hotelManager?: boolean;

  @Property({ nullable: true })
  @Type(() => GroupIntegrations)
  @ValidateNested()
  @IsOptional()
  @Field(() => GroupIntegrations, { nullable: true })
  @SDKField()
  integrations?: GroupIntegrations;

  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  demo?: boolean;

  @Property({ nullable: true })
  @Type(() => GroupApp)
  @ValidateNested()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  app?: GroupApp;

  @OneToMany(() => Hotel, (hotel) => hotel.group)
  @IsCollection(() => Hotel)
  @Field(() => [Hotel])
  hotels = new Collection<Hotel>(this);

  @OneToMany(() => User, (user) => user.group)
  @IsCollection(() => User)
  @Field(() => [User])
  users = new Collection<User>(this);

  @ManyToMany(() => Guest, 'groups', { owner: true })
  @IsCollection(() => Guest)
  guests = new Collection<Guest>(this);

  constructor(group?: Partial<Pick<Group, 'id' | 'name'>>) {
    super();
    this.createEntity(group);
  }
}
