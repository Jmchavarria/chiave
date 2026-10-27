import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CustomError } from '../../../../../common/errors/custom.error';
import { ErrorCode } from '../../../../../common/errors/error-code-enum';
import { VaultDE } from '../../../domain/entities/vault.domain-entity';
import { VaultRepositoryPort } from '../../../domain/ports/vault-repository.port';
import { ArchiveVaultCommand } from './archive-vault.command';

@CommandHandler(ArchiveVaultCommand)
export class ArchiveVaultHandler implements ICommandHandler<ArchiveVaultCommand, VaultDE> {
  constructor(private readonly repository: VaultRepositoryPort) {}

  async execute(command: ArchiveVaultCommand): Promise<VaultDE> {
    const { id, userId } = command;
    const vault = await this.repository.findById(id, userId);

    if (!vault) {
      throw new CustomError({ code: ErrorCode.validation_error, message: 'Vault item not found' });
    }

    vault.archive(userId);
    return this.repository.save(vault);
  }
}
