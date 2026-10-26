import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FolderRepositoryPort } from '../../../domain/ports/folder-repository.port';
import { FolderDE } from '../../../domain/entities/folder.domain-entity';
import { FindFolderByIdQuery } from './find-folder-by-id-query';
import { CustomError } from '../../../../../common/errors/custom.error';
import { ErrorCode } from '../../../../../common/errors/error-code-enum';

@QueryHandler(FindFolderByIdQuery)
export class FindFolderByIdHandler implements IQueryHandler<FindFolderByIdQuery, FolderDE> {
  constructor(private readonly repository: FolderRepositoryPort) {}

  async execute(query: FindFolderByIdQuery): Promise<FolderDE> {
    const folder = await this.repository.findById(query.id);

    if (!folder) {
      throw new CustomError({
        code: ErrorCode.folder_not_found,
        message: 'Folder not found',
      });
    }

    if (folder.userId !== query.userId) {
      throw new CustomError({
        code: ErrorCode.validation_error,
        message: 'You do not have permission to access this folder',
      });
    }

    return folder;
  }
}
