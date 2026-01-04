import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';

import { RedisClient } from './redis.provider';

@Injectable()
export class RedisService implements OnModuleDestroy {
  public constructor(
    @Inject('REDIS_CLIENT')
    private readonly client: RedisClient,
  ) {}

  public async setKey(
    key: string,
    value: string,
    expirySeconds?: number,
  ): Promise<void> {
    if (expirySeconds) {
      await this.client.set(key, value, 'EX', expirySeconds);
    } else {
      await this.client.set(key, value);
    }
  }

  public async getKey(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  public async deleteKey(key: string): Promise<void> {
    await this.client.del(key);
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.quit();
  }
}
