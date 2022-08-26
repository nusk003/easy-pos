import { Field, ObjectType } from '@nestjs/graphql';
import { SDKField } from '@src/utils/gql';
import { Booking } from '@src/modules/booking/booking.entity';

@ObjectType()
export class BookingAnalyticsResponse {
  @Field()
  @SDKField()
  noArrivals: number;

  @Field()
  @SDKField()
  noDepartures: number;

  @Field()
  @SDKField()
  noSubmittedBookings: number;
}

@ObjectType()
export class SearchBookingsResponse {
  @Field(() => [Booking])
  @SDKField(() => Booking)
  data: Array<Booking>;

  @Field()
  @SDKField()
  count: number;
}
