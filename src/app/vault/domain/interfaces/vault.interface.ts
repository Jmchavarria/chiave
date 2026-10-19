import type { VaultItemType } from '../../types/vault-item.type';

export interface IVault {
  id?: number;
  userId: number;
  type: VaultItemType;
  isFavorite: boolean;
  encryptedData: string;
  iv: string;
  authTag: string;
  createdAt?: Date;
  updatedAt?: Date;
}
