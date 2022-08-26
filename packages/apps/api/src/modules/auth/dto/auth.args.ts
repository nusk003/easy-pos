import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { Group } from '@src/modules/group/entities';
import { Hotel } from '@src/modules/hotel/entities';
import { UserRole } from '@src/modules/role/role.entity';
import { User } from '@src/modules/user/user.entity';
import { IsURL } from '@src/utils/class-validation';
import { CreateInputType, CreateUpdateInputType } from '@src/utils/dto';
import { Transform, Type } from 'class-transformer';
import {
  Equals,
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsISO31661Alpha2,
  IsMobilePhone,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

@ArgsType()
export class AnonGuestLoginArgs {
  @IsUUID()
  @Field()
  deviceId: string;
}

@ArgsType()
export class GuestLoginArgs {
  @IsUUID()
  @Field()
  deviceId: string;

  @IsEmail()
  @Transform(({ value }: { value: string }) => value.toLowerCase().trim())
  @Field()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  verificationToken: string;
}

@ArgsType()
export class RegisterGuestArgs {
  @IsEmail()
  @Transform(({ value }: { value: string }) => value.toLowerCase().trim())
  @Field()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => value.trim())
  @Field()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => value.trim())
  @Field()
  lastName: string;

  @IsISO31661Alpha2()
  @IsOptional()
  @Field({ nullable: true })
  countryCode?: string;

  @IsMobilePhone()
  @IsOptional()
  @Field({ nullable: true })
  mobile?: string;
}

@ArgsType()
export class SendGuestTokenArgs {
  @IsEmail()
  @Transform(({ value }: { value: string }) => value.toLowerCase().trim())
  @Field()
  email: string;

  @IsUUID()
  @Field()
  deviceId: string;
}

@ArgsType()
export class SendUserTokenArgs {
  @IsEmail()
  @Transform(({ value }: { value: string }) => value.toLowerCase().trim())
  @Field()
  email: string;

  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  verificationTokenOnly?: boolean;
}

@ArgsType()
export class GetUserLoginTokenArgs {
  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  redirectURL?: string;

  @IsMongoId()
  @IsOptional()
  @Field({ nullable: true })
  hotelId?: string;

  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  hideSidebar?: boolean;
}

@ArgsType()
export class UserLoginArgs {
  @IsEmail()
  @Field()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  password: string;
}

@InputType()
export class RegisterGroupAdminUserInput extends CreateInputType(User, [
  'firstName',
  'lastName',
  'email',
  'mobile',
  'jobTitle',
]) {}

@InputType()
export class RegisterGroupAdminHotelInput extends CreateInputType(Hotel, [
  'name',
  'telephone',
  'countryCode',
  'address',
  'website',
]) {}

@InputType()
export class RegisterGroupAdminGroupInput extends CreateUpdateInputType(Group, [
  'name',
]) {}

@ArgsType()
export class RegisterGroupAdminArgs {
  @Type(() => RegisterGroupAdminUserInput)
  @ValidateNested()
  @Field()
  user: RegisterGroupAdminUserInput;

  @Type(() => RegisterGroupAdminHotelInput)
  @ValidateNested()
  @Field()
  hotel: RegisterGroupAdminHotelInput;

  @Type(() => RegisterGroupAdminGroupInput)
  @ValidateNested()
  @IsOptional()
  @Field(() => RegisterGroupAdminGroupInput, { nullable: true })
  group?: RegisterGroupAdminGroupInput;

  @Equals(true)
  @Field()
  termsAndConditions: boolean;
}

@ArgsType()
export class GooglePlacesHotelSearchArgs {
  @IsString()
  @IsNotEmpty()
  @Field()
  query: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  sessionToken: string;
}

@ArgsType()
export class GooglePlacesHotelDetailsArgs {
  @IsString()
  @IsNotEmpty()
  @Field()
  placeId: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  sessionToken: string;
}

@InputType()
export class InviteUserHotelInput {
  @IsMongoId()
  @Field()
  id: string;

  @IsEnum(UserRole)
  @Field()
  role: UserRole;
}

@ArgsType()
export class InviteHotelUserArgs {
  @IsEmail()
  @Transform(({ value }: { value: string }) => value.toLowerCase().trim())
  @Field()
  email: string;

  @Type(() => InviteUserHotelInput)
  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  @Field(() => [InviteUserHotelInput], { nullable: true })
  hotels?: InviteUserHotelInput[];

  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  groupAdmin?: boolean;
}

@InputType()
class WhereUserExistsInput {
  @IsEmail()
  @Field()
  email: string;
}

@ArgsType()
export class UserExistsArgs {
  @Type(() => WhereUserExistsInput)
  @ValidateNested()
  @Field()
  where: WhereUserExistsInput;
}

@ArgsType()
export class RegisterHotelUserArgs {
  @IsMongoId()
  @Field()
  id: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => value.trim())
  @Field()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => value.trim())
  @Field()
  lastName: string;

  @IsMobilePhone()
  @Field()
  mobile: string;

  @Equals(true)
  @Field()
  termsAndConditions: boolean;
}

@ArgsType()
export class ConnectMarketplaceAppArgs {
  @IsMongoId()
  @Field()
  id: string;

  @IsURL()
  @Field()
  redirectURL: string;
}

@ArgsType()
export class DisconnectMarketplaceAppArgs {
  @IsMongoId()
  @IsOptional()
  @Field({ nullable: true })
  id?: string;
}

@ArgsType()
export class GetAccessTokenArgs {
  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  authToken?: string;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  refreshToken?: string;

  @IsMongoId()
  @IsOptional()
  @Field({ nullable: true })
  hotelId?: string;
}
