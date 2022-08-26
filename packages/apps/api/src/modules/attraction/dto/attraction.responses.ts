import { Field, ObjectType } from '@nestjs/graphql';
import { SDKField } from '@src/utils/gql';
import { IsString } from 'class-validator';

@ObjectType()
export class SearchCustomAttractionPlaceResponse {
  @Field()
  @SDKField()
  placeId: string;

  @Field()
  @SDKField()
  title: string;

  @Field()
  @SDKField()
  description: string;
}

@ObjectType()
export class GenerateAttractionPlacesCategoryResponse {
  @Field()
  @SDKField()
  name: string;
}
