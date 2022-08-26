import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { IsURL } from '@src/utils/class-validation';
import { SDKField, SDKObject } from '@src/utils/gql';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Min,
  ValidateNested,
} from 'class-validator';

@ObjectType({ isAbstract: true })
@InputType('BookingGuestFieldsInput')
@SDKObject({ abstract: true })
export class BookingGuestFields {
  @IsBoolean()
  @Field()
  @SDKField()
  name: boolean;

  @IsBoolean()
  @Field()
  @SDKField()
  countryOfResidence: boolean;

  @IsBoolean()
  @Field()
  @SDKField()
  address: boolean;

  @IsBoolean()
  @Field()
  @SDKField()
  nationality: boolean;

  @IsBoolean()
  @Field()
  @SDKField()
  passportNumber: boolean;

  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  foreignNationalPassportNumber?: boolean;

  @IsBoolean()
  @Field()
  @SDKField()
  mobile: boolean;

  @IsBoolean()
  @Field()
  @SDKField()
  email: boolean;

  @IsBoolean()
  @Field()
  @SDKField()
  dateOfBirth: boolean;

  @IsBoolean()
  @Field()
  @SDKField()
  dietaryRequirements: boolean;
}

@ObjectType({ isAbstract: true })
@InputType('BookingChildFieldsInput')
@SDKObject({ abstract: true })
export class BookingChildFields extends BookingGuestFields {}

@ObjectType({ isAbstract: true })
@InputType('BookingAdultFieldsInput')
@SDKObject({ abstract: true })
export class BookingAdultFields extends BookingGuestFields {
  @IsBoolean()
  @Field()
  @SDKField()
  nextDestination: boolean;

  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  foreignNationalNextDestination?: boolean;

  @IsBoolean()
  @Field()
  @SDKField()
  job: boolean;

  @IsBoolean()
  @Field()
  @SDKField()
  company: boolean;
}

@ObjectType({ isAbstract: true })
@InputType('BookingPartyFieldsInput')
export class BookingPartyFields {
  @Type(() => BookingAdultFields)
  @ValidateNested()
  @IsOptional()
  @Field(() => BookingAdultFields, { nullable: true })
  @SDKField()
  adult?: BookingAdultFields;

  @Type(() => BookingChildFields)
  @ValidateNested()
  @IsOptional()
  @Field(() => BookingChildFields, { nullable: true })
  @SDKField()
  child?: BookingChildFields;
}

export enum CustomFieldType {
  String = 'String',
  Boolean = 'Boolean',
}

registerEnumType(CustomFieldType, {
  name: 'CustomFieldType',
});

@ObjectType({ isAbstract: true })
@InputType('CustomFieldInput', { isAbstract: true })
@SDKObject({ abstract: true })
export class CustomField {
  @IsString()
  @IsNotEmpty()
  @Field()
  @SDKField()
  title: string;

  @IsEnum(CustomFieldType)
  @Field(() => CustomFieldType)
  @SDKField()
  type: CustomFieldType;
}

@ObjectType({ isAbstract: true })
@InputType('BookingFieldsInput')
export class BookingFields {
  @IsBoolean()
  @Field()
  @SDKField()
  bookingReference: boolean;

  @IsBoolean()
  @Field()
  @SDKField()
  name: boolean;

  @IsBoolean()
  @Field()
  @SDKField()
  datesOfStay: boolean;

  @IsBoolean()
  @Field()
  @SDKField()
  estimatedTimeOfArrival: boolean;

  @IsBoolean()
  @Field()
  @SDKField()
  numberOfAdults: boolean;

  @IsBoolean()
  @Field()
  @SDKField()
  numberOfChildren: boolean;

  @IsBoolean()
  @Field()
  @SDKField()
  clubMemberNumber: boolean;

  @IsBoolean()
  @Field()
  @SDKField()
  countryOfResidence: boolean;

  @IsBoolean()
  @Field()
  @SDKField()
  address: boolean;

  @IsBoolean()
  @Field()
  @SDKField()
  nationality: boolean;

