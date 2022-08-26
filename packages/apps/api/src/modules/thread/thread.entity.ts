import {
  Collection,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  OneToOne,
  Property,
} from '@mikro-orm/core';
import { Field, ObjectType } from '@nestjs/graphql';
import { Guest } from '@src/modules/guest/guest.entity';
import { Message } from '@src/modules/message/message.entity';
import { Order } from '@src/modules/order/order.entity';
import { IsCollection } from '@src/utils/class-validation';
import { TenantBaseEntity } from '@src/utils/entity';
import { SDKField, SDKObject } from '@src/utils/gql';
import { Type } from 'class-transformer';
import { IsBoolean, IsOptional, ValidateNested } from 'class-validator';

@Entity({ tableName: 'thread' })
@ObjectType()
@SDKObject()
export class Thread extends TenantBaseEntity {
  @Property({ nullable: true })
  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  resolved?: boolean;

  @OneToMany(() => Message, (message) => message.thread)
  @IsCollection(() => Message)
  messages = new Collection<Message>(this);

  @ManyToOne(() => Guest)
  @Index()
  @Type(() => Guest)
  @Field(() => Guest)
  @SDKField(() => Guest, {
    fields: [
      'id',
      'email',
      'firstName',
      'lastName',
      'mobile',
      'mobileCountryCode',
    ],
  })
  guest: Guest;

  @OneToOne({ entity: () => Order, inversedBy: 'thread', nullable: true })
  @Type(() => Order)
  @IsOptional()
  @Field(() => Order, { nullable: true })
  @SDKField(() => Order, {
    fields: [
      'id',
      'id',
      'dateCreated',
      'totalPrice',
      'orderReference',
      'subtotal',
      'discount',
      'discount.value',
      'discount.name',
      'space',
      'space.id',
      'space.name',
      'pricelist',
      'pricelist.id',
      'pricelist.name',
    ],
  })
  order?: Order;

  @Field(() => Message, { nullable: true })
  @Type(() => Message)
  @ValidateNested()
  @IsOptional()
  @SDKField(() => Message, {
    fields: ['id', 'dateCreated', 'text', 'author'],
  })
  lastMessage?: Message;
}
