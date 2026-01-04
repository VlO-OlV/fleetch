import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis, { RedisOptions } from 'ioredis';

export type RedisClient = Redis;

export const redisProvider: Provider = {
  provide: 'REDIS_CLIENT',
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    const options: RedisOptions = {
      host: configService.get<string>('redis.host'),
      port: configService.get<number>('redis.port'),
      password: configService.get<string>('redis.password'),
      retryStrategy: (times) => Math.min(1000 * 2 ** times, 30000),
    };

    const client = new Redis(options);
    client.on('error', (e) => console.error(`Redis error: ${e}`));
    return client;
  },
};
