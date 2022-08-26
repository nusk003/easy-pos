import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { Product } from '@src/modules/product/product.entity';
import {
  CreateArgsType,
  CreateDeleteArgsType,
  CreateDeleteManyArgsType,
  CreatePaginationArgsType,
  CreateSearchPaginationArgsType,
  CreateUpdateArgsType,
  CreateUpdateInputType,
  CreateWhereArgsType,
  CreateWhereInputType,
  PaginationSort,
} from '@src/utils/dto';
import { IsBoolean, IsEnum } from 'class-validator';

const argFields = <const>['name', 'costPrice', 'sellPrice', 'stock', 'code'];

const updateArgFields = <const>[
  'name',
  'costPrice',
  'sellPrice',
  'stock',
  'code',
];

@ArgsType()
export class CreateProductArgs extends CreateArgsType(Product, argFields) {}

@InputType()
class ProductWhereInput extends CreateWhereInputType() {}

@InputType()
class UpdateProductInput extends CreateUpdateInputType(
  Product,
  updateArgFields
) {}

@ArgsType()
export class UpdateProductArgs extends CreateUpdateArgsType(
  ProductWhereInput,
  UpdateProductInput
) {}

@ArgsType()
export class DeleteProductArgs extends CreateDeleteArgsType() {}

@ArgsType()
export class WhereProductArgs extends CreateWhereArgsType() {}

@ArgsType()
export class DeleteProductsArgs extends CreateDeleteManyArgsType() {}

@InputType()
export class ProductsSortInput {
  @IsEnum(PaginationSort)
  @Field(() => PaginationSort, { nullable: true })
  id?: PaginationSort;

  @IsEnum(PaginationSort)
  @Field(() => PaginationSort, { nullable: true })
  dateCreated?: PaginationSort;
}

@ArgsType()
export class ProductPaginationArgs extends CreatePaginationArgsType(
  ProductsSortInput
) {}

@ArgsType()
export class ProductPaginationSearchArgs extends CreateSearchPaginationArgsType(
  ProductPaginationArgs
) {
  @IsBoolean()
  @Field({ defaultValue: true })
  outOfStockItems: boolean;
}
