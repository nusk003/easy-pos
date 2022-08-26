import { Field, ObjectType } from '@nestjs/graphql';
import { SDKField, SDKObject } from '@src/utils/gql';
import { Product } from '@src/modules/product/product.entity';

@ObjectType()
@SDKObject()
export class SearchProductsResponse {
  @Field(() => [Product])
  @SDKField(() => Product)
  data: Array<Product>;

  @Field()
  @SDKField()
  count: number;
}
