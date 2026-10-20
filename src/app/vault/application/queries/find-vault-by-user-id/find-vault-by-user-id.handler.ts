import { ICommandHandler, QueryHandler } from '@nestjs/cqrs';
import { Pagination } from '../../../../../common/pagintation';
import { VaultDE } from '../../../domain/entities/vault.domain-entity';
import { VaultRepositoryPort } from '../../../domain/ports/vault-repository.port';
import { FindVaultByUserIdQuery } from './find-vault-by-user-id.query';

@QueryHandler(FindVaultByUserIdQuery)
export class FindVaultByUserIdHandler implements ICommandHandler<
  FindVaultByUserIdQuery,
  Pagination<VaultDE[]>
> {
  constructor(private readonly repository: VaultRepositoryPort) {}

  execute(query: FindVaultByUserIdQuery): Promise<Pagination<VaultDE[]>> {
    return this.repository.findByUserId({
      userId: query.userId,
      isFavorite: query.isFavorite,
      pageQuery: query.pageQuery,
      search: query.search,
      takeQuery: query.takeQuery,
    });
  }
}
