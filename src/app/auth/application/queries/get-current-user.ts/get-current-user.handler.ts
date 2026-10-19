import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserRepositoryPort } from '../../../../users/domain/ports/user-repository.port';
import { GetCurrentUserQuery } from './get-current-user.query';
import { UserDE } from '../../../../users/domain/entities/user.domain-entity';
import { CustomError } from '../../../../../common/errors/custom.error';
import { ErrorCode } from '../../../../../common/errors/error-code-enum';

@QueryHandler(GetCurrentUserQuery)
export class GetCurrentUserHandler implements IQueryHandler<GetCurrentUserQuery, UserDE> {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(query: GetCurrentUserQuery): Promise<UserDE> {
    const user = await this.userRepository.findById(query.userId);

    if (!user) {
      throw new CustomError({
        message: 'user not found',
        code: ErrorCode.user_not_found,
        statusCode: 404,
      });
    }
    return user;
  }
}
