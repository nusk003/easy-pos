import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { InviteUserHotelInput } from '@src/modules/auth/dto/auth.args';
import { User, WebPushSubscription } from '@src/modules/user/user.entity';
import {
  CreateUpdateInputType,
  CreateWhereArgsType,
  CreateWhereInputType,
  WhereInputType,
} from '@src/utils/dto';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsUUID,
  ValidateNested,
} from 'class-validator';

const updateArgsFields = <const>[
  'firstName',
  'lastName',
  'mobile',
  'jobTitle',
  'notifications',
];

@InputType()
class UserWhereInput extends CreateWhereInputType() {}

@ArgsType()
export class UserArgs {
  @Type(() => WhereInputType)
  @ValidateNested()
  @IsOptional()
  @Field({ nullable: true })
  where?: WhereInputType;
}

@InputType()
class UpdateUserInput extends CreateUpdateInputType(User, updateArgsFields) {
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

@ArgsType()
export class UpdateUserArgs {
  @Type(() => UserWhereInput)
  @ValidateNested()
  @Field({ nullable: true })
  where?: UserWhereInput;

  @Type(() => UpdateUserInput)
  @ValidateNested()
  @Field()
  data: UpdateUserInput;
}

@ArgsType()
export class SubscribeUserPushNotificationsArgs {
  @IsUUID()
  @Field()
  deviceId: string;

  @Type(() => WebPushSubscription)
  @ValidateNested()
  @Field()
  pushSubscription: WebPushSubscription;

  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  sound?: boolean; // if undefined use previous value
}

@ArgsType()
export class UnsubscribeUserPushNotificationsArgs {
  @IsUUID()
  @Field()
  deviceId: string;
}

@ArgsType()
export class WhereUserArgs extends CreateWhereArgsType() {}
