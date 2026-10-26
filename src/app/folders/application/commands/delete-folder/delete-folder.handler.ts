import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteFolderCommand } from './delete-folder.command';
import { FolderRepositoryPort } from '../../../domain/ports/folder-repository.port';
import { CustomError } from '../../../../../common/errors/custom.error';
import { ErrorCode } from '../../../../../common/errors/error-code-enum';

@CommandHandler(DeleteFolderCommand)
export class DeleteFolderHandler implements ICommandHandler<DeleteFolderCommand, void> {
  constructor(private readonly repository: FolderRepositoryPort) {}

  async execute(command: DeleteFolderCommand): Promise<void> {
    const { id, userId } = command;

    const folder = await this.repository.findById(id);
    if (!folder) {
      throw new CustomError({
        code: ErrorCode.folder_not_found,
        message: 'Folder not found',
      });
    }

    if (folder.userId !== userId) {
      throw new CustomError({
        code: ErrorCode.validation_error,
        message: 'You do not have permission to access this folder',
      });
    }

    await this.repository.delete(id);
  }
}
