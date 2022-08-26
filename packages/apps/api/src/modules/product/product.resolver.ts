import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { HotelGuard, UserRole } from '@src/modules/auth/guards';
import { SDKMutation, SDKQuery } from '@src/utils/gql';
import {
  CreateProductArgs,
  DeleteProductArgs,
  DeleteProductsArgs,
  ProductPaginationSearchArgs,
  UpdateProductArgs,
  WhereProductArgs,
} from './dto/product.args';
import { SearchProductsResponse } from './dto/product.responses';
import { Product } from './product.entity';
import { ProductService } from './product.service';

@Resolver()
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(HotelGuard(UserRole.HotelMember))
  @Query(() => [Product], { name: 'products' })
  @SDKQuery(() => [Product], { name: 'products' })
  async getProducts(): Promise<Product[]> {
    const products = await this.productService.findAll();
    return products;
  }

  @UseGuards(HotelGuard(UserRole.HotelMember))
  @Query(() => SearchProductsResponse)
  @SDKQuery(() => SearchProductsResponse)
  async searchProducts(
    @Args() productPaginationSearchArgs: ProductPaginationSearchArgs
  ): Promise<SearchProductsResponse> {
    return this.productService.search(productPaginationSearchArgs);
  }

  @UseGuards(HotelGuard(UserRole.HotelMember))
  @Query(() => Product, { name: 'product' })
  @SDKQuery(() => Product, { name: 'product' })
  async getProductByID(
    @Args() whereSpaceArgs: WhereProductArgs
  ): Promise<Product> {
    const product = await this.productService.findOne(whereSpaceArgs.where.id);
    return product;
  }

  @UseGuards(HotelGuard(UserRole.HotelMember))
  @Mutation(() => Product)
  @SDKMutation(() => Product)
  async createProduct(
    @Args() createProductArgs: CreateProductArgs
  ): Promise<Product> {
    const product = new Product(createProductArgs);
    this.productService.persist(product);
    await this.productService.flush();
    await this.productService.indexOne(product);
    return product;
  }

  @UseGuards(HotelGuard(UserRole.HotelMember))
  @Mutation(() => Product)
  @SDKMutation(() => Product)
  async updateProduct(
    @Args() updateProductArgs: UpdateProductArgs
  ): Promise<Product> {
    const product = await this.productService.update(updateProductArgs);
    await this.productService.flush();
    await this.productService.indexOne(product);
    return product;
  }

  @UseGuards(HotelGuard(UserRole.HotelMember))
  @Mutation(() => Boolean)
  @SDKMutation(() => Boolean)
  async deleteProduct(
    @Args() deleteProductArgs: DeleteProductArgs
  ): Promise<boolean> {
    await this.productService.delete(deleteProductArgs);
    await this.productService.flush();

    const product = new Product({ id: deleteProductArgs.where.id });
    product.hotel = this.productService.hotelReference;

    await this.productService.deleteOne(product);

    return true;
  }

  @UseGuards(HotelGuard(UserRole.HotelMember))
  @Mutation(() => Boolean)
  @SDKMutation(() => Boolean)
  async deleteProducts(@Args() deleteProductsArgs: DeleteProductsArgs) {
    await this.productService.deleteMany(deleteProductsArgs);
    await this.productService.flush();

    return true;
  }
}
