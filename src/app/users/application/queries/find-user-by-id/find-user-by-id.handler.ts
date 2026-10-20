import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindUserByIdQuery } from './find-user-by-id.query';
import { UserDE } from '../../../domain/entities/user.domain-entity';
import { UserRepositoryPort } from '../../../domain/ports/user-repository.port';

@QueryHandler(FindUserByIdQuery)
export class FindUserByIdHandler implements IQueryHandler<FindUserByIdQuery, UserDE | null> {
  constructor(private readonly repository: UserRepositoryPort) {}

  execute(query: FindUserByIdQuery): Promise<UserDE | null> {
    return this.repository.findById(query.id);
  }
}
