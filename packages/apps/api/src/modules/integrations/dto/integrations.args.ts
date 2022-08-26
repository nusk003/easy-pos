import { ArgsType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@ArgsType()
export class ApaleoAuthorizeArgs {
  @IsString()
  @IsNotEmpty()
  @Field()
  code: string;
}

@ArgsType()
export class MewsAuthorizeArgs {
  @IsString()
  @IsNotEmpty()
  @Field()
  accessToken: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  clientToken: string;
}

@ArgsType()
export class OmnivoreAuthorizeArgs {
  @IsString()
  @IsNotEmpty()
  @Field()
  apiKey: string;
}

@ArgsType()
export class GetOmnivoreOptionsArgs {
  @IsString()
  @IsNotEmpty()
  @Field()
  locationId: string;
}
