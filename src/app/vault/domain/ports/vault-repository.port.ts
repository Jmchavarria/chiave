import type { IPagination } from '../../../../common/interfaces/pagination.interface';
import type { Pagination } from '../../../../common/pagintation';
import type { VaultDE } from '../entities/vault.domain-entity';

export interface FindVaultByUserIdProps extends IPagination {
  isFavorite: boolean;
  userId: number;
  search?: string;
}

export abstract class VaultRepositoryPort {
  abstract save(input: VaultDE): Promise<VaultDE>;
  abstract findByUserId(input: FindVaultByUserIdProps): Promise<Pagination<VaultDE[]>>;
}
