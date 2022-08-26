import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { Guest } from '@src/modules/guest/guest.entity';
import {
  CreatePaginationArgsType,
  CreateSearchPaginationArgsType,
  CreateUpdateInputType,
  CreateWhereArgsType,
  CreateWhereInputType,
  PaginationSort,
  WhereInputType,
} from '@src/utils/dto';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

const updateArgsFields = <const>[
  'firstName',
  'lastName',
  'mobile',
  'mobileCountryCode',
];

@InputType()
class GuestWhereInput extends CreateWhereInputType() {}

@ArgsType()
export class GetGuestArgs {
  @Type(() => WhereInputType)
  @ValidateNested()
  @IsOptional()
  @Type(() => WhereInputType)
  @Field({ nullable: true })
  where?: WhereInputType;
}

@InputType()
class UpdateGuestInput extends CreateUpdateInputType(Guest, updateArgsFields) {}

@ArgsType()
export class UpdateGuestArgs {
  @Type(() => WhereInputType)
  @ValidateNested()
  @IsOptional()
  @Type(() => GuestWhereInput)
  @Field({ nullable: true })
  where?: GuestWhereInput;

  @Type(() => UpdateGuestInput)
  @ValidateNested()
  @IsOptional()
  @Type(() => UpdateGuestInput)
  @Field()
  data: UpdateGuestInput;
}

@ArgsType()
export class SubscribeGuestPushNotificationsArgs {
  @IsString()
  @IsNotEmpty()
  @Field()
  pushNotificationToken: string;
}

@ArgsType()
export class WhereGuestArgs extends CreateWhereArgsType() {}

@InputType()
export class GuestsSortInput {
  @IsEnum(PaginationSort)
  @Field(() => PaginationSort, { nullable: true })
  id?: PaginationSort;

  @IsEnum(PaginationSort)
  @Field(() => PaginationSort, { nullable: true })
  dateCreated?: PaginationSort;
}

@ArgsType()
export class GuestPaginationArgs extends CreatePaginationArgsType(
  GuestsSortInput
) {}

@ArgsType()
export class GuestPaginationSearchArgs extends CreateSearchPaginationArgsType(
  GuestsSortInput
) {
  @IsBoolean()
  @Field({ defaultValue: true })
  anonGuests: boolean;

  @IsDate()
  @IsOptional()
  @Field({ nullable: true })
  startDate?: Date;

  @IsDate()
  @IsOptional()
  @Field({ nullable: true })
  endDate?: Date;
}
