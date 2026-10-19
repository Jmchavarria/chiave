import type { VaultDE } from '../entities/vault.domain-entity';

export abstract class VaultRepositoryPort {
  abstract save(input: VaultDE): Promise<VaultDE>;
}
