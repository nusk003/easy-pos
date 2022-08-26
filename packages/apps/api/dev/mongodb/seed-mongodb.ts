import { AnyEntity } from '@mikro-orm/core';
import { getORM } from './get-orm';

type SeedData = Record<string, Array<AnyEntity<unknown>>>;

export const seedMongoDB = async () => {
  const orm = await getORM();

  const em = orm.em.fork();

  Object.keys(require.cache).forEach((key) => {
    if (key.indexOf('seed-data') > -1) {
      delete require.cache[key];
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const seedData: SeedData = require('@dev/seed-data');

  /* ----GROUPS---- */
  seedData.groups.forEach((group) => {
    em.persist(group);
  });

  /* ----HOTELS---- */
  seedData.hotels.forEach((hotel) => {
    em.persist(hotel);
  });

  /* ----USERS---- */
  seedData.users.forEach((user) => {
    em.persist(user);
  });

  /* ----ROLES---- */
  seedData.roles.forEach((role) => {
    em.persist(role);
  });

  // /* ----PRICELISTS---- */
  // seedData.pricelists.forEach((pricelist) => {
  //   em.persist(pricelist);
  // });

  // /* ----SPACES---- */
  // seedData.spaces.forEach((space) => {
  //   em.persist(space);
  // });

  // /* ----ATTRACTIONS---- */
  // seedData.attractions.forEach((attraction) => {
  //   em.persist(attraction);
  // });

  // /* ----GUESTS---- */
  // seedData.guests.forEach((guest) => {
  //   em.persist(guest);
  // });

  // /* ----ORDERS---- */
  // seedData.orders.forEach((order) => {
  //   em.persist(order);
  // });

  // /* ----MESSAGES---- */
  // seedData.messages.forEach((message) => {
  //   em.persist(message);
  // });

  // /* ----THREADS---- */
  // seedData.threads.forEach((thread) => {
  //   em.persist(thread);
  // });

  // /* ----BOOKINGS---- */
  // seedData.bookings.forEach((booking) => {
  //   em.persist(booking);
  // });

  // /* ----MARKETPLACE APPS---- */
  // seedData.marketplaceApps.forEach((marketplaceApp) => {
  //   em.persist(marketplaceApp);
  // });

  /* ----PRODUCTS---- */
  seedData.products.forEach((product) => {
    em.persist(product);
  });

  /* ----CUSTOMERS---- */
  seedData.customers.forEach((customer) => {
    em.persist(customer);
  });

  await em.flush();
};
