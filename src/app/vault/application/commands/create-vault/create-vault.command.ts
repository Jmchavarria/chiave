import type { VaultItemEnumType } from '../../../types/vault-item-type.enum';

export interface CreateVaultCommandPayload {
  title: string;
  type: VaultItemEnumType;
  notes?: string;
  folderId?: number;
  isFavorite?: boolean;

  // Login
  username?: string;
  password?: string;
  authenticatorKey?: string;
  website?: string;

  // Card
  cardholderName?: string;
  number?: string;
  brand?: string;
  expMonth?: string;
  expYear?: string;
  cvv?: string;

  // Identity
  courtesyTitle?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  identityUsername?: string;
  company?: string;
  ssn?: string;
  passportNumber?: string;
  passportExpDate?: string;
  licenseNumber?: string;
  identityEmail?: string;
  phone?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;

  // SSH Key
  publicKey?: string;
  privateKey?: string;
}

export class CreateVaultCommand {
  constructor(
    public readonly userId: number,
    public readonly payload: CreateVaultCommandPayload,
  ) {}
}
