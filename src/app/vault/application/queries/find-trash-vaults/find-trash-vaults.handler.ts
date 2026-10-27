import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindTrashVaultsQuery } from './find-trash-vaults.query';
import { VaultRepositoryPort } from '../../../domain/ports/vault-repository.port';
import { VaultDE } from '../../../domain/entities/vault.domain-entity';

@QueryHandler(FindTrashVaultsQuery)
export class FindTrashVaultsHandler implements IQueryHandler<FindTrashVaultsQuery, VaultDE[]> {
  constructor(private readonly repository: VaultRepositoryPort) {}

  async execute(query: FindTrashVaultsQuery): Promise<VaultDE[]> {
    return this.repository.findTrashByUserId(query.userId);
  }
}
