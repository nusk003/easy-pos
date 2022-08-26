import { __node_env__ } from '@constants';
import { MongoMemoryReplSet } from 'mongodb-memory-server';

export const initializeMongoDB = async (): Promise<MongoMemoryReplSet> => {
  const mongod = await MongoMemoryReplSet.create({
    replSet: {
      storageEngine: 'wiredTiger',
      args: ['--bind_ip_all'],
    },
    instanceOpts: [
      {
        port: __node_env__ === 'test' ? 43832 : 33832,
      },
    ],
  });

  await mongod.waitUntilRunning();

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { seedMongoDB } = require('./seed-mongodb');

  try {
    await seedMongoDB();
  } catch (err) {
    console.error(err);
    await mongod.stop();
    process.exit();
  }

  return mongod;
};
