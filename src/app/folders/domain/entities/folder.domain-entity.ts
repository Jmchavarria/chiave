import { CustomError } from '../../../../common/errors/custom.error';
import { ErrorCode } from '../../../../common/errors/error-code-enum';
import type { IFolder } from '../interfaces/folder.interface';
import type { CreateFolderProps } from '../ports/folder-repository.port';

export class FolderDE {
  public readonly id?: number;
  public readonly name: string;
  public readonly userId: number;
  public readonly createdAt?: Date | string;
  public readonly updatedAt?: Date | string;
  private constructor(attributes: IFolder) {
    Object.assign(this, attributes);
  }

  static create(props: CreateFolderProps): FolderDE {
    if (!props.name || props.name.trim() === '') {
      throw new CustomError({
        code: ErrorCode.validation_error,
        message: 'The folder name is required',
      });
    }

    if (!props.userId) {
      throw new CustomError({
        code: ErrorCode.validation_error,
        message: 'The User ID is required',
      });
    }

    return new FolderDE({
      name: props.name,
      userId: props.userId,
    });
  }

  public static reconstituite(attributes: IFolder) {
    return new FolderDE(attributes);
  }
}
