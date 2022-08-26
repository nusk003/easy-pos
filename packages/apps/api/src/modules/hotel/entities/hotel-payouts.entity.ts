import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { SDKField } from '@src/utils/gql';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export enum PayoutInterval {
  Daily = 'Daily',
  Weekly = 'Weekly',
  Monthly = 'Monthly',
}
registerEnumType(PayoutInterval, {
  name: 'PayoutInterval',
});

export enum PayoutsStrategy {
  HotelManagerPay = 'HotelManagerPay',
  Stripe = 'Stripe',
  Disabled = 'Disabled',
}
registerEnumType(PayoutsStrategy, {
  name: 'PayoutsStrategy',
});

@ObjectType({ isAbstract: true })
@InputType('StripeAccountInput')
export class StripeAccount {
  @IsString()
  @IsNotEmpty()
  @Field()
  @SDKField()
  accountId: string;

  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  linked?: boolean;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  publicKey?: string;

  @IsString()
  @IsOptional()
  accessToken?: string;

  @IsString()
  @IsOptional()
  refreshToken?: string;

  @IsDate()
  @Field(() => Date)
  @SDKField()
  dateCreated: Date;
}

@ObjectType({ isAbstract: true })
@InputType('HMPayAccountPayoutScheduleInput')
export class HMPayAccountPayoutSchedule {
  @IsEnum(PayoutInterval)
  @Field(() => PayoutInterval)
  @SDKField()
  interval: PayoutInterval;

  @IsString()
  @Field()
  @SDKField()
  date: string;
}

@ObjectType({ isAbstract: true })
@InputType('HMPayAccountInput')
export class HMPayAccount {
  @IsNumberString()
  accountNumber: string;

  @IsNumberString()
  @Field()
  @SDKField()
  accountNumberLast4: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  @SDKField()
  sortCode: string;

  @Type(() => HMPayAccountPayoutSchedule)
  @ValidateNested()
  @IsOptional()
  @Field(() => HMPayAccountPayoutSchedule, { nullable: true })
  @SDKField()
  payoutSchedule?: HMPayAccountPayoutSchedule;

  @IsDate()
  @Field(() => Date)
  @SDKField()
  dateCreated: Date;
}

@ObjectType({ isAbstract: true })
@InputType('HotelPayoutsInput')
export class HotelPayouts {
  @Type(() => StripeAccount)
  @ValidateNested()
  @IsOptional()
  @Field(() => StripeAccount, { nullable: true })
  @SDKField()
  stripe?: StripeAccount;

  @Type(() => HMPayAccount)
  @ValidateNested()
  @IsOptional()
  @Field(() => HMPayAccount, { nullable: true })
  @SDKField()
  hm?: HMPayAccount;

  @IsEnum(PayoutsStrategy)
  @IsOptional()
  @Field(() => PayoutsStrategy, { nullable: true })
  @SDKField()
  enabled?: PayoutsStrategy;
}
