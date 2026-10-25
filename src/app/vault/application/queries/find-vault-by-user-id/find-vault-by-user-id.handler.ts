import { ICommandHandler, QueryHandler } from '@nestjs/cqrs';
import { Pagination } from '../../../../../common/pagintation';
import { VaultDE } from '../../../domain/entities/vault.domain-entity';
import { VaultRepositoryPort } from '../../../domain/ports/vault-repository.port';
import { FindVaultByUserIdQuery } from './find-vault-by-user-id.query';
import { CustomError } from '../../../../../common/errors/custom.error';
import { ErrorCode } from '../../../../../common/errors/error-code-enum';

@QueryHandler(FindVaultByUserIdQuery)
export class FindVaultByUserIdHandler implements ICommandHandler<
  FindVaultByUserIdQuery,
  Pagination<VaultDE[]>
> {
  constructor(private readonly repository: VaultRepositoryPort) {}

  execute(query: FindVaultByUserIdQuery): Promise<Pagination<VaultDE[]>> {
    if (!query.userId)
      throw new CustomError({
        code: ErrorCode.validation_error,
        message: 'userId not provide',
      });

    return this.repository.findByUserId({
      userId: query.userId,
      isFavorite: query.isFavorite,
      pageQuery: query.pageQuery,
      search: query.search,
      takeQuery: query.takeQuery,
    });
  }
}
