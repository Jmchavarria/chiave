import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindArchivedFoldersQuery } from './find-archived-folder.query';
import { FolderDE } from '../../../domain/entities/folder.domain-entity';
import { FolderRepositoryPort } from '../../../domain/ports/folder-repository.port';

@QueryHandler(FindArchivedFoldersQuery)
export class FindArchivedFoldersHandler implements IQueryHandler<
  FindArchivedFoldersQuery,
  FolderDE[]
> {
  constructor(private readonly repository: FolderRepositoryPort) {}

  async execute(query: FindArchivedFoldersQuery): Promise<FolderDE[]> {
    return this.repository.findArchivedByUser(query.userId);
  }
}
