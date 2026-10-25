import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { UpdateVaultCommand } from './update-vault.command';
import { VaultDE } from '../../../domain/entities/vault.domain-entity';
import { FindVaultByIdQuery } from '../../queries/find-vault-by-id/find-vault-by-id.query';
import { VaultRepositoryPort } from '../../../domain/ports/vault-repository.port';

@CommandHandler(UpdateVaultCommand)
export class UpdateVaultHandler implements ICommandHandler<UpdateVaultCommand, VaultDE> {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly repository: VaultRepositoryPort,
  ) {}

  async execute(command: UpdateVaultCommand): Promise<VaultDE> {
    const { id, userId, payload } = command;

    const existingItem: VaultDE = await this.queryBus.execute(new FindVaultByIdQuery(id, userId));

    existingItem.update(payload, userId);

    return this.repository.save(existingItem);
  }
}
