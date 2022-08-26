import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import {
  HMPayAccount,
  HMPayAccountPayoutSchedule,
} from '@src/modules/hotel/entities';
import { GuestPaymentMethod } from '@src/modules/payments/payments.service';
import { SDKField, SDKObject } from '@src/utils/gql';
import { Type } from 'class-transformer';
import { IsNumberString, IsString, IsDate } from 'class-validator';

export enum PaymentIntentStatus {
  RequiresPaymentMethod = 'requires_payment_method',
  RequiresConfirmation = 'requires_confirmation',
  RequiresAction = 'requires_action',
  Processing = 'processing',
  RequiresCapture = 'requires_capture',
  Canceled = 'canceled',
  Succeeded = 'succeeded',
}

registerEnumType(PaymentIntentStatus, { name: 'PaymentIntentStatus' });

@ObjectType()
@SDKObject()
export class GuestPaymentMethodsResponse implements GuestPaymentMethod {
  @Field()
  @SDKField()
  id: string;

  @Field()
  @SDKField()
  brand: string;

  @Field({ nullable: true })
  @SDKField()
  country?: string;

  @Field()
  @SDKField()
  last4: string;
}

@ObjectType()
@SDKObject()
export class PayoutValueResponse {
  @Field()
  @SDKField()
  totalPrice: number;

  @Field({ nullable: true })
  @SDKField()
  arrivalDate?: Date;
}

@ObjectType()
@SDKObject({ abstract: true })
class PaymentAccount implements Partial<HMPayAccount> {
  @IsNumberString()
  @Field({ nullable: true })
  @SDKField()
  accountNumberLast4?: string;

  @IsString()
  @Field({ nullable: true })
  @SDKField()
  sortCode?: string;

  @Type(() => HMPayAccountPayoutSchedule)
  @Field(() => HMPayAccountPayoutSchedule, { nullable: true })
  @SDKField()
  payoutSchedule?: HMPayAccountPayoutSchedule;

  @IsDate()
  @Field(() => Date)
  @SDKField()
  dateCreated: Date;

  accountNumber: never;
}

@ObjectType()
@SDKObject()
export class HMPayAccountResponse extends PaymentAccount {
  @IsNumberString()
  @Field()
  @SDKField()
  accountNumberLast4: string;

  @IsString()
  @Field()
  @SDKField()
  sortCode: string;
}

@ObjectType()
@SDKObject()
export class StripeAccountResponse extends PaymentAccount {
  @Field()
  @SDKField()
  payoutsEnabled: boolean;

  @Field()
  @SDKField()
  paymentsEnabled: boolean;

  @Field({ nullable: true })
  @SDKField()
  accountLink?: string;
}

@ObjectType()
@SDKObject()
export class CreateStripeAccountResponse {
  @Field()
  @SDKField()
  accountLink: string;
}
