import { Field, ObjectType } from '@nestjs/graphql';
import { SDKField } from '@src/utils/gql';

@ObjectType()
export class GetCustomDomainResponse {
  @Field()
  @SDKField()
  id: string;

  @Field()
  @SDKField()
  domain: string;

  @Field()
  @SDKField()
  configured: boolean;

  @Field()
  @SDKField()
  clientStatus: string;
}
