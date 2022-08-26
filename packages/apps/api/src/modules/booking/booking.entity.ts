import { Entity, Index, ManyToOne, Property } from '@mikro-orm/core';
import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { ESField, ESIndex, ShardingStrategy } from '@src/libs/elasticsearch';
import { Guest } from '@src/modules/guest/guest.entity';
import { CustomField } from '@src/modules/hotel/entities';
import { TenantBaseEntity } from '@src/utils/entity';
import { SDKField, SDKObject } from '@src/utils/gql';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsISO31661Alpha2,
  IsMobilePhone,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Min,
  ValidateNested,
} from 'class-validator';

export enum AgeGroup {
  Adult = 'Adult',
  Child = 'Child',
}
registerEnumType(AgeGroup, { name: 'AgeGroup' });

@ObjectType()
@InputType('BookingToggleQuestionInput')
@SDKObject()
export class BookingToggleQuestion extends CustomField {
  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  result?: string;

  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  toggle?: boolean;
}

@ObjectType()
@InputType('BookingDetailsInput')
export class BookingDetails {
  @Type(() => BookingToggleQuestion)
  @IsArray()
  @ValidateNested({ each: true })
  @Field(() => [BookingToggleQuestion])
  @SDKField(() => BookingToggleQuestion)
  toggleQuestion: BookingToggleQuestion[];
}

@ObjectType()
@InputType('BookingPartyInput')
export class BookingParty {
  @IsUUID()
  @Field()
  @SDKField()
  id: string;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  firstName?: string;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  lastName?: string;

  @IsEnum(AgeGroup)
  @Field(() => AgeGroup)
  @SDKField()
  ageGroup: AgeGroup;

  @IsEmail()
  @IsOptional()
  @Field({ nullable: true })
  @Transform(({ value }: { value: string }) => value?.toLowerCase().trim())
  @SDKField()
  email?: string;

  @IsMobilePhone()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  mobile?: string;

  @IsISO31661Alpha2()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  mobileCountryCode?: string;

  @IsISO31661Alpha2()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  countryOfResidence?: string;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  address?: string;

  @IsISO31661Alpha2()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  nationality?: string;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  passportNumber?: string;

  @IsISO31661Alpha2()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  nextDestination?: string;

  @IsDate()
  @IsOptional()
  @Field(() => Date, { nullable: true })
  @SDKField()
  dateOfBirth?: Date;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  dietaryRequirements?: string;

  @IsString()
  @IsOptional()
  @Field({
    nullable: true,
    deprecationReason: 'This field has been moved to booking level',
  })
  @SDKField()
  purposeOfStay?: string;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  specialOccasions?: string;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  job?: string;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  company?: string;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  pmsId?: string;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  carRegistration?: string;
}

export enum BookingStatus {
  Created = 'Created',
  Submitted = 'Submitted',
  Reviewed = 'Reviewed',
  CheckedIn = 'CheckedIn',
  Canceled = 'Canceled',
}
registerEnumType(BookingStatus, { name: 'BookingStatus' });

@Entity({ tableName: 'booking' })
@ESIndex({ shardingStrategy: ShardingStrategy.Group })
@ObjectType()
@SDKObject()
export class Booking extends TenantBaseEntity {
  @Property({ nullable: true })
  @ESField()
  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  roomNumber?: string;

  @Property({ nullable: true })
  @ESField()
  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  bookingReference?: string;

  @Property({ nullable: true })
  @Index()
  @ESField()
  @IsDate()
  @IsOptional()
  @Field(() => Date, { nullable: true })
  @SDKField()
  checkInDate?: Date;

  @Property()
  @Index()
  @ESField()
  @IsDate()
  @IsOptional()
  @Field(() => Date, { nullable: true })
  @SDKField()
  checkOutDate?: Date;

  @Property({ nullable: true })
  @ESField()
  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  carRegistration?: string;

  @Property({ nullable: true })
  @ESField()
  @Type(() => BookingParty)
  @IsArray()
  @ValidateNested()
  @IsOptional()
  @Field(() => [BookingParty], { nullable: true })
  @SDKField(() => BookingParty)
  party?: BookingParty[];

  @Property({ nullable: true })
  @ESField()
  @IsOptional()
  @Type(() => BookingDetails)
  @ValidateNested()
  @IsOptional()
  @Field(() => BookingDetails, { nullable: true })
  @SDKField()
  bookingDetails?: BookingDetails;

  @Property({ nullable: true })
  @ESField()
  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  roomType?: string;

  @Property({ nullable: true })
  @ESField()
  @Matches(/^[0-2][0-9]:[0-5][0-9]$/, {
    message: 'Time must be in the format HH:MM',
  })
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  estimatedTimeOfArrival?: string;

  @Property({ nullable: true })
  @ESField()
  @IsNumber({ maxDecimalPlaces: 0 })
  @Min(0)
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  numberOfAdults?: number;

  @Property({ nullable: true })
  @ESField()
  @IsNumber({ maxDecimalPlaces: 0 })
  @Min(0)
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  numberOfChildren?: number;

  @Property({ nullable: true })
  @ESField()
  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  clubMemberNumber?: string;

  @Property({ nullable: true })
  @ESField()
  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  purposeOfStay?: string;

  @Property({ nullable: true })
  @ESField()
  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  pmsId: string;

  @Property({ nullable: true })
  @ESField(() => Date)
  @IsDate()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  dateReviewed?: Date;

  @Property({ nullable: true })
  @ESField(() => Date)
  @IsDate()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  dateSubmitted?: Date;

  @Property({ nullable: true })
  @ESField(() => Date)
  @IsDate()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  dateCheckedIn?: Date;

  @Property({ nullable: true })
  @ESField(() => Date)
  @IsDate()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  dateCheckedOut?: Date;

  @Property({ nullable: true })
  @ESField(() => Date)
  @IsDate()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  dateCanceled?: Date;

  @ManyToOne(() => Guest, { nullable: true })
  @ESField(() => Guest, {
    fields: [
      'id',
      'firstName',
      'lastName',
      'mobile',
      'email',
      'mobileCountryCode',
    ],
  })
  @Type(() => Guest)
  @Field(() => Guest, { nullable: true })
  @SDKField(() => Guest, {
    fields: [
      'id',
      'firstName',
      'lastName',
      'mobile',
      'email',
      'mobileCountryCode',
    ],
  })
  guest?: Guest;

  @Property({ nullable: true })
  reminderEmailSent?: boolean;

  @ESField(() => BookingStatus, {
    getter: (booking: Booking) => {
      if (booking.dateCanceled) {
        return BookingStatus.Canceled;
      }
      if (booking.dateCheckedIn) {
        return BookingStatus.CheckedIn;
      }
      if (booking.dateReviewed) {
        return BookingStatus.Reviewed;
      }
      if (booking.dateSubmitted) {
        return BookingStatus.Submitted;
      }

      return BookingStatus.Created;
    },
  })
  @Field(() => BookingStatus)
  @SDKField()
  get status(): BookingStatus {
    if (this.dateCanceled) {
      return BookingStatus.Canceled;
    }
    if (this.dateCheckedIn) {
      return BookingStatus.CheckedIn;
    }
    if (this.dateReviewed) {
      return BookingStatus.Reviewed;
    }
    if (this.dateSubmitted) {
      return BookingStatus.Submitted;
    }

    return BookingStatus.Created;
  }

  constructor(booking?: Booking) {
    super();
    this.createEntity(booking);
  }
}
