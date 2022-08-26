import { RedisMemoryServer } from 'redis-memory-server';

export const initializeRedis = async () => {
  const redisServer = new RedisMemoryServer({
    instance: {
      ip: '127.0.0.1',
      port: 33834,
      args: ['--bind', '0.0.0.0'],
    },
  });

  await redisServer.getHost();

  return redisServer;
};
