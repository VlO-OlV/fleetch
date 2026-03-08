import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { BullMQKey } from 'src/common/consts';
import { EmailOptions } from 'src/common/types';

@Injectable()
export class EmailService {
  public constructor(
    @InjectQueue(BullMQKey.EMAIL)
    private readonly emailQueue: Queue,
  ) {}

  public async sendEmail({ ...data }: EmailOptions) {
    await this.emailQueue.add('send', { ...data });
  }
}
