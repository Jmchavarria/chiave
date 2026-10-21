import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindVaultByIdQuery } from './find-vault-by-id.query';
import { VaultRepositoryPort } from '../../../domain/ports/vault-repository.port';
import { VaultDE } from '../../../domain/entities/vault.domain-entity';
import { CustomError } from '../../../../../common/errors/custom.error';
import { ErrorCode } from '../../../../../common/errors/error-code-enum';

@QueryHandler(FindVaultByIdQuery)
export class FindVaultByIdHandler implements IQueryHandler<FindVaultByIdQuery, VaultDE> {
  constructor(private readonly repository: VaultRepositoryPort) {}

  async execute(query: FindVaultByIdQuery): Promise<VaultDE> {
    const vault = await this.repository.findById(query.id, query.userId);

    if (!vault)
      throw new CustomError({
        code: ErrorCode.register_not_found,
        message: 'The vault item does not exist or does not belong to the user',
        statusCode: 404,
      });

    return vault;
  }
}
