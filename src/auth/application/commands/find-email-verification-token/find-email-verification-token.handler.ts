import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { FindEmailVerificationTokenCommand } from './find-email-verification-token.command';
import { EmailVerificationTokenPort } from '../../../domain/ports/email-verification-token.port';
import { CustomError } from '../../../../common/errors/custom.error';
import { ErrorCode } from '../../../../common/errors/error-code-enum';
import { EmailVerificationTokenDE } from '../../../domain/entities/email-verification-token.doman-entity';

@CommandHandler(FindEmailVerificationTokenCommand)
export class FindEmailVerificationTokenHandler implements ICommandHandler<
  FindEmailVerificationTokenCommand,
  EmailVerificationTokenDE
> {
  constructor(private readonly repository: EmailVerificationTokenPort) {}
  async execute(command: FindEmailVerificationTokenCommand): Promise<EmailVerificationTokenDE> {
    const token = await this.repository.findByToken(command.tokenHash);

    if (!token)
      throw new CustomError({
        code: ErrorCode.verification_email_does_not_exist,
        message: 'Verification email does not exist',
      });

    return token;
  }
}
