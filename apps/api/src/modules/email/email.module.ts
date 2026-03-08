import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { BullMQModule } from 'src/bullmq/bullmq.module';

import { EmailConsumer } from './email.consumer';
import { EmailService } from './email.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.getOrThrow<string>('SMTP_HOST'),
          secure: false,
          auth: {
            user: configService.getOrThrow<string>('SMTP_USER'),
            pass: configService.getOrThrow<string>('SMTP_PASSWORD'),
          },
        },
        defaults: {
          from: `Fleetch <${configService.getOrThrow<string>('SMTP_USER')}>`,
        },
      }),
    }),
    BullMQModule,
  ],
  providers: [EmailService, EmailConsumer],
  exports: [EmailService],
})
export class EmailModule {}
