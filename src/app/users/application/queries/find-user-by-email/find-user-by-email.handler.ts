import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GetUserByEmailQuery } from './find-user-by-email.query';
import { UserDE } from '../../../domain/entities/user.domain-entity';
import { UserRepositoryPort } from '../../../domain/ports/user-repository.port';

@CommandHandler(GetUserByEmailQuery)
export class GetUserByEmailHandler implements ICommandHandler<GetUserByEmailQuery, UserDE | null> {
  constructor(private readonly repository: UserRepositoryPort) {}

  execute(query: GetUserByEmailQuery): Promise<UserDE | null> {
    return this.repository.findByEmail(query.email);
  }
}
