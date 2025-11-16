import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { EmailOptions } from 'src/common/types';

@Injectable()
export class EmailService {
  public constructor(private readonly mailerService: MailerService) {}

  public async sendEmail({ subject, to, message }: EmailOptions) {
    await this.mailerService.sendMail({
      to,
      subject,
      text: message,
    });
  }
}
