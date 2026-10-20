import type { VaultItemEnumType } from '../../../types/vault-item.type';

export class CreateVaultCommand {
  constructor(
    public readonly userId: number,
    public readonly type: VaultItemEnumType,
    public readonly encryptedData: string,
    public readonly iv: string,
    public readonly authTag: string,
    public readonly isFavorite?: boolean,
  ) {}

  toPayload() {
    return {
      userId: this.userId,
      type: this.type,
      encryptedData: this.encryptedData,
      iv: this.iv,
      authTag: this.authTag,
      isFavorite: this.isFavorite,
    };
  }
}
