import { UserDE } from '../../domain/entities/user.domain-entity';
import type { UserOrmEntity } from '../persistence/user.orm-entity';

export class UserMapper {
  static toDomain(user: UserOrmEntity): UserDE {
    return UserDE.reconstitute({
      id: user.id,
      name: user.name,
      email: user.email,
      passwordHash: user.passwordHash,
      status: user.status,
      emailVerifiedAt: user.emailVerifiedAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }
}
