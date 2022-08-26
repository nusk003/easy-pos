import { Entity, Index, ManyToOne, Property } from '@mikro-orm/core';
import { BaseEntity } from '@src/utils/entity';
import { Hotel } from '@src/modules/hotel/entities';
import { User } from '@src/modules/user/user.entity';
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export enum UserRole {
  HotelAdmin = 'HotelAdmin',
  HotelMember = 'HotelMember',
  GroupAdmin = 'GroupAdmin', // stored in user entity
  SuperAdmin = 'SuperAdmin', // stored in group entity as `hotelManager`
}
registerEnumType(UserRole, {
  name: 'UserRole',
});

@Entity({ tableName: 'role' })
@ObjectType()
export class Role extends BaseEntity {
  @Property({ type: () => UserRole })
  @IsEnum(UserRole)
  @Field(() => UserRole)
  role: UserRole;

  @ManyToOne(() => User)
  @Index()
  @Type(() => User)
  @Field(() => User)
  user: User;

  @ManyToOne(() => Hotel)
  @Index()
  @Type(() => Hotel)
  @Field(() => Hotel)
  hotel: Hotel;
}
