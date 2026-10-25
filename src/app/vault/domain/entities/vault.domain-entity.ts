import { CustomError } from '../../../../common/errors/custom.error';
import { ErrorCode } from '../../../../common/errors/error-code-enum';
import { VaultItemEnumType } from '../../types/vault-item-type.enum';
import type { IVaultItems } from '../interfaces/vault.interface';

type CreateVaultProps = Omit<IVaultItems, 'id' | 'createdAt' | 'updatedAt' | 'isFavorite'> & {
  isFavorite?: boolean;
};

type UpdateVaultProps = Partial<Omit<IVaultItems, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>;

export class VaultDE implements IVaultItems {
  public id!: number;
  public userId!: number;
  public folderId?: number;
  public type!: VaultItemEnumType;
  public title!: string;
  public isFavorite!: boolean;
  public notes?: string;

  public username?: string;
  public password?: string;
  public authenticatorKey?: string;
  public website?: string;

  public cardholderName?: string;
  public brand?: string;
  public number?: string;
  public expMonth?: string;
  public expYear?: string;
  public cvv?: string;

  public courtesyTitle?: string;
  public firstName?: string;
  public middleName?: string;
  public lastName?: string;
  public identityUsername?: string;
  public company?: string;
  public ssn?: string;
  public passportNumber?: string;
  public licenseNumber?: string;
  public email?: string;
  public phone?: string;
  public address1?: string;
  public address2?: string;
  public address3?: string;
  public city?: string;
  public state?: string;
  public postalCode?: string;
  public country?: string;

  public publicKey?: string;
  public privateKey?: string;
  public fingerPrint?: string;

  public createdAt!: Date;
  public updatedAt!: Date;

  private constructor(attributes: Partial<IVaultItems>) {
    Object.assign(this, attributes);
  }

  public static create(props: CreateVaultProps): VaultDE {
    if (!Number.isInteger(props.userId) || props.userId <= 0) {
      throw new CustomError({
        code: ErrorCode.validation_error,
        message: 'A valid user ID is required to register a vault item.',
      });
    }

    if (!Object.values(VaultItemEnumType).includes(props.type)) {
      throw new CustomError({
        code: ErrorCode.validation_error,
        message: 'A valid item type is required.',
      });
    }

    if (!props.title?.trim()) {
      throw new CustomError({
        code: ErrorCode.validation_error,
        message: 'Title is required for a vault item.',
      });
    }

    const now = new Date();

    return new VaultDE({
      ...props,
      title: props.title.trim(),
      isFavorite: props.isFavorite ?? false,
      createdAt: now,
      updatedAt: now,
    });
  }

  public update(props: UpdateVaultProps, requesterUserId: number): void {
    if (!Number.isInteger(requesterUserId) || requesterUserId <= 0) {
      throw new CustomError({
        code: ErrorCode.validation_error,
        message: 'A valid user ID is required to update a vault item.',
      });
    }

    if (requesterUserId !== this.userId) {
      throw new CustomError({
        code: ErrorCode.validation_error,
        message: 'You are not authorized to update this vault item.',
      });
    }

    if (props.title !== undefined) {
      if (!props.title.trim()) {
        throw new CustomError({
          code: ErrorCode.validation_error,
          message: 'Title cannot be empty.',
        });
      }

      props.title = props.title.trim();
    }

    if (props.type !== undefined && !Object.values(VaultItemEnumType).includes(props.type)) {
      throw new CustomError({
        code: ErrorCode.validation_error,
        message: 'A valid item type is required.',
      });
    }

    if (
      props.folderId !== undefined &&
      (!Number.isInteger(props.folderId) || props.folderId <= 0)
    ) {
      throw new CustomError({
        code: ErrorCode.validation_error,
        message: 'Folder ID must be a positive integer.',
      });
    }

    Object.assign(this, props);
    this.updatedAt = new Date();
  }

  public static reconstituite(attributes: IVaultItems) {
    return new VaultDE(attributes);
  }
}
