import { Field, ObjectType } from '@nestjs/graphql';
import { SDKField, SDKObject } from '@src/utils/gql';

@ObjectType()
@SDKObject()
export class ApaleoPropertyResponse {
  @Field()
  @SDKField()
  id: string;

  @Field()
  @SDKField()
  name: string;
}
