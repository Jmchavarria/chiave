import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserRepositoryPort } from '../../../../users/domain/ports/user-repository.port';
import { GetCurrentUserQuery } from './get-current-user.query';

export interface CurrentUserResult {
  id: number;
  name: string;
  email: string;
  status: string;
  emailVerifiedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

@QueryHandler(GetCurrentUserQuery)
export class GetCurrentUserHandler implements IQueryHandler<
  GetCurrentUserQuery,
  CurrentUserResult
> {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(query: GetCurrentUserQuery): Promise<CurrentUserResult> {
    const user = await this.userRepository.findById(query.userId);

    if (user?.id === undefined) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      status: user.status,
      emailVerifiedAt: user.emailVerifiedAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
