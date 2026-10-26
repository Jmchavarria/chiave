import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateVaultCommand } from './create-vault.command';
import { VaultDE } from '../../../domain/entities/vault.domain-entity';
import { VaultRepositoryPort } from '../../../domain/ports/vault-repository.port';
import { EncryptionPort } from '../../../domain/ports/encryption-repository.port';

@CommandHandler(CreateVaultCommand)
export class CreateVaultHandler implements ICommandHandler<CreateVaultCommand, VaultDE> {
  constructor(
    private readonly vaultRepository: VaultRepositoryPort,
    private readonly encryptionPort: EncryptionPort,
  ) {}

  async execute(command: CreateVaultCommand): Promise<VaultDE> {
    const { userId, payload } = command;
    const { password, ...restPayload } = payload;

    let encryptedPassword: string | undefined;
    let iv: string | undefined;
    let authTag: string | undefined;

    if (password) {
      const encrypted = this.encryptionPort.encrypt(password);
      encryptedPassword = encrypted.encryptedData;
      iv = encrypted.iv;
      authTag = encrypted.authTag;
    }

    const vault = VaultDE.create({
      userId,
      ...restPayload,
      password: encryptedPassword,
      iv,
      authTag,
    });

    return this.vaultRepository.save(vault);
  }
}
