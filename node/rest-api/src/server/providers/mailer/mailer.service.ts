import {
  Inject,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SendMailOptions, Transporter, createTransport } from 'nodemailer';

import { MAILER_MODULE_OPTIONS } from './constants';

@Injectable()
export class MailerService {
  private readonly transporter: Transporter;
  private readonly logger = new Logger('Mailer');

  constructor(
    @Inject(MAILER_MODULE_OPTIONS)
    private readonly options: SendMailOptions,
    private readonly configService: ConfigService
  ) {
    this.transporter = createTransport(this.options);
  }

  async send(to: string, subject: string, body: string) {
    if (process.env.NODE_ENV === 'production') {
      try {
        await this.transporter.sendMail({
          from: this.configService.get('MAILER_FROM'),
          to: to,
          subject: subject,
          text: body,
        });
      } catch (err) {
        throw new ServiceUnavailableException();
      }
    } else {
      this.logger.log({
        from: this.configService.get<string>('MAILER_FROM'),
        to: to,
        subject: subject,
        text: body,
      });
    }
  }
}