  @Type(() => CustomField)
  @ValidateNested()
  @IsOptional()
  @Field(() => [CustomField], { nullable: true })
  @SDKField(() => CustomField)
  customFields?: Array<CustomField>;

  @IsBoolean()
  @Field()
  @SDKField()
  dateOfBirth: boolean;

  @IsBoolean()
  @Field()
  @SDKField()
  dietaryRequirements: boolean;

  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  purposeOfStay?: boolean;

  @IsBoolean()
  @IsOptional()
  @Field()
  @SDKField()
  specialOccasions: boolean;

  @IsBoolean()
  @Field()
  @SDKField()
  job: boolean;

  @IsBoolean()
  @Field()
  @SDKField()
  company: boolean;

  @IsBoolean()
  @Field()
  @SDKField()
  passportScan: boolean;

  @IsBoolean()
  @Field()
  @SDKField()
  passportNumber: boolean;

  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  foreignNationalPassportNumber?: boolean;

  @Type(() => BookingPartyFields)
  @ValidateNested()
  @IsOptional()
  @Field(() => BookingPartyFields, { nullable: true })
  @SDKField()
  party?: BookingPartyFields;
}

@ObjectType({ isAbstract: true })
@InputType('BookingContactMethodsInput')
export class BookingContactMethods {
  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  appMessaging?: boolean;

  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  phoneNumber?: boolean;

  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  email?: boolean;
}

export enum ReminderDurationType {
  Minutes = 'minutes',
  Hours = 'hours',
  Days = 'days',
}
registerEnumType(ReminderDurationType, { name: 'ReminderDurationType' });

@ObjectType({ isAbstract: true })
@InputType('BookingReminderInput')
export class BookingReminder {
  @IsNumber({ maxDecimalPlaces: 0 })
  @Min(0)
  @Field()
  @SDKField()
  value: number;

  @IsEnum(ReminderDurationType)
  @Field(() => ReminderDurationType)
  @SDKField()
  duration: ReminderDurationType;
}

@ObjectType({ isAbstract: true })
@InputType('BookingNotificationsInput')
export class BookingNotifications {
  @IsBoolean()
  @IsOptional()
  @Field({
    nullable: true,
    deprecationReason: '',
  })
  @SDKField()
  app?: boolean;

  @IsBoolean()
  @IsOptional()
  @Field({
    nullable: true,
    deprecationReason: '',
  })
  @SDKField()
  email?: boolean;

  @Type(() => BookingReminder)
  @ValidateNested()
  @IsOptional()
  @Field(() => [BookingReminder], { nullable: true })
  @SDKField(() => BookingReminder)
  reminders?: BookingReminder[];
}

@ObjectType({ isAbstract: true })
@InputType('BookingTermInput')
export class BookingTerm {
  @IsString()
  @Field()
  @SDKField()
  message: string;

  @IsURL()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  link?: string;
}

@ObjectType({ isAbstract: true })
@InputType('BookingPreArrivalInput')
export class BookingPreArrival {
  @Type(() => BookingNotifications)
  @ValidateNested()
  @Field(() => BookingNotifications)
  @SDKField()
  notifications: BookingNotifications;

  @IsNumber({ maxDecimalPlaces: 0 })
  @Min(0)
  @Field()
  @SDKField()
  minHoursBeforeCheckIn: number;

  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  email?: boolean;

  @Field(() => BookingFields)
  @Type(() => BookingFields)
  @ValidateNested()
  @Field(() => BookingFields)
  @SDKField()
  fields: BookingFields;

  @Type(() => BookingTerm)
  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  @Field(() => [BookingTerm], { nullable: true })
  @SDKField(() => BookingTerm)
  terms?: BookingTerm[];
}

@ObjectType({ isAbstract: true })
@InputType('BookingEntryMethodsInput')
export class BookingEntryMethods {
  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  frontDesk?: boolean;

  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  appKey?: boolean;
}

export enum BookingInstructionsDisplayType {
  Numbered = 'numbered',
  Bulleted = 'bulleted',
}
registerEnumType(BookingInstructionsDisplayType, {
  name: 'BookingInstructionsDisplayType',
});

