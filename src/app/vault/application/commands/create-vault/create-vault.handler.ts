import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateVaultCommand } from './create-vault.command';
import { VaultDE } from '../../../domain/entities/vault.domain-entity';
import { VaultRepositoryPort } from '../../../domain/ports/vault-repository.port';
import { VaultItemEnumType } from '../../../types/vault-item-type.enum';
import { PasswordHasherPort } from '../../../../users/domain/ports/password-hasher.port';

@CommandHandler(CreateVaultCommand)
export class CreateVaultHandler implements ICommandHandler<CreateVaultCommand, VaultDE> {
  constructor(
    private readonly vaultRepository: VaultRepositoryPort,
    private readonly hashingPort: PasswordHasherPort,
  ) {}

  async execute(command: CreateVaultCommand): Promise<VaultDE> {
    const { userId, payload } = command;

    const { password, ...restPayload } = payload;

    let passwordHash: string | undefined;

    if (payload.type === VaultItemEnumType.LOGIN && password) {
      passwordHash = await this.hashingPort.hash(password);
    }

    const vault = VaultDE.create({
      userId,
      ...restPayload,
      passwordHash,
    });

    return this.vaultRepository.save(vault);
  }
}
