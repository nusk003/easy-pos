import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsMongoId,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

class GenerateAttractionPlacesCategory {
  @IsString()
  @Type()
  name: string;

  @IsArray()
  @Type()
  keywords: string[];
}

export class GenerateAttractionPlacesArgs {
  @IsMongoId()
  hotelId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GenerateAttractionPlacesCategory)
  categories: GenerateAttractionPlacesCategory[];

  @IsNumber({ maxDecimalPlaces: 0 })
  @Min(1)
  radius: number;

  @IsBoolean()
  requestBooking: boolean;
}
