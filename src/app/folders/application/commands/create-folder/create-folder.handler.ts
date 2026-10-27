import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateFolderCommand } from './create-folder.command';
import { FolderDE } from '../../../domain/entities/folder.domain-entity';
import { FolderRepositoryPort } from '../../../domain/ports/folder-repository.port';
import { CustomError } from '../../../../../common/errors/custom.error';
import { ErrorCode } from '../../../../../common/errors/error-code-enum';

@CommandHandler(CreateFolderCommand)
export class CreateFolderHandler implements ICommandHandler<CreateFolderCommand, FolderDE> {
  constructor(private readonly repository: FolderRepositoryPort) {}

  async execute(command: CreateFolderCommand): Promise<FolderDE> {
    const {
      userId,
      payload: { name },
    } = command;

    const existingFolder = await this.repository.findByNameAndUser(name, userId);
    if (existingFolder) {
      throw new CustomError({
        code: ErrorCode.folder_already_exist,
        message: `You already have a folder registered with the name  "${name}"`,
      });
    }

    const folder = FolderDE.create({
      userId,
      name,
    });

    return this.repository.save(folder);
  }
}
