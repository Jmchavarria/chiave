import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CustomError } from '../../../../../common/errors/custom.error';
import { ErrorCode } from '../../../../../common/errors/error-code-enum';
import { VaultRepositoryPort } from '../../../../vault/domain/ports/vault-repository.port';
import { FolderDE } from '../../../domain/entities/folder.domain-entity';
import { FolderRepositoryPort } from '../../../domain/ports/folder-repository.port';
import { ArchiveFolderCommand } from './archive-folder.command';

@CommandHandler(ArchiveFolderCommand)
export class ArchiveFolderHandler implements ICommandHandler<ArchiveFolderCommand, FolderDE> {
  constructor(
    private readonly folderRepository: FolderRepositoryPort,
    private readonly vaultRepository: VaultRepositoryPort,
  ) {}

  async execute(command: ArchiveFolderCommand): Promise<FolderDE> {
    const { id, userId } = command;

    const folder = await this.folderRepository.findById(id);
    if (!folder) {
      throw new CustomError({
        code: ErrorCode.folder_not_found,
        message: 'Folder not found',
      });
    }

    folder.archive(userId);
    const savedFolder = await this.folderRepository.save(folder);

    await this.vaultRepository.archiveByFolderId(id, userId);

    return savedFolder;
  }
}
