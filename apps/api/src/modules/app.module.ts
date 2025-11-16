import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AccessModule } from 'src/common/guards/access.module';
import configuration from 'src/config/configuration';
import { DatabaseModule } from 'src/database/database.module';

import { ApiModule } from './api.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env${process.env.NODE_ENV ? `.${process.env.NODE_ENV}` : ''}`,
      load: [configuration],
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),
    ApiModule,
    DatabaseModule,
    AccessModule,
  ],
})
export class AppModule {}
