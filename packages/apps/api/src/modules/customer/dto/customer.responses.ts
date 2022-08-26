import { Field, ObjectType } from '@nestjs/graphql';
import { SDKField, SDKObject } from '@src/utils/gql';
import { Customer } from '@src/modules/customer/customer.entity';

@ObjectType()
@SDKObject()
export class SearchCustomersResponse {
  @Field(() => [Customer])
  @SDKField(() => Customer)
  data: Array<Customer>;

  @Field()
  @SDKField()
  count: number;
}
