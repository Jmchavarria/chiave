import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { VaultDE } from '../../../domain/entities/vault.domain-entity';
import { VaultRepositoryPort } from '../../../domain/ports/vault-repository.port';
import { CreateVaultCommand } from './create-vault.command';

@CommandHandler(CreateVaultCommand)
export class CreateVaultHandler implements ICommandHandler<CreateVaultCommand, VaultDE> {
  constructor(private readonly repository: VaultRepositoryPort) {}

  execute(command: CreateVaultCommand): Promise<VaultDE> {
    const vault = VaultDE.create({
      userId: command.userId,
      authTag: command.authTag,
      isFavorite: command.isFavorite,
      type: command.type,
      iv: command.iv,
      encryptedData: command.encryptedData,
    });

    return this.repository.save(vault);
  }
}
