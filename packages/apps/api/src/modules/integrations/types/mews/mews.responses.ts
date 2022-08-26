import { Field, ObjectType } from '@nestjs/graphql';
import { SDKField, SDKObject } from '@src/utils/gql';
import { MewsServiceType } from './mews.types';

@ObjectType()
@SDKObject()
export class MewsServiceResponse {
  @Field()
  @SDKField()
  id: string;

  @Field()
  @SDKField()
  name: string;

  @Field()
  @SDKField()
  type: MewsServiceType;
}
