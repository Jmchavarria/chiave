import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SoftDeleteVaultCommand } from './soft-delete-vault.command';
import { VaultRepositoryPort } from '../../../domain/ports/vault-repository.port';
import { VaultDE } from '../../../domain/entities/vault.domain-entity';
import { CustomError } from '../../../../../common/errors/custom.error';
import { ErrorCode } from '../../../../../common/errors/error-code-enum';

@CommandHandler(SoftDeleteVaultCommand)
export class SoftDeleteVaultHandler implements ICommandHandler<SoftDeleteVaultCommand, VaultDE> {
  constructor(private readonly repository: VaultRepositoryPort) {}

  async execute(command: SoftDeleteVaultCommand): Promise<VaultDE> {
    const { id, userId } = command;

    const vault = await this.repository.findById(id, userId);
    if (!vault) {
      throw new CustomError({
        code: ErrorCode.vault_not_found,
        message: 'Vault item not found',
      });
    }

    vault.softDelete(userId);
    return this.repository.save(vault);
  }
}
