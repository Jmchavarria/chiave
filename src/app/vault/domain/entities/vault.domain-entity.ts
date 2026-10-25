import { CustomError } from '../../../../common/errors/custom.error';
import { ErrorCode } from '../../../../common/errors/error-code-enum';
import type { VaultItemEnumType } from '../../types/vault-item-type.enum';
import type { IVault } from '../interfaces/vault.interface';

export class VaultDE {
  public id: number;
  public userId: number;
  public folderId?: number;
  public title: string;
  public type: VaultItemEnumType;
  public isFavorite: boolean;
  public encryptedData?: string;
  public secretValue?: string;
  public iv?: string;
  public website?: string;
  public username?: string;
  public notes?: string;
  public authTag?: string;

  // ==========================================
  // CAMPOS ESPECÍFICOS: TIPO CARD
  // ==========================================
  public cardholderName?: string;
  public brand?: string;
  public number?: string;
  public expMonth?: string;
  public expYear?: string;
  public code?: string;

  // ==========================================
  // CAMPOS ESPECÍFICOS: TIPO IDENTITY
  // ==========================================
  public identityTitle?: string;
  public firstName?: string;
  public middleName?: string;
  public lastName?: string;
  public identityUsername?: string;
  public company?: string;
  public ssn?: string;
  public passportNumber?: string;
  public passportExpDate?: string;
  public licenseNumber?: string;
  public identityEmail?: string;
  public phone?: string;
  public address1?: string;
  public address2?: string;
  public city?: string;
  public state?: string;
  public postalCode?: string;
  public country?: string;

  // ==========================================
  // CAMPOS ESPECÍFICOS: TIPO SSH KEY
  // ==========================================
  public publicKey?: string;
  public privateKey?: string;

  public createdAt: Date;
  public updatedAt: Date;

  constructor(attributes: IVault) {
    Object.assign(this, attributes);
  }

  public static create(props: {
    userId: number;
    folderId?: number;
    title: string;
    type: VaultItemEnumType;
    encryptedData?: string;
    iv?: string;
    authTag?: string;
    isFavorite?: boolean;
    notes?: string;

    // Login
    username?: string;
    secretValue?: string;
    authenticatorKey?: string;
    website?: string;

    // Card
    cardholderName?: string;
    brand?: string;
    number?: string;
    expMonth?: string;
    expYear?: string;
    code?: string;

    // Identity
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

    // SSH Key
    publicKey?: string;
    privateKey?: string;
  }): VaultDE {
    if (!props.userId) {
      throw new CustomError({
        code: ErrorCode.validation_error,
        message: 'User ID is required to register a vault item.',
      });
    }

    if (!props.type) {
      throw new CustomError({
        code: ErrorCode.validation_error,
        message: 'Item type is required.',
      });
    }

    if (!props.title || props.title.trim() === '') {
      throw new CustomError({
        code: ErrorCode.validation_error,
        message: 'Title is required for a vault item.',
      });
    }

    const now = new Date();

    return new VaultDE({
      userId: props.userId,
      folderId: props.folderId,
      title: props.title,
      type: props.type,
      encryptedData: props.encryptedData,
      iv: props.iv,
      authTag: props.authTag,
      isFavorite: props.isFavorite ?? false,
      notes: props.notes,

      // Login
      username: props.username,
      secretValue: props.secretValue,
      authenticatorKey: props.authenticatorKey,
      website: props.website,

      // Card
      cardholderName: props.cardholderName,
      brand: props.brand,
      number: props.number,
      expMonth: props.expMonth,
      expYear: props.expYear,
      code: props.code,

      // Identity
      identityTitle: props.identityTitle,
      firstName: props.firstName,
      middleName: props.middleName,
      lastName: props.lastName,
      identityUsername: props.identityUsername,
      company: props.company,
      ssn: props.ssn,
      passportNumber: props.passportNumber,
      passportExpDate: props.passportExpDate,
      licenseNumber: props.licenseNumber,
      identityEmail: props.identityEmail,
      phone: props.phone,
      address1: props.address1,
      address2: props.address2,
      city: props.city,
      state: props.state,
      postalCode: props.postalCode,
      country: props.country,

      // SSH Key
      publicKey: props.publicKey,
      privateKey: props.privateKey,

      createdAt: now,
      updatedAt: now,
    });
  }

  public update(props: Partial<Omit<IVault, 'id' | 'userId' | 'createdAt'>>): void {
    if (props.title !== undefined) {
      if (!props.title.trim()) {
        throw new CustomError({
          code: ErrorCode.validation_error,
          message: 'Title cannot be empty.',
        });
      }
      this.title = props.title;
    }

    if (props.type !== undefined) {
      this.type = props.type;
    }

    if (props.folderId !== undefined) {
      this.folderId = props.folderId;
    }

    if (props.isFavorite !== undefined) {
      this.isFavorite = props.isFavorite;
    }

    // 🟢 Lista de campos opcionales tipados de forma segura
    const allowedKeys: Array<keyof IVault> = [
      'encryptedData',
      'iv',
      'authTag',
      'secretValue',
      'website',
      'username',
      'notes',
      'cardholderName',
      'brand',
      'number',
      'expMonth',
      'expYear',
      'code',
      'identityTitle',
      'firstName',
      'middleName',
      'lastName',
      'identityUsername',
      'company',
      'ssn',
      'passportNumber',
      'passportExpDate',
      'licenseNumber',
      'identityEmail',
      'phone',
      'address1',
      'address2',
      'city',
      'state',
      'postalCode',
      'country',
      'publicKey',
      'privateKey',
    ];

    for (const key of allowedKeys) {
      if (props[key] !== undefined) {
        // Se usa Record<string, unknown> para evitar el tipo 'any' que rechaza ESLint
        (this as Record<string, unknown>)[key] = props[key];
      }
    }

    this.updatedAt = new Date();
  }

  public static reconstitute(props: IVault): VaultDE {
    return new VaultDE(props);
  }
}
