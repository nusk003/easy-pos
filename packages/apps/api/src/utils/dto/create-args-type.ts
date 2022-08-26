import { ArgsType, Field, PickType } from '@nestjs/graphql';
import { ClassConstructor, Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { WhereInputType } from './create-where-input-type';
import { entityToArgs } from './entity-to-args';

export const CreateArgsType = <T, K extends keyof T>(
  entity: ClassConstructor<T>,
  pick: readonly K[]
) => {
  return PickType(entityToArgs(entity), pick);
};

export const CreateUpdateArgsType = <W, D>(
  WhereInput: ClassConstructor<W>,
  DataInput: ClassConstructor<D>
) => {
  @ArgsType()
  class UpdateArgsType {
    @Type(() => WhereInput)
    @ValidateNested()
    @Field(() => WhereInput)
    where: W;

    @Type(() => DataInput)
    @ValidateNested()
    @Field(() => DataInput)
    data: D;
  }

  return UpdateArgsType;
};

export const CreateDeleteArgsType = () => {
  @ArgsType()
  class DeleteArgsType {
    @Type(() => WhereInputType)
    @ValidateNested()
    @Field(() => WhereInputType)
    where: WhereInputType;
  }

  return DeleteArgsType;
};

export const CreateDeleteManyArgsType = () => {
  @ArgsType()
  class DeleteArgsType {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => WhereInputType)
    @Field(() => [WhereInputType])
    where: WhereInputType[];
  }

  return DeleteArgsType;
};

export const CreateWhereArgsType = () => {
  @ArgsType()
  class WhereArgsType {
    @Type(() => WhereInputType)
    @ValidateNested()
    @Field(() => WhereInputType)
    where: WhereInputType;
  }

  return WhereArgsType;
};

export const CreatePaginationArgsType = <W>(SortInput: ClassConstructor<W>) => {
  @ArgsType()
  class PaginationArgsType {
    @Type(() => SortInput)
    @ValidateNested()
    @Field(() => SortInput, { nullable: true })
    sort?: W;

    @IsNumber({ maxDecimalPlaces: 0 })
    @Min(0)
    @IsOptional()
    @Field({ nullable: true })
    limit?: number;

    @IsNumber({ maxDecimalPlaces: 0 })
    @Min(0)
    @IsOptional()
    @Field({ nullable: true })
    offset?: number;
  }

  return PaginationArgsType;
};

export const CreateSearchPaginationArgsType = <W>(
  SortInput: ClassConstructor<W>
) => {
  @ArgsType()
  class PaginationArgsType {
    @IsString()
    @IsOptional()
    @Field({ nullable: true })
    query?: string;

    @Type(() => SortInput)
    // @Field(() => SortInput, { nullable: true })
    sort?: W;

    @IsNumber({ maxDecimalPlaces: 0 })
    @Min(0)
    @IsOptional()
    @Field({ nullable: true })
    limit?: number;

    @IsNumber({ maxDecimalPlaces: 0 })
    @Min(0)
    @IsOptional()
    @Field({ nullable: true })
    offset?: number;
  }

  return PaginationArgsType;
};
