import { CustomError } from '../../../../common/errors/custom.error';
import { ErrorCode } from '../../../../common/errors/error-code-enum';
import type { IUser } from '../interfaces/user.interface';
import type { UserStatusType } from '../types/user-status.type';

export class UserDE {
  public readonly id: number;
  public readonly name: string;
  public readonly email: string;
  public readonly passwordHash: string;
  public readonly status: UserStatusType;
  public readonly emailVerifiedAt: Date | null;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  private constructor(attributes: IUser) {
    Object.assign(this, attributes);
  }

  static create(props: IUser): UserDE {
    if (props.id !== undefined && (!Number.isInteger(props.id) || props.id <= 0)) {
      throw new CustomError({
        message: 'The user identifier must be a positive integer.',
        code: ErrorCode.database_error,
      });
    }
    if (!props.name?.trim()) {
      throw new CustomError({
        message: 'The user name is required.',
        code: ErrorCode.database_error,
      });
    }

    const name = props.name.trim();

    if (name.length < 2 || name.length > 100) {
      throw new CustomError({
        message: 'The name must be between 2 and 100 characters long.',
        code: ErrorCode.database_error,
      });
    }

    if (!props.email?.trim()) {
      throw new CustomError({
        message: 'The email address is required.',
        code: ErrorCode.database_error,
      });
    }

    const email = props.email.trim().toLowerCase();

    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new CustomError({
        message: 'The email address is not valid.',
        code: ErrorCode.database_error,
      });
    }

    if (!props.passwordHash?.trim()) {
      throw new CustomError({
        message: 'The password hash is required.',
        code: ErrorCode.database_error,
      });
    }

    if (props.passwordHash.length > 255) {
      throw new CustomError({
        message: 'The password hash cannot exceed 255 characters.',
        code: ErrorCode.database_error,
      });
    }

    const validStatuses: UserStatusType[] = ['PENDING_VERIFICATION', 'ACTIVE', 'SUSPENDED'];

    if (!validStatuses.includes(props.status)) {
      throw new CustomError({
        message: 'The user status is not valid.',
        code: ErrorCode.database_error,
      });
    }

    if (
      props.emailVerifiedAt !== null &&
      (!(props.emailVerifiedAt instanceof Date) || Number.isNaN(props.emailVerifiedAt.getTime()))
    ) {
      throw new CustomError({
        message: 'The verification date is not valid.',
        code: ErrorCode.database_error,
      });
    }

    if (props.status === 'ACTIVE' && props.emailVerifiedAt === null) {
      throw new CustomError({
        message: 'A user must verify their email before becoming active.',
        code: ErrorCode.database_error,
      });
    }

    return new UserDE({
      id: props.id,
      name,
      email,
      passwordHash: props.passwordHash,
      status: props.status,
      emailVerifiedAt: props.emailVerifiedAt,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    });
  }

  static reconstitute(props: IUser): UserDE {
    return new UserDE(props);
  }
}
