import { VaultDE } from '../../domain/entities/vault.domain-entity';
import type { VaultOrmEntity } from '../persistence/vault-item.orm-entity';

export class VaultMapper {
  static toDomain(vault: VaultOrmEntity): VaultDE {
    return VaultDE.create({
      authTag: vault.authTag,
      encryptedData: vault.encryptedData,
      isFavorite: vault.isFavorite,
      iv: vault.iv,
      type: vault.type,
      userId: vault.userId,
    });
  }

  static toReconstituite(vault: VaultOrmEntity): VaultDE {
    return VaultDE.reconstitute({
      id: vault.id,
      authTag: vault.authTag,
      encryptedData: vault.encryptedData,
      isFavorite: vault.isFavorite,
      iv: vault.iv,
      type: vault.type,
      userId: vault.userId,
      createdAt: vault.createdAt,
      updatedAt: vault.updatedAt,
    });
  }
}
