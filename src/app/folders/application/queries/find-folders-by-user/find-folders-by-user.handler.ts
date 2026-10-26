import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindFoldersByUserQuery } from './find-folders-by-user.query';
import { FolderDE } from '../../../domain/entities/folder.domain-entity';
import { FolderRepositoryPort } from '../../../domain/ports/folder-repository.port';

@QueryHandler(FindFoldersByUserQuery)
export class FindFoldersByUserHandler implements IQueryHandler<FindFoldersByUserQuery, FolderDE[]> {
  constructor(private readonly repository: FolderRepositoryPort) {}

  async execute(query: FindFoldersByUserQuery): Promise<FolderDE[]> {
    return this.repository.findByUserId(query.userId);
  }
}
