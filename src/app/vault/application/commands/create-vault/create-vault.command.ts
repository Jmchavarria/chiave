import type { VaultItemType } from '../../../types/vault-item.type';

export class CreateVaultCommand {
  constructor(
    public userId: number,
    public type: VaultItemType,
    public isFavorite: boolean,
    public encryptedData: string,
    public iv: string,
    public authTag: string,
  ) {}
}
