import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateVaultCommand } from './create-vault.command';
import { VaultDE } from '../../../domain/entities/vault.domain-entity';
import { VaultRepositoryPort } from '../../../domain/ports/vault-repository.port';

@CommandHandler(CreateVaultCommand)
export class CreateVaultHandler implements ICommandHandler<CreateVaultCommand, VaultDE> {
  constructor(private readonly vaultRepository: VaultRepositoryPort) {}

  async execute(command: CreateVaultCommand): Promise<VaultDE> {
    const { userId, payload } = command;

    const vault = VaultDE.create({
      userId,
      ...payload,
    });

    return this.vaultRepository.save(vault);
  }
}
