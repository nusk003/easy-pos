import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { Thread } from '@src/modules/thread/thread.entity';
import {
  CreatePaginationArgsType,
  CreateUpdateArgsType,
  CreateUpdateInputType,
  CreateWhereArgsType,
  CreateWhereInputType,
  PaginationSort,
} from '@src/utils/dto';
import { IsBoolean, IsEnum, IsMongoId, IsOptional } from 'class-validator';

const argFields = <const>['resolved'];

@InputType()
class ThreadWhereInput extends CreateWhereInputType() {}

@InputType()
class UpdateThreadInput extends CreateUpdateInputType(Thread, argFields) {}

@ArgsType()
export class UpdateThreadArgs extends CreateUpdateArgsType(
  ThreadWhereInput,
  UpdateThreadInput
) {}

@ArgsType()
export class WhereThreadArgs extends CreateWhereArgsType() {}

@InputType()
export class ThreadSortInput {
  @IsEnum(PaginationSort)
  @IsOptional()
  @Field(() => PaginationSort, { nullable: true })
  id?: PaginationSort;

  @IsEnum(PaginationSort)
  @IsOptional()
  @Field(() => PaginationSort, { nullable: true })
  dateCreated?: PaginationSort;

  @IsEnum(PaginationSort)
  @IsOptional()
  @Field(() => PaginationSort, { nullable: true })
  dateUpdated?: PaginationSort;
}

@ArgsType()
export class ThreadPaginationArgs extends CreatePaginationArgsType(
  ThreadSortInput
) {
  @IsMongoId()
  @IsOptional()
  @Field({ nullable: true })
  guestId?: string;

  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  resolved?: boolean;
}
