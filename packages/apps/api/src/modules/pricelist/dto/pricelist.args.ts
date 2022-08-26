import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { Pricelist } from '@src/modules/pricelist/pricelist.entity';
import {
  CreateArgsType,
  CreateDeleteArgsType,
  CreateDeleteManyArgsType,
  CreateUpdateArgsType,
  CreateUpdateInputType,
  CreateWhereArgsType,
  CreateWhereInputType,
} from '@src/utils/dto';
import { IsMongoId, IsOptional } from 'class-validator';

const argFields = <const>[
  'name',
  'description',
  'surcharges',
  'availability',
  'commerce',
  'collection',
  'delivery',
  'catalog',
  'promotions',
  'enabledPayments',
  'autoApprove',
  'feedback',
  'posSettings',
];

@ArgsType()
export class CreatePricelistArgs extends CreateArgsType(Pricelist, argFields) {
  @Field()
  @IsMongoId()
  spaceId: string;
}

@InputType()
class PricelistWhereInput extends CreateWhereInputType() {}

@InputType()
class UpdatePricelistInput extends CreateUpdateInputType(Pricelist, argFields) {
  @Field({ nullable: true })
  @IsMongoId()
  @IsOptional()
  spaceId?: string;
}

@ArgsType()
export class UpdatePricelistArgs extends CreateUpdateArgsType(
  PricelistWhereInput,
  UpdatePricelistInput
) {}

@ArgsType()
export class DeletePricelistArgs extends CreateDeleteArgsType() {}

@ArgsType()
export class DeletePricelistsArgs extends CreateDeleteManyArgsType() {}

@ArgsType()
export class WherePricelistArgs extends CreateWhereArgsType() {}
