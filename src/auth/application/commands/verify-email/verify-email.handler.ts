import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';
import { createHash } from 'node:crypto';
import { VerifyEmailCommand } from './verify-email.command';
import { EmailVerificationTokenPort } from '../../../domain/ports/email-verification-token.port';

@CommandHandler(VerifyEmailCommand)
export class VerifyEmailHandler implements ICommandHandler<VerifyEmailCommand, void> {
  constructor(private readonly tokenRepository: EmailVerificationTokenPort) {}

  async execute(command: VerifyEmailCommand): Promise<void> {
    const tokenHash = createHash('sha256').update(command.token).digest('hex');

    await this.tokenRepository.verifyAndActivateUser(tokenHash);
  }
}
