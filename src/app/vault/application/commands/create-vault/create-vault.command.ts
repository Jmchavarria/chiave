import type { VaultItemEnumType } from '../../../types/vault-item.type';

export class CreateVaultCommand {
  constructor(
    public readonly userId: number,
    public readonly title: string,
    public readonly secretValue: string,
    public readonly type?: VaultItemEnumType,
    public readonly isFavorite?: boolean,
  ) {}
}
