import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';
import { verifyAndActivateUserCommand } from './verify-and-activate-user.command';
import { EmailVerificationTokenPort } from '../../../domain/ports/email-verification-token.port';
import * as argon2 from 'argon2';
import { BadRequestException } from '@nestjs/common';
import { CustomError } from '../../../../common/errors/custom.error';
import { ErrorCode } from '../../../../common/errors/error-code-enum';

@CommandHandler(verifyAndActivateUserCommand)
export class VerifyAndActivateUserHandler implements ICommandHandler<
  verifyAndActivateUserCommand,
  void
> {
  constructor(private readonly repository: EmailVerificationTokenPort) {}
  async execute(command: verifyAndActivateUserCommand): Promise<void> {
    if (!command.token || !command.userId) {
      throw new BadRequestException('El ID y el token son obligatorios');
    }
    const tokenByUser = await this.repository.findByUser(command.userId);

    if (!tokenByUser) {
      throw new BadRequestException('El ID y el token son obligatorios');
    }

    const tokenHash = await argon2.verify(tokenByUser.tokenHash, command.token);

    if (!tokenHash)
      throw new CustomError({
        message: 'El token de verificación es inválido, expiró o ya fue utilizado.',
        code: ErrorCode.invalid_verification_email,
      });

    return this.repository.verifyAndActivateUser(command.userId);
  }
}
