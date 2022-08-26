import { Entity, Index, ManyToOne, Property } from '@mikro-orm/core';
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Guest } from '@src/modules/guest/guest.entity';
import { Thread } from '@src/modules/thread/thread.entity';
import { User } from '@src/modules/user/user.entity';
import { TenantBaseEntity } from '@src/utils/entity';
import { SDKField, SDKObject } from '@src/utils/gql';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';

export enum MessageAuthor {
  Guest = 'Guest',
  User = 'User',
}
registerEnumType(MessageAuthor, {
  name: 'MessageAuthor',
});

@Entity({ tableName: 'message' })
@ObjectType()
@SDKObject()
export class Message extends TenantBaseEntity {
  @Property()
  @IsString()
  @Field()
  @SDKField()
  text: string;

  @Property({ type: () => MessageAuthor })
  @IsEnum(MessageAuthor)
  @Field(() => MessageAuthor)
  @SDKField()
  author: MessageAuthor;

  @Property({ nullable: true })
  @IsBoolean()
  @IsOptional()
  reminderEmailSent?: boolean;

  @ManyToOne(() => Guest)
  @Index()
  @Field(() => Guest)
  guest: Guest;

  @ManyToOne(() => User, { nullable: true })
  @Index()
  @Field(() => User)
  user?: User;

  @ManyToOne(() => Thread)
  @Index({ properties: ['hotel', 'thread'] })
  @Field(() => Thread)
  @SDKField(() => Thread, {
    fields: [
      'id',
      'dateCreated',
      'dateUpdated',
      'resolved',
      'guest.id',
      'guest.email',
      'guest.firstName',
      'guest.lastName',
    ],
  })
  thread: Thread;
}
