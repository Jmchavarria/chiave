import { CustomError } from '../../../../common/errors/custom.error';
import { ErrorCode } from '../../../../common/errors/error-code-enum';
import type { IFolder } from '../interfaces/folder.interface';
import type { CreateFolderProps, UpdateFolderProps } from '../ports/folder-repository.port';

export class FolderDE {
  public id?: number;
  public name: string;
  public userId: number;
  public isArchived: boolean;
  public isDeleted: boolean;
  public createdAt?: Date | string;
  public updatedAt?: Date | string;

  private constructor(attributes: IFolder) {
    Object.assign(this, attributes);
  }

  private validateOwner(userId: number, action = 'access'): void {
    if (this.userId !== userId) {
      throw new CustomError({
        code: ErrorCode.validation_error,
        message: `You do not have permission to ${action} this folder`,
      });
    }
  }

  public archive(userId: number): void {
    this.validateOwner(userId, 'archive');
    this.isArchived = true;
    this.updatedAt = new Date();
  }

  public unarchive(userId: number): void {
    this.validateOwner(userId, 'unarchive');
    this.isArchived = false;
    this.updatedAt = new Date();
  }

  public softDelete(userId: number): void {
    this.validateOwner(userId, 'delete');
    this.isDeleted = true;
    this.isArchived = false;
    this.updatedAt = new Date();
  }

  public restore(userId: number): void {
    this.validateOwner(userId, 'restore');
    this.isDeleted = false;
    this.updatedAt = new Date();
  }

  public update(props: UpdateFolderProps & { id: number }): void {
    this.validateOwner(props.userId, 'access');
    Object.assign(this, props);
    this.updatedAt = new Date();
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
      isDeleted: false,
      isArchived: false,
      userId: props.userId,
    });
  }

  public static reconstituite(attributes: IFolder): FolderDE {
    return new FolderDE(attributes);
  }
}
