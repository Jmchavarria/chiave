import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { VaultRepositoryPort } from '../../../domain/ports/vault-repository.port';
import { FindVaultByIdQuery } from '../../queries/find-vault-by-id/find-vault-by-id.query';
import { DeleteVaultCommand } from './delete-vault.command';

@CommandHandler(DeleteVaultCommand)
export class DeleteVaultHandler implements ICommandHandler<DeleteVaultCommand> {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly repository: VaultRepositoryPort,
  ) {}

  async execute(command: DeleteVaultCommand): Promise<void> {
    // 1. Validar existencia y propiedad del elemento mediante QueryBus
    await this.queryBus.execute(new FindVaultByIdQuery(command.id, command.userId));

    // 2. Ejecutar el borrado lógico a través del puerto
    await this.repository.softDelete(command.id, command.userId);
  }
}
