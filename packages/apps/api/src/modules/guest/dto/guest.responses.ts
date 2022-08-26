import { Field, ObjectType } from '@nestjs/graphql';
import { Guest } from '@src/modules/guest/guest.entity';
import { SDKField, SDKObject } from '@src/utils/gql';

@ObjectType()
@SDKObject()
export class SearchGuestsResponse {
  @Field(() => [Guest])
  @SDKField(() => Guest, {
    omit: ['deviceId', 'threads', 'orders', 'bookings'],
  })
  data: Array<Guest>;

  @Field()
  @SDKField()
  count: number;
}

@ObjectType()
@SDKObject()
export class GuestWithStatistics extends Guest {
  @Field()
  @SDKField()
  totalSpend: number;

  @Field()
  @SDKField()
  ordersCount: number;

  @Field()
  @SDKField()
  itemsCount: number;
}
