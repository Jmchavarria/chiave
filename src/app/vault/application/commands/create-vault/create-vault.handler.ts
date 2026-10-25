import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { VaultDE } from '../../../domain/entities/vault.domain-entity';
import { VaultRepositoryPort } from '../../../domain/ports/vault-repository.port';
import { CreateVaultCommand } from './create-vault.command';
import { EncryptionPort } from '../../../domain/ports/encryption-repository.port';
import { VaultItemEnumType } from '../../../types/vault-item-type.enum';

@CommandHandler(CreateVaultCommand)
export class CreateVaultHandler implements ICommandHandler<CreateVaultCommand, VaultDE> {
  constructor(
    private readonly repository: VaultRepositoryPort,
    private readonly encryptionPort: EncryptionPort,
  ) {}

  execute(command: CreateVaultCommand): Promise<VaultDE> {
    const { secretValue, title, type, isFavorite, userId } = command;
    const { authTag, encryptedData, iv } = this.encryptionPort.encrypt(command.secretValue);
    const newItem = VaultDE.create({
      userId,
      authTag,
      encryptedData,
      iv,
      secretValue,
      title,
      type: type ?? VaultItemEnumType.LOGIN,
      isFavorite: isFavorite ?? false,
    });

    return this.repository.save(newItem);
  }
}
