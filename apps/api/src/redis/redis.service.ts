import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import {
  RedisExpiryPeriod,
  RedisExpiryPeriodToSecondsMap,
  RedisKey,
} from 'src/common/consts';

import { REDIS_CLIENT, RedisClient } from './redis.provider';

@Injectable()
export class RedisService implements OnModuleDestroy {
  public constructor(
    @Inject(REDIS_CLIENT)
    private readonly client: RedisClient,
  ) {}

  public async setKey<T>(
    key: RedisKey,
    id: string,
    value: T,
    expiryPeriod?: RedisExpiryPeriod,
  ): Promise<void> {
    const uniqueKey = `${key}_${id}`;

    if (expiryPeriod) {
      await this.client.set(
        uniqueKey,
        JSON.stringify(value),
        'EX',
        RedisExpiryPeriodToSecondsMap[expiryPeriod],
      );
    } else {
      await this.client.set(uniqueKey, JSON.stringify(value));
    }
  }

  public async getKey<T>(key: RedisKey, id: string): Promise<T | null> {
    const rawData = await this.client.get(`${key}_${id}`);

    return rawData ? JSON.parse(rawData) : null;
  }

  public async deleteKey(key: RedisKey, id: string): Promise<void> {
    await this.client.del(`${key}_${id}`);
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.quit();
  }
}
