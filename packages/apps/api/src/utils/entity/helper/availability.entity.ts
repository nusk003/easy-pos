import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { SDKField, SDKObject } from '@src/utils/gql';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  Matches,
  ValidateNested,
} from 'class-validator';

export type Days = 'm' | 't' | 'w' | 'th' | 'f' | 'sa' | 's';

@ObjectType({ isAbstract: true })
@InputType('DaysTimeInput', { isAbstract: true })
export class DaysTime {
  @Field()
  @Matches(/^[0-2][0-9]:[0-5][0-9]$/, {
    message: 'Time must be in the format HH:MM',
  })
  @IsNotEmpty()
  @SDKField()
  start: string;

  @Field()
  @Matches(/^[0-2][0-9]:[0-5][0-9]$/, {
    message: 'Time must be in the format HH:MM',
  })
  @IsNotEmpty()
  @SDKField()
  end: string;
}

@ObjectType({ isAbstract: true })
@SDKObject({ abstract: true })
@InputType('AvailabilityInput', { isAbstract: true })
export class Availability {
  @Field({ nullable: true })
  @IsOptional()
  @Type(() => DaysTime)
  @SDKField()
  @ValidateNested()
  m?: DaysTime;

  @Field({ nullable: true })
  @IsOptional()
  @Type(() => DaysTime)
  @SDKField()
  @ValidateNested()
  t?: DaysTime;

  @Field({ nullable: true })
  @IsOptional()
  @Type(() => DaysTime)
  @SDKField()
  @ValidateNested()
  w?: DaysTime;

  @Field({ nullable: true })
  @IsOptional()
  @Type(() => DaysTime)
  @SDKField()
  @ValidateNested()
  th?: DaysTime;

  @Field({ nullable: true })
  @IsOptional()
  @Type(() => DaysTime)
  @SDKField()
  @ValidateNested()
  f?: DaysTime;

  @Field({ nullable: true })
  @IsOptional()
  @Type(() => DaysTime)
  @SDKField()
  @ValidateNested()
  sa?: DaysTime;

  @Field({ nullable: true })
  @IsOptional()
  @Type(() => DaysTime)
  @SDKField()
  @ValidateNested()
  s?: DaysTime;
}
