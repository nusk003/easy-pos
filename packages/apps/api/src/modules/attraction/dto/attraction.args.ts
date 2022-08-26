import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { Attraction } from '@src/modules/attraction/attraction.entity';
import { CreateArgsType, CreateUpdateInputType } from '@src/utils/dto';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

const createArgFields = <const>['description', 'catalog', 'enabled'];

const updateArgFields = <const>['catalog', 'description', 'enabled'];

@ArgsType()
export class CreateAttractionArgs extends CreateArgsType(
  Attraction,
  createArgFields
) {}

@InputType()
class UpdateAttractionInput extends CreateUpdateInputType(
  Attraction,
  updateArgFields
) {}

@ArgsType()
export class UpdateAttractionArgs {
  @Type(() => UpdateAttractionInput)
  @ValidateNested()
  @Field()
  data: UpdateAttractionInput;
}

@ArgsType()
export class AttractionPlaceByPlaceIDArgs {
  @IsString()
  @IsNotEmpty()
  @Field()
  placeId: string;
}

@ArgsType()
export class SearchCustomAttractionPlaceArgs {
  @IsString()
  @IsNotEmpty()
  @Field()
  query: string;
}

@InputType()
export class GenerateAttractionPlacesCategoryArgs {
  @IsString()
  @IsNotEmpty()
  @Field()
  @Type()
  name: string;
}

@ArgsType()
export class GenerateAttractionPlacesArgs {
  @Type(() => GenerateAttractionPlacesCategoryArgs)
  @IsArray()
  @ValidateNested({ each: true })
  @Field(() => [GenerateAttractionPlacesCategoryArgs])
  categories: GenerateAttractionPlacesCategoryArgs[];

  @IsBoolean()
  @Field()
  requestBooking: boolean;

  @IsNumber({ maxDecimalPlaces: 0 })
  @Min(1)
  @Field(() => Number)
  radius: number;
}
