import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindUserByIdQuery } from './find-user-by-id.query';
import { UserDE } from '../../../domain/entities/user.domain-entity';
import { UserRepositoryPort } from '../../../domain/ports/user-repository.port';
import { CustomError } from '../../../../../common/errors/custom.error';
import { ErrorCode } from '../../../../../common/errors/error-code-enum';

@QueryHandler(FindUserByIdQuery)
export class FindUserByIdHandler implements IQueryHandler<FindUserByIdQuery, UserDE> {
  constructor(private readonly repository: UserRepositoryPort) {}

  async execute(query: FindUserByIdQuery): Promise<UserDE> {
    const user = await this.repository.findById(query.id);

    if (!user)
      throw new CustomError({
        code: ErrorCode.user_not_found,
        message: 'User not found',
        instanceName: FindUserByIdHandler.name,
      });

    return user;
  }
}
