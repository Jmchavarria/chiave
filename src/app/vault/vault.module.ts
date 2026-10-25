import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VaultItemsOrmEntity } from './infrastructure/persistence/vault-item.orm-entity';
import { VaultRepositoryPort } from './domain/ports/vault-repository.port';
import { TypeOrmVaultRepository } from './infrastructure/persistence/typeorm-vault.repository';
import { CreateVaultHandler } from './application/commands/create-vault/create-vault.handler';
import { FindVaultByUserIdHandler } from './application/queries/find-vault-by-user-id/find-vault-by-user-id.handler';
import { VaultController } from './infrastructure/http/vault.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { DeleteVaultHandler } from './application/commands/delete-vault/delete-vault.handler';
import { EncryptionPort } from './domain/ports/encryption-repository.port';
import { EncryptionAdapter } from './infrastructure/persistence/encryption.adapter';
import { UpdateVaultHandler } from './application/commands/update-vault/update-vault.handler';
import { FindVaultByIdHandler } from './application/queries/find-vault-by-id/find-vault-by-id.handler';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([VaultItemsOrmEntity]), CqrsModule, AuthModule],
  controllers: [VaultController],
  providers: [
    CreateVaultHandler,
    FindVaultByUserIdHandler,
    DeleteVaultHandler,
    UpdateVaultHandler,
    FindVaultByIdHandler,
    {
      provide: VaultRepositoryPort,
      useClass: TypeOrmVaultRepository,
    },
    {
      provide: EncryptionPort,
      useClass: EncryptionAdapter,
    },
  ],
  exports: [],
})
export class VaultModule {}
