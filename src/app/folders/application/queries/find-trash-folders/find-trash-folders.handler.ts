import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FolderDE } from '../../../domain/entities/folder.domain-entity';
import { FolderRepositoryPort } from '../../../domain/ports/folder-repository.port';
import { FindTrashFoldersQuery } from './find-trash-folders.query';

@QueryHandler(FindTrashFoldersQuery)
export class FindTrashFoldersHandler implements IQueryHandler<FindTrashFoldersQuery, FolderDE[]> {
  constructor(private readonly repository: FolderRepositoryPort) {}

  async execute(query: FindTrashFoldersQuery): Promise<FolderDE[]> {
    return this.repository.findTrashByUserId(query.userId);
  }
}
