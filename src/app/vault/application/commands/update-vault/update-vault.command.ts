import type { VaultItemEnumType } from '../../../types/vault-item.type';

export class UpdateVaultCommand {
  constructor(
    public readonly id: number,
    public readonly userId: number,
    public readonly type?: VaultItemEnumType,
    public readonly encryptedData?: string,
    public readonly iv?: string,
    public readonly authTag?: string,
    public readonly isFavorite?: boolean,
  ) {}
}
