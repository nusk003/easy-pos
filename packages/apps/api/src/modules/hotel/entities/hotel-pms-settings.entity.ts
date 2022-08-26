import { Property } from '@mikro-orm/core';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { SDKField, SDKObject } from '@src/utils/gql';
import { IsNotEmpty, IsString } from 'class-validator';

@ObjectType({ isAbstract: true })
@InputType('HotelPMSMewsSettingsInput')
@SDKObject({ abstract: true })
export class HotelPMSMewsSettings {
  @Property()
  @IsString()
  @Field()
  @SDKField()
  orderableServiceId: string;

  @Property()
  @IsString()
  @Field()
  @SDKField()
  bookableServiceId: string;
}

@ObjectType({ isAbstract: true })
@InputType('HotelPMSSettingsInput')
@SDKObject({ abstract: true })
export class HotelPMSSettings {
  @Property()
  @IsString()
  @IsNotEmpty()
  @Field({ nullable: true })
  @SDKField()
  pmsId: string;

  @Property()
  @IsString()
  @Field(() => HotelPMSMewsSettings, {
    nullable: true,
  })
  @SDKField()
  mewsSettings?: HotelPMSMewsSettings;
}
