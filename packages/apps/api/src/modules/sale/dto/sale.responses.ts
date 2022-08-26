import { Field, ObjectType } from '@nestjs/graphql';
import { Guest } from '@src/modules/guest/guest.entity';
import { Order, PaymentType } from '@src/modules/order/order.entity';
import { SDKField, SDKObject } from '@src/utils/gql';
import { PaymentIntentStatus } from '@src/modules/payments/dto/payments.responses';
import { Sale } from '../sale.entity';

@ObjectType({ isAbstract: true })
@SDKObject({ abstract: true })
export class OrderPaymentIntent {
  @Field(() => PaymentIntentStatus)
  @SDKField()
  status: PaymentIntentStatus;

  @Field({ nullable: true })
  @SDKField()
  clientSecret?: string;
}

@ObjectType()
@SDKObject()
export class CreateSaleResponse {
  @Field({ nullable: true })
  @SDKField()
  sale?: Sale;
}

@ObjectType()
@SDKObject()
export class SearchSalesResponse {
  @Field(() => [Sale])
  @SDKField(() => Sale, {
    extend: ['customer.nic', 'customer.phone'],
  })
  data: Sale[];

  @Field()
  @SDKField()
  count: number;
}
