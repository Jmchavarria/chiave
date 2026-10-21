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
import { ToggleFavoriteVaultHandler } from './application/commands/toggle-favorite-vault/toggle-favorite-vault.handler';

@Module({
  imports: [TypeOrmModule.forFeature([VaultItemsOrmEntity]), CqrsModule],
  controllers: [VaultController],
  providers: [
    CreateVaultHandler,
    FindVaultByUserIdHandler,
    DeleteVaultHandler,
    ToggleFavoriteVaultHandler,
    {
      provide: VaultRepositoryPort,
      useClass: TypeOrmVaultRepository,
    },
  ],
  exports: [],
})
export class VaultModule {}
