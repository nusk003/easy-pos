import { RedisModuleOptions } from './redis.interfaces';
import Redis from 'ioredis';
import {
  REDIS_MODULE_CONNECTION,
  REDIS_MODULE_CONNECTION_TOKEN,
  REDIS_MODULE_OPTIONS_TOKEN,
} from './redis.constants';
import { __node_env__, __stage__ } from '@constants';

export function getRedisOptionsToken(connection?: string): string {
  return `${
    connection || REDIS_MODULE_CONNECTION
  }_${REDIS_MODULE_OPTIONS_TOKEN}`;
}

export function getRedisConnectionToken(connection?: string): string {
  return `${
    connection || REDIS_MODULE_CONNECTION
  }_${REDIS_MODULE_CONNECTION_TOKEN}`;
}

let redis: Redis.Redis;
export function createRedisConnection(options: RedisModuleOptions) {
  if (!redis) {
    const { config } = options;
    if (config.url) {
      redis = new Redis(config.url, config);
    } else {
      redis = new Redis(config);
    }
  }

  return redis;
}
