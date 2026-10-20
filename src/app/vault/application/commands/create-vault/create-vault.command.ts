import type { VaultItemEnumType } from '../../../types/vault-item.type';

export class CreateVaultCommand {
  constructor(
    public userId: number,
    public type: VaultItemEnumType,
    public isFavorite: boolean,
    public encryptedData: string,
    public iv: string,
    public authTag: string,
  ) {}
}
