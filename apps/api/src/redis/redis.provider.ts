import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis, { RedisOptions } from 'ioredis';

export type RedisClient = Redis;

export const REDIS_CLIENT = 'REDIS_CLIENT';

export const RedisProvider: Provider = {
  provide: REDIS_CLIENT,
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    const options: RedisOptions = {
      host: configService.get<string>('redis.host'),
      port: configService.get<number>('redis.port'),
      password: configService.get<string>('redis.password'),
      retryStrategy: (times) => Math.min(times * 200, 2000),
      maxRetriesPerRequest: 1,
    };

    const client = new Redis(options);
    client.on('error', (e) => console.error(`Redis error: ${e}`));
    return client;
  },
};
