import type { IPagination } from '../../../../common/interfaces/pagination.interface';
import type { Pagination } from '../../../../common/pagintation';
import type { VaultDE } from '../entities/vault.domain-entity';

export interface FindVaultByUserIdProps extends IPagination {
  isFavorite: boolean;
  userId: number;
  search?: string;
}
export interface CreateVaultProps {
  userId: number;
  title: string;
  secretValue: string;
  type?: string;
  username?: string | null;
  website?: string | null;
  notes?: string | null;
  isFavorite?: boolean;
}

export type UpdateVaultProps = Partial<Omit<CreateVaultProps, 'userId'>>;

export abstract class VaultRepositoryPort {
  abstract save(input: CreateVaultProps): Promise<VaultDE>;
  abstract findByUserId(input: FindVaultByUserIdProps): Promise<Pagination<VaultDE[]>>;
  abstract findById(id: number, userId: number): Promise<VaultDE | null>;
  abstract softDelete(id: number, userId: number): Promise<void>;
}
