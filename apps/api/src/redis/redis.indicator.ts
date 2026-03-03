import { Injectable, Inject } from '@nestjs/common';
import { HealthIndicatorService } from '@nestjs/terminus';

import { REDIS_CLIENT, RedisClient } from './redis.provider';

@Injectable()
export class RedisHealthIndicator {
  constructor(
    @Inject(REDIS_CLIENT)
    private readonly redisClient: RedisClient,
    private readonly healthIndicatorService: HealthIndicatorService,
  ) {}

  public async pingCheck(key: string) {
    const indicator = this.healthIndicatorService.check(key);
    try {
      const pong = await this.redisClient.ping();

      if (pong !== 'PONG') {
        return indicator.down();
      }

      return indicator.up();

      // eslint-disable-next-line
    } catch (error) {
      return indicator.down();
    }
  }
}
