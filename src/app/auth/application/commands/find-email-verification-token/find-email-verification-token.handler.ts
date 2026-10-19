import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { FindEmailVerificationTokenCommand } from './find-email-verification-token.command';
import { EmailVerificationTokenPort } from '../../../domain/ports/email-verification-token.port';
import { EmailVerificationTokenDE } from '../../../domain/entities/email-verification-token.doman-entity';
import { CustomError } from '../../../../../common/errors/custom.error';
import { ErrorCode } from '../../../../../common/errors/error-code-enum';

@CommandHandler(FindEmailVerificationTokenCommand)
export class FindEmailVerificationTokenByUserHandler implements ICommandHandler<
  FindEmailVerificationTokenCommand,
  EmailVerificationTokenDE
> {
  constructor(private readonly repository: EmailVerificationTokenPort) {}
  async execute(command: FindEmailVerificationTokenCommand): Promise<EmailVerificationTokenDE> {
    const token = await this.repository.findByUser(command.userId);

    if (!token)
      throw new CustomError({
        code: ErrorCode.verification_email_does_not_exist,
        message: 'Verification email does not exist',
      });

    return token;
  }
}
