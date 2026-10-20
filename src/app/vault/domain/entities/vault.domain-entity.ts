import type { VaultItemEnumType } from '../../types/vault-item.type';
import type { IVault } from '../interfaces/vault.interface';

export class VaultDE {
  public id: number;
  public userId: number;
  public type: VaultItemEnumType;
  public isFavorite: boolean;
  public encryptedData: string;
  public iv: string;
  public authTag: string;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(attributes: IVault) {
    Object.assign(this, attributes);
  }

  public static create(props: {
    userId: number;
    type: VaultItemEnumType;
    encryptedData: string;
    iv: string;
    authTag: string;
    isFavorite?: boolean;
  }): VaultDE {
    if (!props.userId) {
      throw new Error('User ID is required to register a vault item.');
    }

    if (!props.type) {
      throw new Error('Item type (LOGIN, NOTE, CARD) is required.');
    }

    if (!props.encryptedData || props.encryptedData.trim() === '') {
      throw new Error('Encrypted payload (encryptedData) cannot be empty.');
    }

    if (!props.iv || props.iv.trim() === '') {
      throw new Error('Initialization vector (iv) is required for AES-256-GCM encryption.');
    }

    if (!props.authTag || props.authTag.trim() === '') {
      throw new Error('Authentication tag (authTag) is required to verify integrity.');
    }

    const now = new Date();

    return new VaultDE({
      userId: props.userId,
      type: props.type,
      encryptedData: props.encryptedData,
      iv: props.iv,
      authTag: props.authTag,
      isFavorite: props.isFavorite ?? false,
      createdAt: now,
      updatedAt: now,
    });
  }

  static reconstitute(props: IVault): VaultDE {
    return new VaultDE(props);
  }
}
