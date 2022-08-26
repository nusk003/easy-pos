import { productIds } from '@dev/seed-data/constants';
import { faker } from '@dev/seed-data/util';
import { Product } from '@src/modules/product/product.entity';
import { mainGroup } from './groups.factory';
import { mainHotel } from './hotels.factory';

export const products = productIds.map((id) => {
  const product = new Product();
  product._id = id;
  product.name = faker.commerce.productName();
  product.code = `SE-${faker.datatype.number({ min: 1000 })}`;
  product.stock = faker.datatype.number({ min: 0 });
  product.costPrice = parseFloat(faker.commerce.price(100));
  product.sellPrice = parseFloat(faker.commerce.price(product.costPrice + 100));
  product.hotel = mainHotel;
  product.group = mainGroup;
  return product;
});
