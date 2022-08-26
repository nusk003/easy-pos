import { Field, ObjectType } from '@nestjs/graphql';
import { Guest } from '@src/modules/guest/guest.entity';
import { Order, PaymentType } from '@src/modules/order/order.entity';
import { SDKField, SDKObject } from '@src/utils/gql';
import { PaymentIntentStatus } from '@src/modules/payments/dto/payments.responses';

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
export class CreateOrderResponse {
  @Field({ nullable: true })
  @SDKField()
  order?: Order;

  @Field({ nullable: true })
  @SDKField()
  paymentIntent?: OrderPaymentIntent;
}

@ObjectType()
@SDKObject()
export class SearchOrdersResponse {
  @Field(() => [Order])
  @SDKField(() => Order, {
    extend: [
      'space.name',
      'pricelist.name',
      'guest.mobileCountryCode',
      'guest.mobile',
    ],
  })
  data: Order[];

  @Field()
  @SDKField()
  count: number;
}

@ObjectType()
@SDKObject()
export class SearchOutstandingOrdersResponse extends SearchOrdersResponse {
  @Field(() => [Order])
  @SDKField(() => Order, {
    omit: ['guest.firstName', 'guest.lastName', 'thread'],
  })
  data: Order[];
}

@ObjectType()
export class OutstandingGuest {
  @Field()
  @SDKField()
  noOrders: number;

  @Field()
  @SDKField()
  totalPrice: number;

  @Field(() => Guest)
  @SDKField(() => Guest, { fields: ['id', 'firstName', 'lastName'] })
  guest: Guest;
}

@ObjectType()
export class OutstandingGuestsResponse {
  @Field(() => [OutstandingGuest])
  @SDKField(() => OutstandingGuest)
  data: Array<OutstandingGuest>;

  @Field()
  @SDKField()
  count: number;
}

@ObjectType()
export class OutstandingOrdersStatistics {
  @Field(() => PaymentType)
  @SDKField()
  paymentType: PaymentType;

  @Field()
  @SDKField()
  noOrders: number;

  @Field()
  @SDKField()
  totalPrice: number;

  @Field()
  @SDKField()
  noGuests: number;
}

@ObjectType()
export class OutstandingOrdersStatisticsResponse {
  @Field(() => OutstandingOrdersStatistics)
  @SDKField()
  cash: OutstandingOrdersStatistics;

  @Field(() => OutstandingOrdersStatistics)
  @SDKField()
  roomBill: OutstandingOrdersStatistics;
}
