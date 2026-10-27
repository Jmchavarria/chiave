import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateVaultCommand } from './update-vault.command';
import { VaultDE } from '../../../domain/entities/vault.domain-entity';
import { VaultRepositoryPort } from '../../../domain/ports/vault-repository.port';
import { CustomError } from '../../../../../common/errors/custom.error';
import { ErrorCode } from '../../../../../common/errors/error-code-enum';

@CommandHandler(UpdateVaultCommand)
export class UpdateVaultHandler implements ICommandHandler<UpdateVaultCommand, VaultDE> {
  constructor(private readonly repository: VaultRepositoryPort) {}

  async execute(command: UpdateVaultCommand): Promise<VaultDE> {
    const { id, userId, payload } = command;

    const existingItem = await this.repository.findById(id, userId);

    if (!existingItem)
      throw new CustomError({
        code: ErrorCode.validation_error,
        message: 'error',
      });

    existingItem.update(payload, userId);

    return this.repository.save(existingItem);
  }
}
