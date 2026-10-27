import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { VaultDE } from '../../../domain/entities/vault.domain-entity';
import { VaultRepositoryPort } from '../../../domain/ports/vault-repository.port';
import { FindArchivedVaultsQuery } from './find-archived-vaults.query';

@QueryHandler(FindArchivedVaultsQuery)
export class FindArchivedVaultsHandler implements IQueryHandler<
  FindArchivedVaultsQuery,
  VaultDE[]
> {
  constructor(private readonly repository: VaultRepositoryPort) {}

  async execute(query: FindArchivedVaultsQuery): Promise<VaultDE[]> {
    return this.repository.findArchivedByUserId(query.userId);
  }
}
