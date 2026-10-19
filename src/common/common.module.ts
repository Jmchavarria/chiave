import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailServicePort } from './email/ports/email-service.port';
import { ResendEmailAdapter } from '../app/auth/infrastructure/email/resend-email.adapter';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: EmailServicePort,
      useClass: ResendEmailAdapter,
    },
  ],
  exports: [EmailServicePort],
})
export class CommonModule {}
