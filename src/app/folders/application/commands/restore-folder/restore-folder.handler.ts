import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CustomError } from '../../../../../common/errors/custom.error';
import { ErrorCode } from '../../../../../common/errors/error-code-enum';
import { FolderDE } from '../../../domain/entities/folder.domain-entity';
import { FolderRepositoryPort } from '../../../domain/ports/folder-repository.port';
import { RestoreFolderCommand } from './restore-folder.command';

@CommandHandler(RestoreFolderCommand)
export class RestoreFolderHandler implements ICommandHandler<RestoreFolderCommand, FolderDE> {
  constructor(private readonly repository: FolderRepositoryPort) {}

  async execute(command: RestoreFolderCommand): Promise<FolderDE> {
    const { id, userId } = command;

    const folder = await this.repository.findById(id);
    if (!folder) {
      throw new CustomError({
        code: ErrorCode.folder_not_found,
        message: 'Folder not found',
      });
    }

    folder.restore(userId);

    const savedFolder = await this.repository.save(folder);

    await this.repository.restoreByFolderIdCascading(id, userId);

    return savedFolder;
  }
}
