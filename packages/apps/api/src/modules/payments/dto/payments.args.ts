import {
  ArgsType,
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import {
  HMPayAccountPayoutSchedule,
  PayoutInterval,
  PayoutsStrategy,
} from '@src/modules/hotel/entities';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

@ArgsType()
export class CreateGuestPaymentArgs {
  @IsString()
  @IsNotEmpty()
  @Field()
  name: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  token: string;
}

@ArgsType()
export class DeletePaymentMethodArgs {
  @IsString()
  @IsNotEmpty()
  @Field()
  paymentMethodId: string;
}

@ArgsType()
export class CreateHMPayAccountArgs {
  @IsString()
  @IsNotEmpty()
  @Field()
  accountNumber: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  sortCode: string;
}

@ArgsType()
export class UpdateHMPayExternalAccountArgs extends CreateHMPayAccountArgs {
  @Type(() => HMPayAccountPayoutSchedule)
  @ValidateNested()
  @Field(() => HMPayAccountPayoutSchedule)
  payoutSchedule: HMPayAccountPayoutSchedule;
}

@ArgsType()
export class LinkStripeAccountArgs {
  @Field()
  @IsString()
  authCode: string;
}

enum StripeWeeklyPayoutInterval {
  Monday = 'Monday',
  Tuesday = 'Tuesday',
  Wednesday = 'Wednesday',
  Thursday = 'Thursday',
  Friday = 'Friday',
  Saturday = 'Saturday',
  Sunday = 'Sunday',
}
registerEnumType(StripeWeeklyPayoutInterval, {
  name: 'StripeWeeklyPayoutInterval',
});

@InputType('StripeExternalAccountPayoutScheduleInput')
@ObjectType({ isAbstract: true })
export class StripeExternalAccountPayoutSchedule {
  @IsEnum(PayoutInterval)
  @Field(() => PayoutInterval)
  interval: PayoutInterval;

  @IsEnum(StripeWeeklyPayoutInterval)
  @Field(() => StripeWeeklyPayoutInterval, { nullable: true })
  weeklyInterval?: StripeWeeklyPayoutInterval;

  @IsNumber({ maxDecimalPlaces: 0 })
  @Min(0)
  @Max(31)
  @Field({ nullable: true })
  monthlyInterval?: number;
}

@ArgsType()
export class UpdateStripeExternalAccountArgs extends CreateHMPayAccountArgs {
  @Type(() => StripeExternalAccountPayoutSchedule)
  @ValidateNested()
  @Field(() => StripeExternalAccountPayoutSchedule)
  payoutSchedule: StripeExternalAccountPayoutSchedule;
}

@ArgsType()
export class EnablePayoutsArgs {
  @IsEnum(PayoutsStrategy)
  @Field(() => PayoutsStrategy)
  payoutsStrategy: PayoutsStrategy;
}
