import { ArgsType, Field, InputType } from '@nestjs/graphql';
import {
  CreateArgsType,
  CreatePaginationArgsType,
  CreateSearchPaginationArgsType,
  CreateUpdateInputType,
  CreateWhereArgsType,
  PaginationSort,
} from '@src/utils/dto';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Booking, BookingStatus } from '@src/modules/booking/booking.entity';

const createArgFields = <const>[
  'bookingReference',
  'checkInDate',
  'checkOutDate',
  'numberOfAdults',
  'numberOfChildren',
  'clubMemberNumber',
  'estimatedTimeOfArrival',
  'bookingDetails',
  'party',
  'carRegistration',
  'roomNumber',
  'roomType',
  'dateCheckedIn',
  'dateReviewed',
  'dateSubmitted',
];

const updateArgFields = <const>[
  'bookingReference',
  'checkInDate',
  'checkOutDate',
  'numberOfAdults',
  'numberOfChildren',
  'clubMemberNumber',
  'estimatedTimeOfArrival',
  'bookingDetails',
  'party',
  'carRegistration',
  'roomNumber',
  'roomType',
  'pmsId',
  'status',
  'purposeOfStay',
];

@ArgsType()
export class CreateBookingArgs extends CreateArgsType(
  Booking,
  createArgFields
) {
  @IsMongoId()
  @IsOptional()
  @Field({ nullable: true })
  guestId?: string;
}

@InputType()
export class UpdateBookingInput extends CreateUpdateInputType(
  Booking,
  updateArgFields
) {}

@ArgsType()
export class WhereBookingArgs extends CreateWhereArgsType() {}

@ArgsType()
export class FindBookingArgs {
  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  bookingReference?: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  lastName: string;

  @IsDate()
  @IsOptional()
  @Field()
  checkInDate: Date;

  @IsDate()
  @IsOptional()
  @Field()
  checkOutDate: Date;
}

@InputType()
class BookingWhereInput {
  @IsMongoId()
  @Field()
  id: string;
}

@ArgsType()
export class UpdateBookingArgs {
  @Type(() => UpdateBookingInput)
  @ValidateNested()
  @Field()
  data: UpdateBookingInput;

  @Type(() => BookingWhereInput)
  @ValidateNested()
  @Field()
  where: BookingWhereInput;
}

@ArgsType()
export class PlaceInputArgs {
  @IsString()
  @IsNotEmpty()
  @Field()
  placeId: string;
}

@ArgsType()
export class SearchInputArgs {
  @IsString()
  @IsNotEmpty()
  @Field()
  query: string;
}

@ArgsType()
export class BookingAnalyticsArgs {
  @IsDate()
  @IsOptional()
  @Field({ nullable: true })
  startDate?: Date;

  @IsDate()
  @IsOptional()
  @Field({ nullable: true })
  endDate?: Date;
}

@InputType()
export class BookingSortInput {
  @IsEnum(PaginationSort)
  @IsOptional()
  @Field(() => PaginationSort, { nullable: true })
  id?: PaginationSort;

  @IsEnum(PaginationSort)
  @IsOptional()
  @Field(() => PaginationSort, { nullable: true })
  dateCreated?: PaginationSort;
}

@ArgsType()
export class BookingPaginationArgs extends CreatePaginationArgsType(
  BookingSortInput
) {
  @IsMongoId()
  @IsOptional()
  @Field({ nullable: true })
  guestId?: string;
}

@ArgsType()
export class BookingPaginationSearchArgs extends CreateSearchPaginationArgsType(
  BookingSortInput
) {
  @IsEnum(BookingStatus)
  @IsOptional()
  @Field({ nullable: true })
  status?: BookingStatus;

  @IsDate()
  @IsOptional()
  @Field({ nullable: true })
  startCheckInDate?: Date;

  @IsDate()
  @IsOptional()
  @Field({ nullable: true })
  startCheckOutDate?: Date;

  @IsDate()
  @IsOptional()
  @Field({ nullable: true })
  endCheckInDate?: Date;

  @IsDate()
  @IsOptional()
  @Field({ nullable: true })
  endCheckOutDate?: Date;

  @IsDate()
  @IsOptional()
  @Field({ nullable: true })
  startDate?: Date;

  @IsDate()
  @IsOptional()
  @Field({ nullable: true })
  endDate?: Date;
}
