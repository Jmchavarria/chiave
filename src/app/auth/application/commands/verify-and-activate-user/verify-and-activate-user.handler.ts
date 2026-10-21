import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CustomError } from '../../../../../common/errors/custom.error';
import { ErrorCode } from '../../../../../common/errors/error-code-enum';
import { PasswordHasherPort } from '../../../../users/domain/ports/password-hasher.port';
import { EmailVerificationTokenPort } from '../../../domain/ports/email-verification-token.port';
import { verifyAndActivateUserCommand } from './verify-and-activate-user.command';

@CommandHandler(verifyAndActivateUserCommand)
export class VerifyAndActivateUserHandler implements ICommandHandler<
  verifyAndActivateUserCommand,
  void
> {
  constructor(
    private readonly repository: EmailVerificationTokenPort,
    private readonly passwordHasherPort: PasswordHasherPort,
  ) {}

  async execute(command: verifyAndActivateUserCommand): Promise<void> {
    if (!command.token || !command.userId) {
      throw new BadRequestException('El ID y el token son obligatorios');
    }

    const tokenByUser = await this.repository.findByUser(command.userId);

    if (!tokenByUser) {
      throw new CustomError({
        message: 'El token de verificación es inválido, expiró o ya fue utilizado.',
        code: ErrorCode.invalid_verification_email,
      });
    }

    const isValid = await this.passwordHasherPort.verify(command.token, tokenByUser.tokenHash);

    if (!isValid) {
      throw new CustomError({
        message: 'El token de verificación es inválido, expiró o ya fue utilizado.',
        code: ErrorCode.invalid_verification_email,
      });
    }

    await this.repository.verifyAndActivateUser(command.userId);
  }
}
