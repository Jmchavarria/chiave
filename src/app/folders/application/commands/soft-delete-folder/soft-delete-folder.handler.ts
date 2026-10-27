import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SoftDeleteFolderCommand } from './soft-delete-folder.command';
import { CustomError } from '../../../../../common/errors/custom.error';
import { ErrorCode } from '../../../../../common/errors/error-code-enum';
import { FolderDE } from '../../../domain/entities/folder.domain-entity';
import { FolderRepositoryPort } from '../../../domain/ports/folder-repository.port';

@CommandHandler(SoftDeleteFolderCommand)
export class SoftDeleteFolderHandler implements ICommandHandler<SoftDeleteFolderCommand, FolderDE> {
  constructor(private readonly folderRepository: FolderRepositoryPort) {}

  async execute(command: SoftDeleteFolderCommand): Promise<FolderDE> {
    const { id, userId } = command;

    const folder = await this.folderRepository.findById(id);
    if (!folder) {
      throw new CustomError({
        code: ErrorCode.folder_not_found,
        message: 'Folder not found',
      });
    }

    folder.softDelete(userId);

    const savedFolder = await this.folderRepository.save(folder);

    await this.folderRepository.softDeleteByFolderIdCascading(id, userId);

    return savedFolder;
  }
}
