import type { VaultItemEnumType } from '../../../types/vault-item-type.enum';

export class UpdateVaultCommand {
  constructor(
    public readonly id: number,
    public readonly userId: number,
    public readonly secretValue?: string,
    public readonly isFavorite?: boolean,
    public readonly type?: VaultItemEnumType,
  ) {}
}
