import { CustomError } from '../../../../common/errors/custom.error';
import { ErrorCode } from '../../../../common/errors/error-code-enum';
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
      throw new CustomError({
        code: ErrorCode.validation_error,
        message: 'User ID is required to register a vault item.',
      });
    }

    if (!props.type) {
      throw new CustomError({
        code: ErrorCode.validation_error,
        message: 'Item type (LOGIN, NOTE, CARD) is required.',
      });
    }

    if (!props.encryptedData || props.encryptedData.trim() === '') {
      throw new CustomError({
        code: ErrorCode.validation_error,
        message: 'Encrypted payload (encryptedData) cannot be empty.',
      });
    }

    if (!props.iv || props.iv.trim() === '') {
      throw new CustomError({
        code: ErrorCode.validation_error,
        message: 'Initialization vector (iv) is required for AES-256-GCM encryption.',
      });
    }

    if (!props.authTag || props.authTag.trim() === '') {
      throw new CustomError({
        code: ErrorCode.validation_error,
        message: 'Authentication tag (authTag) is required to verify integrity.',
      });
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

  public update(props: Partial<Omit<IVault, 'id' | 'userId' | 'createdAt'>>): void {
    if (props.type !== undefined) {
      this.type = props.type;
    }

    if (props.encryptedData !== undefined) {
      if (!props.encryptedData.trim()) {
        throw new CustomError({
          code: ErrorCode.validation_error,
          message: 'Encrypted payload (encryptedData) cannot be empty.',
        });
      }
      this.encryptedData = props.encryptedData;
    }

    if (props.iv !== undefined) {
      if (!props.iv.trim()) {
        throw new CustomError({
          code: ErrorCode.validation_error,
          message: 'Initialization vector (iv) cannot be empty.',
        });
      }
      this.iv = props.iv;
    }

    if (props.authTag !== undefined) {
      if (!props.authTag.trim()) {
        throw new CustomError({
          code: ErrorCode.validation_error,
          message: 'Authentication tag (authTag) cannot be empty.',
        });
      }
      this.authTag = props.authTag;
    }

    if (props.isFavorite !== undefined) {
      this.isFavorite = props.isFavorite;
    }

    this.updatedAt = new Date();
  }

  public toggleFavorite(): void {
    this.isFavorite = !this.isFavorite;
  }

  public static reconstitute(props: IVault): VaultDE {
    return new VaultDE(props);
  }
}
