import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CustomError } from '../../../../../common/errors/custom.error';
import { ErrorCode } from '../../../../../common/errors/error-code-enum';
import { VaultDE } from '../../../domain/entities/vault.domain-entity';
import { VaultRepositoryPort } from '../../../domain/ports/vault-repository.port';
import { UnarchiveVaultCommand } from './unarchive-vault.command';

@CommandHandler(UnarchiveVaultCommand)
export class UnarchiveVaultHandler implements ICommandHandler<UnarchiveVaultCommand, VaultDE> {
  constructor(private readonly repository: VaultRepositoryPort) {}

  async execute(command: UnarchiveVaultCommand): Promise<VaultDE> {
    const { id, userId } = command;
    const vault = await this.repository.findById(id, userId);

    if (!vault) {
      throw new CustomError({ code: ErrorCode.validation_error, message: 'Vault item not found' });
    }

    vault.unarchive(userId);
    return this.repository.save(vault);
  }
}
