import { getORM } from '@dev/mongodb/get-orm';
import { __mongodb_db_name__, __mongodb_uri__, __prod__ } from '@src/constants';
import { ElasticClient } from '@src/libs/elasticsearch/elasticsearch.client';
import { MongoClient } from 'mongodb';

export const reseed = async () => {
  if (__prod__) {
    throw new Error('DB must only be run in development mode.');
  }

  const mongoClient = await MongoClient.connect(__mongodb_uri__);

  for (const collection of await mongoClient
    .db(__mongodb_db_name__)
    .collections()) {
    await collection.deleteMany({});
    await collection.dropIndexes();
  }

  const orm = await getORM();
  const em = orm.em.fork();

  await em.flush();

  const ec = new ElasticClient();
  await ec.indices.delete({
    index: '_all',
  });

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { seedMongoDB } = require('@dev/mongodb/seed-mongodb');
  await seedMongoDB();

  const {
    seedElasticsearch,
    // eslint-disable-next-line @typescript-eslint/no-var-requires
  } = require('@dev/elasticsearch/seed-elasticsearch');
  await seedElasticsearch();
};
