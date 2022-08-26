import { Field, InputType, ObjectType } from '@nestjs/graphql';
import {
  IntegrationProvider,
  IntegrationType,
} from '@src/modules/hotel/entities';
import { SDKField } from '@src/utils/gql';
import { Type } from 'class-transformer';
import {
  Equals,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

@ObjectType({ isAbstract: true })
@InputType('GroupIntegrationsOmnivoreInput')
export class GroupIntegrationsOmnivore {
  @Equals(IntegrationType.POS)
  @Field(() => IntegrationType)
  @SDKField()
  type: IntegrationType.POS;

  @IsString()
  @IsNotEmpty()
  @Field()
  apiKey: string;
}
@ObjectType({ isAbstract: true })
@InputType('GroupIntegrationsApaleoInput')
export class GroupIntegrationsApaleo {
  @Equals(IntegrationProvider.Apaleo)
  @Field(() => IntegrationProvider)
  @SDKField()
  provider: IntegrationProvider.Apaleo;

  @Equals(IntegrationType.PMS)
  @Field(() => IntegrationType)
  @SDKField()
  type: IntegrationType.PMS;

  @IsString()
  @IsOptional()
  @Field()
  refreshToken?: string;
}

@ObjectType({ isAbstract: true })
@InputType('GroupIntegrationsInput')
export class GroupIntegrations {
  @Type(() => GroupIntegrationsApaleo)
  @ValidateNested()
  @Field(() => GroupIntegrationsApaleo, { nullable: true })
  @SDKField()
  apaleo?: GroupIntegrationsApaleo;

  @Type(() => GroupIntegrationsOmnivore)
  @ValidateNested()
  @Field(() => GroupIntegrationsOmnivore, { nullable: true })
  @SDKField()
  omnivore?: GroupIntegrationsOmnivore;
}
