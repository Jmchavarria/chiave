import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from './create-user.command';
import { UserDE } from '../../../domain/entities/user.domain-entity';
import { UserRepositoryPort } from '../../../domain/ports/user-repository.port';
import { CustomError } from '../../../../common/errors/custom.error';
import { ErrorCode } from '../../../../common/errors/error-code-enum';
import { PasswordHasherPort } from '../../../domain/ports/password-hasher.port';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand, UserDE> {
  constructor(
    private readonly repository: UserRepositoryPort,
    private readonly passwordHasher: PasswordHasherPort,
  ) {}

  async execute(command: CreateUserCommand): Promise<UserDE> {
    const existingUser = await this.repository.findByEmail(command.email);

    if (existingUser) {
      throw new CustomError({
        code: ErrorCode.user_already_exist,
        message: 'user_already_exist',
      });
    }

    const passwordHash = await this.passwordHasher.hash(command.password);

    const user = UserDE.create({
      name: command.name,
      email: command.email,
      passwordHash,
      status: 'PENDING_VERIFICATION',
      emailVerifiedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return this.repository.save(user);
  }
}
