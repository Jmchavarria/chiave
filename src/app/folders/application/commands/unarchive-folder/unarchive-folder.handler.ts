import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UnarchiveFolderCommand } from './unarchive-folder.command';
import { CustomError } from '../../../../../common/errors/custom.error';
import { ErrorCode } from '../../../../../common/errors/error-code-enum';
import { VaultRepositoryPort } from '../../../../vault/domain/ports/vault-repository.port';
import { FolderDE } from '../../../domain/entities/folder.domain-entity';
import { FolderRepositoryPort } from '../../../domain/ports/folder-repository.port';

@CommandHandler(UnarchiveFolderCommand)
export class UnarchiveFolderHandler implements ICommandHandler<UnarchiveFolderCommand, FolderDE> {
  constructor(
    private readonly folderRepository: FolderRepositoryPort,
    private readonly vaultRepository: VaultRepositoryPort,
  ) {}

  async execute(command: UnarchiveFolderCommand): Promise<FolderDE> {
    const { id, userId } = command;

    const folder = await this.folderRepository.findById(id);
    if (!folder) {
      throw new CustomError({
        code: ErrorCode.folder_not_found,
        message: 'Folder not found',
      });
    }

    folder.unarchive(userId);
    const savedFolder = await this.folderRepository.save(folder);

    await this.vaultRepository.unarchiveByFolderId(id, userId);

    return savedFolder;
  }
}
