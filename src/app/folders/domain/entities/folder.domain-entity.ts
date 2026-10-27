import { CustomError } from '../../../../common/errors/custom.error';
import { ErrorCode } from '../../../../common/errors/error-code-enum';
import type { IFolder } from '../interfaces/folder.interface';
import type { CreateFolderProps, UpdateFolderProps } from '../ports/folder-repository.port';

export class FolderDE {
  public id?: number;
  public name: string;
  public userId: number;
  public createdAt?: Date | string;
  public updatedAt?: Date | string;
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

  public update(props: UpdateFolderProps & { id: number }): void {
    if (props.userId !== this.userId)
      throw new CustomError({
        code: ErrorCode.validation_error,
        message: 'You do not have permission to access this folder',
      });

    Object.assign(this, props);
  }

  public static reconstituite(attributes: IFolder) {
    return new FolderDE(attributes);
  }
}
