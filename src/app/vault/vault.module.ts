import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VaultController } from './infrastructure/http/vault.controller';
import { VaultRepositoryPort } from './domain/ports/vault-repository.port';
import { SoftDeleteVaultHandler } from './application/commands/soft-delete-vault/soft-delete-vault.handler';
import { RestoreVaultHandler } from './application/commands/restore-vault/restore-vault.handler';
import { DeleteVaultHandler } from './application/commands/delete-vault/delete-vault.handler';
import { TypeOrmVaultRepository } from './infrastructure/persistence/typeorm-vault.repository';
import { VaultItemsOrmEntity } from './infrastructure/persistence/vault-item.orm-entity';
import { FindTrashVaultsHandler } from './application/queries/find-trash-vaults/find-trash-vaults.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([VaultItemsOrmEntity]), CqrsModule, AuthModule, UsersModule],
  controllers: [VaultController],
  providers: [
    {
      provide: VaultRepositoryPort,
      useClass: TypeOrmVaultRepository,
    },
    SoftDeleteVaultHandler,
    RestoreVaultHandler,
    DeleteVaultHandler,
    FindTrashVaultsHandler,
  ],
  exports: [VaultRepositoryPort, TypeOrmModule],
})
export class VaultModule {}
