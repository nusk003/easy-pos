import { Field, ObjectType } from '@nestjs/graphql';
import { PricelistMultiplierType } from '@src/modules/pricelist/pricelist.entity';
import { SDKField, SDKObject } from '@src/utils/gql';

@ObjectType()
@SDKObject()
export class OmnivoreLocationsResponse {
  @Field()
  @SDKField()
  id: string;

  @Field(() => String)
  @SDKField()
  provider: string;
}

@ObjectType()
@SDKObject()
export class OmnivorePriceLevelResponse {
  @Field()
  @SDKField()
  id: string;

  @Field()
  @SDKField()
  name: string;

  @Field()
  @SDKField()
  price: number;
}

@ObjectType()
@SDKObject()
export class OmnivoreDiscountsResponse {
  @Field()
  @SDKField()
  id: string;

  @Field()
  @SDKField()
  value: number;

  @Field()
  @SDKField()
  name: string;

  @Field({ nullable: true })
  @SDKField()
  available?: boolean;

  @Field({ nullable: true })
  @SDKField()
  order?: boolean;

  @Field({ nullable: true })
  @SDKField()
  item?: boolean;

  @Field({ nullable: true })
  @SDKField()
  open?: boolean;

  @Field({ nullable: true })
  @SDKField()
  maxAmount?: number;

  @Field({ nullable: true })
  @SDKField()
  minAmount?: number;

  @Field({ nullable: true })
  @SDKField()
  maxPercent?: number;

  @Field({ nullable: true })
  @SDKField()
  minPercent?: number;

  @Field({ nullable: true })
  @SDKField()
  minOrderAmount?: number;

  @Field(() => PricelistMultiplierType)
  @SDKField()
  type: PricelistMultiplierType;

  @Field({ nullable: true })
  @SDKField()
  posId?: string;
}

@ObjectType()
@SDKObject()
export class OmnivoreOption {
  @Field()
  @SDKField()
  id: string;

  @Field()
  @SDKField()
  name: string;
}

@ObjectType()
@SDKObject()
export class OmnivoreOptionsResponse {
  @Field(() => [OmnivoreOption])
  @SDKField(() => OmnivoreOption)
  employees: OmnivoreOption[];

  @Field(() => [OmnivoreOption])
  @SDKField(() => OmnivoreOption)
  orderTypes: OmnivoreOption[];

  @Field(() => [OmnivoreOption])
  @SDKField(() => OmnivoreOption)
  revenueCenters: OmnivoreOption[];
}
