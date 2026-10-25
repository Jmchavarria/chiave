import type { VaultItemEnumType } from '../../../types/vault-item-type.enum';

export class CreateVaultCommand {
  constructor(
    public readonly userId: number,
    public readonly title: string,
    public readonly username: string,
    public readonly secretValue: string,
    public readonly type: VaultItemEnumType,
    public readonly website?: string,
    public readonly notes?: string,
    public readonly isFavorite?: boolean,
  ) {}
}
