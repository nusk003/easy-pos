import ElasticMemoryServer from 'elasticsearch-memory-server';

export const initializeElasticsearch = async (): Promise<ElasticMemoryServer> => {
  const elasticServer = new ElasticMemoryServer({
    instance: {
      port: process.env.NODE_ENV === 'test' ? 43833 : 33833,
    },
  });
  await elasticServer.getUri();

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { seedElasticsearch } = require('./seed-elasticsearch');

  try {
    await seedElasticsearch();
  } catch (err) {
    console.error(err);
    await elasticServer.stop();
    process.exit();
  }

  return elasticServer;
};
