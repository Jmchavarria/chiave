import type { IPagination } from '../../../../common/interfaces/pagination.interface';
import type { Pagination } from '../../../../common/pagintation';
import type { VaultDE } from '../entities/vault.domain-entity';

export interface FindVaultByUserIdProps extends IPagination {
  isFavorite: boolean;
  userId: number;
  search?: string;
}
import type { VaultItemEnumType } from '../../types/vault-item-type.enum';

export interface CreateVaultProps {
  userId: number;
  title: string;
  type: VaultItemEnumType;
  notes?: string;
  folderId?: number;
  isFavorite?: boolean;

  username?: string;
  password?: string;
  authenticatorKey?: string;
  website?: string;

  cardholderName?: string;
  brand?: string;
  number?: string;
  expMonth?: string;
  expYear?: string;
  cvv?: string;

  courtesyTitle?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  identityUsername?: string;
  company?: string;
  ssn?: string;
  passportNumber?: string;
  licenseNumber?: string;
  email?: string;
  phone?: string;
  address1?: string;
  address2?: string;
  address3?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;

  publicKey?: string;
  privateKey?: string;
  fingerPrint?: string;
}

export type UpdateVaultProps = Partial<Omit<CreateVaultProps, 'userId'>>;

export abstract class VaultRepositoryPort {
  abstract save(input: CreateVaultProps): Promise<VaultDE>;
  abstract findByUserId(input: FindVaultByUserIdProps): Promise<Pagination<VaultDE[]>>;
  abstract findById(id: number, userId: number): Promise<VaultDE | null>;
  abstract softDelete(id: number, userId: number): Promise<void>;
}