@ObjectType({ isAbstract: true })
@InputType('BookingInstructionsInput')
export class BookingInstructions {
  @IsEnum(BookingInstructionsDisplayType)
  @Field(() => BookingInstructionsDisplayType)
  @SDKField()
  display: BookingInstructionsDisplayType;

  @IsString({ each: true })
  @IsOptional()
  @Field(() => [String], { nullable: true })
  @SDKField(() => String)
  steps?: Array<string>;
}

@ObjectType({ isAbstract: true })
@InputType('BookingArrivalInput')
export class BookingArrival {
  @Type(() => BookingEntryMethods)
  @ValidateNested()
  @Field(() => BookingEntryMethods)
  @SDKField()
  entryMethods: BookingEntryMethods;

  @Type(() => BookingInstructions)
  @ValidateNested()
  @IsOptional()
  @Field(() => BookingInstructions, { nullable: true })
  @SDKField()
  instructions?: BookingInstructions;
}

@ObjectType({ isAbstract: true })
@InputType('BookingDepartureInput')
export class BookingDeparture {
  @Type(() => BookingNotifications)
  @ValidateNested()
  @Field(() => BookingNotifications)
  @SDKField()
  notifications: BookingNotifications;
}
@ObjectType({ isAbstract: true })
@InputType('BookingCustomizationFieldsInput')
export class BookingCustomizationFields {
  @IsString()
  @IsNotEmpty()
  @Field()
  @SDKField()
  title: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  @SDKField()
  message: string;
}

@ObjectType({ isAbstract: true })
@InputType('BookingCustomizationInput')
export class BookingCustomization {
  @Type(() => BookingCustomizationFields)
  @ValidateNested()
  @Field(() => BookingCustomizationFields)
  @SDKField()
  checkInStart: BookingCustomizationFields;

  @Type(() => BookingCustomizationFields)
  @ValidateNested()
  @Field(() => BookingCustomizationFields)
  @SDKField()
  checkInReview: BookingCustomizationFields;

  @Type(() => BookingCustomizationFields)
  @ValidateNested()
  @Field(() => BookingCustomizationFields)
  @SDKField()
  checkInSuccess: BookingCustomizationFields;

  @Type(() => BookingCustomizationFields)
  @ValidateNested()
  @Field(() => BookingCustomizationFields)
  @SDKField()
  checkInUnsuccessful: BookingCustomizationFields;
}

@ObjectType({ isAbstract: true })
@InputType('BookingsSettingsInput')
@SDKObject()
export class BookingsSettings {
  @IsBoolean()
  @Field()
  @SDKField()
  enabled: boolean;

  @Field()
  @Matches(/^[0-2][0-9]:[0-5][0-9]$/, {
    message: 'Time must be in the format HH:MM',
  })
  @Field()
  @SDKField()
  checkInTime: string;

  @Matches(/^[0-2][0-9]:[0-5][0-9]$/, {
    message: 'Time must be in the format HH:MM',
  })
  @Field()
  @SDKField()
  checkOutTime: string;

  @Type(() => BookingContactMethods)
  @ValidateNested()
  @Field(() => BookingContactMethods)
  @SDKField()
  contactMethods: BookingContactMethods;

  @IsNumber({ maxDecimalPlaces: 0 })
  @Min(-1)
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  maxNumberOfRooms?: number; // -1 indicates no max

  @IsNumber({ maxDecimalPlaces: 0 })
  @Min(-1)
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  maxPartySize?: number; // -1 indicates no max

  @Field(() => BookingPreArrival)
  @Type(() => BookingPreArrival)
  @SDKField()
  preArrival: BookingPreArrival;

  @Type(() => BookingArrival)
  @ValidateNested()
  @Field(() => BookingArrival)
  @SDKField()
  arrival: BookingArrival;

  @Type(() => BookingDeparture)
  @ValidateNested()
  @Field(() => BookingDeparture)
  @SDKField()
  departure: BookingDeparture;

  @Type(() => BookingCustomization)
  @ValidateNested()
  @Field(() => BookingCustomization)
  @SDKField()
  customization: BookingCustomization;
}
