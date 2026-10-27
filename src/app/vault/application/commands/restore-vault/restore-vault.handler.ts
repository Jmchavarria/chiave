import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RestoreVaultCommand } from './restore-vault.command';
import { VaultRepositoryPort } from '../../../domain/ports/vault-repository.port';
import { VaultDE } from '../../../domain/entities/vault.domain-entity';
import { CustomError } from '../../../../../common/errors/custom.error';
import { ErrorCode } from '../../../../../common/errors/error-code-enum';

@CommandHandler(RestoreVaultCommand)
export class RestoreVaultHandler implements ICommandHandler<RestoreVaultCommand, VaultDE> {
  constructor(private readonly repository: VaultRepositoryPort) {}

  async execute(command: RestoreVaultCommand): Promise<VaultDE> {
    const { id, userId } = command;

    const vault = await this.repository.findById(id, userId);
    if (!vault) {
      throw new CustomError({
        code: ErrorCode.vault_not_found,
        message: 'Vault item not found',
      });
    }

    vault.restore(userId);
    return this.repository.save(vault);
  }
}
