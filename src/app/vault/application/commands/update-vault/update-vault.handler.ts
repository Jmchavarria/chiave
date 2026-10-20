import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { UpdateVaultCommand } from './update-vault.command';
import { VaultDE } from '../../../domain/entities/vault.domain-entity';
import { FindVaultByIdQuery } from '../../queries/find-vault-by-id/find-vault-by-id.query';
import { VaultRepositoryPort } from '../../../domain/ports/vault-repository.port';

@CommandHandler(UpdateVaultCommand)
export class UpdateVaultHandler implements ICommandHandler<UpdateVaultCommand> {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly repository: VaultRepositoryPort,
  ) {}

  async execute(command: UpdateVaultCommand): Promise<VaultDE> {
    const existingVault: VaultDE = await this.queryBus.execute(
      new FindVaultByIdQuery(command.id, command.userId),
    );

    existingVault.update({
      type: command.type,
      encryptedData: command.encryptedData,
      iv: command.iv,
      authTag: command.authTag,
      isFavorite: command.isFavorite,
    });

    return this.repository.save(existingVault);
  }
}
