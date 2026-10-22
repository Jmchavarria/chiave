import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { UpdateVaultCommand } from './update-vault.command';
import { VaultDE } from '../../../domain/entities/vault.domain-entity';
import { FindVaultByIdQuery } from '../../queries/find-vault-by-id/find-vault-by-id.query';
import { VaultRepositoryPort } from '../../../domain/ports/vault-repository.port';
import { EncryptionPort } from '../../../domain/ports/encryption-repository.port';

@CommandHandler(UpdateVaultCommand)
export class UpdateVaultHandler implements ICommandHandler<UpdateVaultCommand> {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly repository: VaultRepositoryPort,
    private readonly encryptionPort: EncryptionPort,
  ) {}

  async execute(command: UpdateVaultCommand): Promise<VaultDE> {
    const { id, userId, isFavorite, secretValue, type } = command;
    const existingItem: VaultDE = await this.queryBus.execute(new FindVaultByIdQuery(id, userId));

    if (secretValue) {
      const { encryptedData, iv, authTag } = this.encryptionPort.encrypt(secretValue);
      existingItem.update({
        type,
        encryptedData,
        iv,
        authTag,
        isFavorite,
      });
    }

    return this.repository.save(existingItem);
  }
}
