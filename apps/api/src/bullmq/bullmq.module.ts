import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BullMQKey } from 'src/common/consts';

@Module({
  imports: [
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        connection: {
          host: configService.getOrThrow<string>('redis.host'),
          port: configService.getOrThrow<number>('redis.port'),
          password: configService.getOrThrow<string>('redis.password'),
        },
      }),
    }),
    BullModule.registerQueue({ name: BullMQKey.EMAIL }),
  ],
  exports: [BullModule],
})
export class BullMQModule {}
