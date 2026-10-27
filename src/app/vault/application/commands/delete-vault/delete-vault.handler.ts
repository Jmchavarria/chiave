import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteVaultCommand } from './delete-vault.command';
import { VaultRepositoryPort } from '../../../domain/ports/vault-repository.port';
import { CustomError } from '../../../../../common/errors/custom.error';
import { ErrorCode } from '../../../../../common/errors/error-code-enum';

@CommandHandler(DeleteVaultCommand)
export class DeleteVaultHandler implements ICommandHandler<DeleteVaultCommand, void> {
  constructor(private readonly repository: VaultRepositoryPort) {}

  async execute(command: DeleteVaultCommand): Promise<void> {
    const { id, userId } = command;

    const vault = await this.repository.findById(id, userId);
    if (!vault) {
      throw new CustomError({
        code: ErrorCode.vault_not_found,
        message: 'Vault item not found',
      });
    }

    vault.validateOwner(userId, 'delete');

    await this.repository.delete(id);
  }
}
