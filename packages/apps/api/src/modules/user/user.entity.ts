import {
  Cascade,
  Collection,
  Entity,
  Index,
  ManyToMany,
  ManyToOne,
  OneToMany,
  Property,
} from '@mikro-orm/core';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Group } from '@src/modules/group/entities';
import { Hotel } from '@src/modules/hotel/entities';
import { Role } from '@src/modules/role/role.entity';
import { IsCollection, IsURL } from '@src/utils/class-validation';
import { BaseEntity } from '@src/utils/entity';
import { SDKField, SDKObject } from '@src/utils/gql';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEmail,
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

@Entity({ abstract: true })
@ObjectType()
@InputType('UserNotificationsInput')
export class UserNotifications {
  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  orders?: boolean;

  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  bookings?: boolean;

  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  messages?: boolean;
}

@Entity({ abstract: true })
@ObjectType()
export class UserPushSubscriptionDevice {
  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  vendor?: string;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  model?: string;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  type?: string;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  browser?: string;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  os?: string;
}

@Entity({ abstract: true })
@ObjectType()
@InputType('WebPushSubscriptionKeysInput')
export class WebPushSubscriptionKeys {
  @IsString()
  @IsNotEmpty()
  @Field()
  @SDKField()
  p256dh: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  @SDKField()
  auth: string;
}

@Entity({ abstract: true })
@ObjectType()
@InputType('WebPushSubscriptionInput')
export class WebPushSubscription {
  @IsURL()
  @Field()
  @SDKField()
  endpoint: string;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  expirationTime?: number;

  @Type(() => WebPushSubscriptionKeys)
  @ValidateNested()
  @Field()
  @SDKField()
  keys: WebPushSubscriptionKeys;
}

@Entity({ abstract: true })
@ObjectType()
export class UserPushSubscription {
  @IsUUID()
  @Field()
  @SDKField()
  id: string; // UUID generated client-side

  @IsBoolean()
  @Field()
  @SDKField()
  enabled: boolean;

  @Type(() => WebPushSubscription)
  @ValidateNested()
  @Field(() => WebPushSubscription)
  @SDKField()
  pushSubscription: WebPushSubscription; // generated client-side

  @Type(() => UserPushSubscriptionDevice)
  @ValidateNested()
  @Field()
  @SDKField()
  device: UserPushSubscriptionDevice; // discovered from user agent

  @IsBoolean()
  @Field()
  @SDKField()
  sound: boolean;

  @IsDate()
  @Field()
  @SDKField()
  dateUpdated: Date;
}

@Entity({ tableName: 'user' })
@ObjectType()
@SDKObject()
export class User extends BaseEntity {
  @Property()
  @Index()
  @IsEmail()
  @Field()
  @SDKField()
  @Transform(({ value }: { value: string }) => value.toLowerCase().trim())
  email: string;

  @Property({ nullable: true })
  @IsString()
  @IsOptional()
  @Transform(({ value }: { value: string }) => value.trim())
  @Field({ nullable: true })
  @SDKField()
  firstName?: string;

  @Property({ nullable: true })
  @IsString()
  @IsOptional()
  @Transform(({ value }: { value: string }) => value.trim())
  @Field({ nullable: true })
  @SDKField()
  lastName?: string;

  @Property({ nullable: true })
  @Index()
  @IsMobilePhone()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  mobile?: string;

  @Property({ nullable: true })
  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  jobTitle?: string;

  @Property({ nullable: true })
  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  groupAdmin?: boolean;

  @Property({ nullable: true })
  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  hotelManager?: boolean;

  @Property({ nullable: true })
  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  developer?: boolean;

  @Property({ nullable: true })
  @Type(() => UserPushSubscription)
  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  @Field(() => [UserPushSubscription], { nullable: true })
  @SDKField(() => UserPushSubscription)
  pushSubscriptions?: UserPushSubscription[];

  @Property({ nullable: true })
  @IsString()
  @IsOptional()
  verificationToken?: string;

  @Property()
  @IsString()
  password: string;

  @Property({ nullable: true })
  @IsDate()
  @IsOptional()
  verificationTokenExpiry?: Date;

  @Property({ nullable: true })
  @Type(() => UserNotifications)
  @ValidateNested()
  @Field(() => UserNotifications, { nullable: true })
  @SDKField(() => UserNotifications)
  notifications?: UserNotifications;

  @ManyToOne(() => Group)
  @Index()
  @Type(() => Group)
  @Field(() => Group)
  @SDKField(() => Group, {
    fields: ['id', 'name', 'hotelManager'],
  })
  group: Group;

  @ManyToMany(() => Hotel)
  @Index()
  @IsCollection(() => Hotel)
  @Field(() => [Hotel])
  @SDKField(() => Hotel, {
    fields: ['id', 'name'],
  })
  hotels = new Collection<Hotel>(this);

  @OneToMany(() => Role, (role) => role.user, {
    cascade: [Cascade.ALL],
  })
  @IsCollection(() => Role)
  @Field(() => [Role])
  @SDKField(() => Role, {
    fields: ['id', 'role', 'hotel.id'],
  })
  roles = new Collection<Role>(this);

  constructor(
    user?: Partial<
      Pick<
        User,
        | 'id'
        | 'email'
        | 'firstName'
        | 'lastName'
        | 'mobile'
        | 'jobTitle'
        | 'groupAdmin'
        | 'group'
      >
    >
  ) {
    super();
    this.createEntity(user);
  }
}
