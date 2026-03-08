import { Processor, WorkerHost } from '@nestjs/bullmq';
import { MailerService } from '@nestjs-modules/mailer';
import { Job } from 'bullmq';
import { SentMessageInfo } from 'nodemailer';
import { BullMQKey } from 'src/common/consts';
import { EmailOptions } from 'src/common/types';

@Processor(BullMQKey.EMAIL)
export class EmailConsumer extends WorkerHost {
  public constructor(private readonly mailerService: MailerService) {
    super();
  }

  public async process(job: Job<EmailOptions>): Promise<SentMessageInfo> {
    const { to, subject, message: text } = job.data;

    const messageInfo = await this.mailerService.sendMail({
      to,
      subject,
      text,
    });

    return messageInfo;
  }
}
