import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsURL } from '@src/utils/class-validation';
import { SDKField, SDKObject } from '@src/utils/gql';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

@ObjectType()
@InputType('HotelCustomLinkInput')
@SDKObject()
export class HotelCustomLink {
  @IsUUID()
  @Field()
  @SDKField()
  id: string;

  @IsBoolean()
  @Field()
  @SDKField()
  enabled: boolean;

  @IsString()
  @IsNotEmpty()
  @Field()
  @SDKField()
  name: string;

  @IsURL()
  @Field()
  @SDKField()
  link: string;

  @IsString({ each: true })
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  photo?: string;
}
