import { FactoryProvider } from '@nestjs/common';
import { SendMailOptions } from 'nodemailer';

export type MailerOptions = Pick<
  FactoryProvider<SendMailOptions>,
  'useFactory' | 'inject'
>;
