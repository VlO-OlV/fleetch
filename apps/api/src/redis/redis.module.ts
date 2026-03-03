import { Global, Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { RedisHealthIndicator } from './redis.indicator';
import { RedisProvider } from './redis.provider';
import { RedisService } from './redis.service';

@Global()
@Module({
  imports: [TerminusModule],
  providers: [RedisProvider, RedisHealthIndicator, RedisService],
  exports: [RedisService, RedisHealthIndicator],
})
export class RedisModule {}
