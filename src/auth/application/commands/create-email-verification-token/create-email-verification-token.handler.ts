import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateEmailVerificationTokenCommand } from './create-email-verification-token.command';
import { EmailVerificationTokenPort } from '../../../domain/ports/email-verification-token.port';
import { EmailServicePort } from '../../../../common/email/ports/email-service.port';
import argon2 from 'argon2';
import crypto from 'node:crypto';

@CommandHandler(CreateEmailVerificationTokenCommand)
export class CreateEmailVerificationTokenHandler implements ICommandHandler<
  CreateEmailVerificationTokenCommand,
  void
> {
  constructor(
    private readonly repository: EmailVerificationTokenPort,
    private readonly emailService: EmailServicePort,
  ) {}
  async execute(command: CreateEmailVerificationTokenCommand): Promise<void> {
    const token = crypto.randomBytes(32).toString('base64url');

    const tokenHash = await argon2.hash(token, {
      type: argon2.argon2id,
    });

    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    await this.repository.save({
      tokenHash,
      expiresAt,
      userId: command.userId,
    });

    await this.emailService.sendVerificationEmail({
      name: command.name,
      to: command.email,
      token,
      userId: command.userId,
    });
  }
}
