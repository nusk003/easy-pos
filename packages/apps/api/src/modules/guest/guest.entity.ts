import {
  Cascade,
  Collection,
  Entity,
  Filter,
  Index,
  ManyToMany,
  OneToMany,
  Property,
  Unique,
} from '@mikro-orm/core';
import { Field, ObjectType } from '@nestjs/graphql';
import { ESField, ESIndex } from '@src/libs/elasticsearch';
import { Group } from '@src/modules/group/entities';
import { Hotel } from '@src/modules/hotel/entities';
import { Booking } from '@src/modules/booking/booking.entity';
import { Order } from '@src/modules/order/order.entity';
import { Thread } from '@src/modules/thread/thread.entity';
import { IsCollection } from '@src/utils/class-validation';
import { BaseEntity } from '@src/utils/entity';
import { SDKField, SDKObject } from '@src/utils/gql';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEmail,
  IsISO31661Alpha2,
  IsMobilePhone,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { ObjectId } from 'mongodb';

export class StripeGuestPayments {
  @IsString()
  @IsOptional()
  commonCustomerId?: string;

  @IsString()
  @IsOptional()
  connectCustomerId?: string;
}

export class GuestPayments {
  @Type(() => StripeGuestPayments)
  @ValidateNested()
  @IsOptional()
  stripe?: StripeGuestPayments;
}

@ObjectType()
export class PushNotification {
  @Field(() => String)
  hotel: ObjectId;

  @IsString({ each: true })
  @Field(() => [String])
  tokens: string[];
}

@Entity({ tableName: 'guest' })
@Filter({ name: 'anon', cond: { email: { $exists: false } }, default: false })
@ESIndex()
@ObjectType()
@SDKObject()
export class Guest extends BaseEntity {
  @Property({ nullable: true })
  @Index()
  @IsUUID()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  deviceId?: string;

  @Property({ nullable: true })
  @Unique()
  @ESField()
  @IsEmail()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  @Transform(({ value }: { value: string }) => value.toLowerCase().trim())
  email?: string;

  @Property({ nullable: true })
  @ESField()
  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  @Transform(({ value }: { value: string }) => value.trim())
  firstName?: string;

  @Property({ nullable: true })
  @ESField()
  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  @Transform(({ value }: { value: string }) => value.trim())
  lastName?: string;

  @Property({ type: Date, nullable: true })
  @IsDate()
  @IsOptional()
  @Field({ nullable: true })
  dateLastSeen?: Date;

  @Property({ nullable: true })
  @IsMobilePhone()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  mobile?: string;

  @Property({ nullable: true })
  @IsISO31661Alpha2()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  mobileCountryCode?: string;

  @Property({ nullable: true })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { nullable: true })
  @SDKField()
  dateOfBirth?: Date;

  @Property({ nullable: true })
  @IsISO31661Alpha2()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  countryOfResidence?: string;

  @Property({ nullable: true })
  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  address?: string;

  @Property({ nullable: true })
  @IsISO31661Alpha2()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  nationality?: string;

  @Property({ nullable: true })
  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  passportNumber?: string;

  @Property({ nullable: true })
  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  dietaryRequirements?: string;

  @Property({ nullable: true })
  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  company?: string;

  @Property({ nullable: true })
  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  job?: string;

  @Property({ nullable: true })
  @Index()
  @ESField()
  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  pmsId?: string;

  @Property({ nullable: true })
  @IsString()
  @IsOptional()
  @Field({ nullable: true, deprecationReason: '' })
  pushNotificationToken?: string;

  @Property({ nullable: true })
  @Type(() => PushNotification)
  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  @Field(() => [PushNotification])
  pushNotifications?: Array<PushNotification>;

  @Property({ nullable: true })
  @IsString()
  @IsOptional()
  verificationToken?: string;

  @Property({ nullable: true })
  @IsDate()
  @IsOptional()
  verificationTokenExpiry?: Date;

  @Property({ nullable: true })
  @Type(() => GuestPayments)
  @ValidateNested()
  @IsOptional()
  payments?: GuestPayments;

  @OneToMany(() => Booking, (booking) => booking.guest, {
    cascade: [Cascade.ALL],
  })
  @IsCollection(() => Booking)
  @ESField(() => Booking, {
    fields: ['id', 'roomNumber', 'checkInDate', 'checkOutDate'],
  })
  @Field(() => [Booking], { nullable: true })
  @SDKField(() => Booking)
  bookings = new Collection<Booking>(this);

  @OneToMany(() => Thread, (thread) => thread.guest)
  @IsCollection(() => Thread)
  @Field(() => [Thread])
  @SDKField(() => Thread, { fields: ['id'] })
  threads = new Collection<Thread>(this);

  @OneToMany(() => Order, (order) => order.guest)
  @IsCollection(() => Order)
  @Field(() => [Order])
  @SDKField(() => Order, { fields: ['id'] })
  orders = new Collection<Order>(this);

  @ManyToMany(() => Hotel)
  @Index()
  @ESField(() => Hotel, { mappedBy: (hotel) => hotel.id, isCollection: true })
  @IsCollection(() => Hotel)
  @Field(() => Hotel)
  hotels = new Collection<Hotel>(this);

  @ManyToMany(() => Group)
  @ESField(() => Group, { mappedBy: (group) => group.id, isCollection: true })
  @IsCollection(() => Group)
  @Field(() => [Group])
  groups = new Collection<Group>(this);
}
