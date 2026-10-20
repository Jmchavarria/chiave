import type { VaultItemEnumType } from '../../types/vault-item.type';

export interface IVault {
  id?: number;
  userId: number;
  type: VaultItemEnumType;
  isFavorite: boolean;
  encryptedData: string;
  iv: string;
  authTag: string;
  createdAt?: Date;
  updatedAt?: Date;
}
