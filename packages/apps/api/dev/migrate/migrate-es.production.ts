import { EntityManager, MikroORM } from '@mikro-orm/core';
import { mikroORMConfig } from '@src/config/mikro-orm.config';
import { ElasticClient } from '@src/libs/elasticsearch/elasticsearch.client';
import { Booking } from '@src/modules/booking/booking.entity';
import { Guest } from '@src/modules/guest/guest.entity';
import { Hotel } from '@src/modules/hotel/entities';
import { Order } from '@src/modules/order/order.entity';

const main = async () => {
  const ec = new ElasticClient(undefined, process.env.PROD_ELASTICSEARCH_URI);

  await ec.indices.delete({
    index: '_all',
  });

  const orm = await MikroORM.init(
    mikroORMConfig({ clientUrl: process.env.PROD_MONGO_DB_URI })
  );
  const em = <EntityManager>orm.em.fork();

  /* ----INIT----- */
  const hotels = await em.find(Hotel, {});
  await ec.createIndices();
  await ec.createAliases(hotels);

  /* ----ORDERS---- */
  const orders = await em.find(Order, {});
  await ec.indexMany(Order, orders);

  /* ----BOOKINGS---- */
  const bookings = await em.find(Booking, {});
  await ec.indexMany(Booking, bookings);

  /* ----GUESTS---- */
  const guests = await em.find(Guest, {});
  await ec.indexMany(Guest, guests);

  await orm.close();
};

main();
