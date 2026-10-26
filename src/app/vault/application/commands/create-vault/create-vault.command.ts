import type { VaultItemEnumType } from '../../../types/vault-item-type.enum';

export interface CreateVaultCommandPayload {
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

export class CreateVaultCommand {
  constructor(
    public readonly userId: number,
    public readonly payload: CreateVaultCommandPayload,
  ) {}
}
