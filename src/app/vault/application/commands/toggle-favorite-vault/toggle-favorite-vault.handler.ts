import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { VaultDE } from '../../../domain/entities/vault.domain-entity';
import { VaultRepositoryPort } from '../../../domain/ports/vault-repository.port';
import { FindVaultByIdQuery } from '../../queries/find-vault-by-id/find-vault-by-id.query';
import { ToggleFavoriteVaultCommand } from './toggle-favorite-vault.command';

@CommandHandler(ToggleFavoriteVaultCommand)
export class ToggleFavoriteVaultHandler implements ICommandHandler<
  ToggleFavoriteVaultCommand,
  VaultDE
> {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly repository: VaultRepositoryPort,
  ) {}

  async execute(command: ToggleFavoriteVaultCommand): Promise<VaultDE> {
    const vault: VaultDE = await this.queryBus.execute(
      new FindVaultByIdQuery(command.id, command.userId),
    );

    vault.toggleFavorite();

    return this.repository.save(vault);
  }
}
