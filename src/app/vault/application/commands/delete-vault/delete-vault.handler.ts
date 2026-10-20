import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { VaultRepositoryPort } from '../../../domain/ports/vault-repository.port';
import { DeleteVaultCommand } from './delete-vault.command';

@CommandHandler(DeleteVaultCommand)
export class DeleteVaultHandler implements ICommandHandler<DeleteVaultCommand> {
  constructor(private readonly vaultRepository: VaultRepositoryPort) {}

  async execute(command: DeleteVaultCommand): Promise<boolean> {
    const deleted = await this.vaultRepository.delete(command.id, command.userId);
    if (!deleted) {
      throw new NotFoundException('El elemento de la bóveda no existe o no pertenece al usuario');
    }
    return true;
  }
}
