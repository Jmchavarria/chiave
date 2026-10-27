import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateFolderCommand } from './update-folder.command';
import { FolderDE } from '../../../domain/entities/folder.domain-entity';
import { FolderRepositoryPort } from '../../../domain/ports/folder-repository.port';
import { CustomError } from '../../../../../common/errors/custom.error';
import { ErrorCode } from '../../../../../common/errors/error-code-enum';

@CommandHandler(UpdateFolderCommand)
export class UpdateFolderHandler implements ICommandHandler<UpdateFolderCommand, FolderDE> {
  constructor(private readonly repository: FolderRepositoryPort) {}

  async execute(command: UpdateFolderCommand): Promise<FolderDE> {
    const { id, userId, input } = command;

    const folder = await this.repository.findById(id);

    if (!folder) {
      throw new CustomError({
        code: ErrorCode.folder_not_found,
        message: 'Folder not found',
      });
    }

    if (input.name && input.name !== folder.name) {
      const existingFolder = await this.repository.findByNameAndUserId(input.name, userId);
      if (existingFolder) {
        throw new CustomError({
          code: ErrorCode.folder_already_exist,
          message: `You already have a folder registered with the name "${input.name}"`,
        });
      }
    }

    folder.update({
      ...input,
      id,
      userId,
    });

    return this.repository.save(folder);
  }
}
