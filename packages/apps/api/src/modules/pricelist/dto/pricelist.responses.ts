import { Field, ObjectType } from '@nestjs/graphql';
import { Order } from '@src/modules/order/order.entity';
import { SDKField, SDKObject } from '@src/utils/gql';

@ObjectType({ isAbstract: true })
@SDKObject({ abstract: true })
export class PricelistFeedbackRating {
  @Field()
  @SDKField()
  value: number;

  @Field()
  @SDKField()
  count: number;

  @Field()
  @SDKField()
  percentage: number;
}

@ObjectType()
@SDKObject()
export class PricelistFeedback {
  @Field()
  @SDKField()
  averageRating: number;

  @Field()
  @SDKField()
  noReviews: number;

  @Field(() => [Order])
  @SDKField(() => Order)
  recentOrders: Order[];

  @Field(() => [PricelistFeedbackRating])
  @SDKField(() => PricelistFeedbackRating)
  ratings: PricelistFeedbackRating[];
}
