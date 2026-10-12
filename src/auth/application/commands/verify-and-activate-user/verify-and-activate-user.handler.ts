import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';
import { verifyAndActivateUserCommand } from './verify-and-activate-user.command';
import { EmailVerificationTokenPort } from '../../../domain/ports/email-verification-token.port';

@CommandHandler(verifyAndActivateUserCommand)
export class VerifyAndActivateUserHandler implements ICommandHandler<
  verifyAndActivateUserCommand,
  void
> {
  constructor(private readonly repository: EmailVerificationTokenPort) {}
  execute(command: verifyAndActivateUserCommand): Promise<void> {
    return this.repository.verifyAndActivateUser(command.token);
  }
}
