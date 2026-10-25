import type { VaultItemEnumType } from '../../types/vault-item-type.enum';

export interface IVault {
  id?: number;
  userId: number;
  folderId?: number;
  title: string;
  type: VaultItemEnumType;
  isFavorite: boolean;

  // Encriptación y Control general
  encryptedData?: string;
  iv?: string;
  authTag?: string;
  notes?: string;

  // ==========================================
  // 1. TIPO LOGIN
  // ==========================================
  username?: string;
  secretValue?: string;
  authenticatorKey?: string;
  website?: string;

  // ==========================================
  // 2. TIPO CARD (TARJETA)
  // ==========================================
  cardholderName?: string;
  brand?: string;
  number?: string;
  expMonth?: string;
  expYear?: string;
  code?: string;

  // ==========================================
  // 3. TIPO IDENTITY (IDENTIDAD)
  // ==========================================
  identityTitle?: string;
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

  // ==========================================
  // 4. TIPO SSH KEY (CLAVE SSH)
  // ==========================================
  publicKey?: string;
  privateKey?: string;

  // Timestamps
  createdAt?: Date;
  updatedAt?: Date;
}
