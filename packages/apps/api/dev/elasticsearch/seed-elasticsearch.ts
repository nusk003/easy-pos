import { ElasticClient } from '@src/libs/elasticsearch/elasticsearch.client';
import { Order } from '@src/modules/order/order.entity';
import { Hotel } from '@src/modules/hotel/entities';
import { Guest } from '@src/modules/guest/guest.entity';
import { getORM } from '@dev/mongodb/get-orm';
import { EntityManager } from '@mikro-orm/mongodb';
import { Booking } from '@src/modules/booking/booking.entity';
import { Product } from '@src/modules/product/product.entity';
import { Customer } from '@src/modules/customer/customer.entity';

export const seedElasticsearch = async () => {
  const orm = await getORM();
  const em = <EntityManager>orm.em.fork();

  const ec = new ElasticClient();

  /* ----INIT----- */
  const hotels = await em.find(Hotel, {});
  await ec.createIndices();
  await ec.createAliases(hotels);

  // /* ----ORDERS---- */
  // const orders = await em.find(Order, {});
  // await ec.indexMany(Order, orders);

  // /* ----BOOKINGS---- */
  // const bookings = await em.find(Booking, {});
  // await ec.indexMany(Booking, bookings);

  // /* ----GUESTS---- */
  // const guests = await em.find(Guest, {});
  // await ec.indexMany(Guest, guests);

  /* ----PRODUCTS---- */
  const products = await em.find(Product, {});
  await ec.indexMany(Product, products);

  /* ----CUSTOMERS---- */
  const customers = await em.find(Customer, {});
  await ec.indexMany(Customer, customers);
};
