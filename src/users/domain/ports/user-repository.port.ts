import type { UserDE } from '../entities/user.domain-entity';

export abstract class UserRepositoryPort {
  abstract findByEmail(email: string): Promise<UserDE | null>;
  abstract findById(id: number): Promise<UserDE | null>;
  abstract save(user: UserDE): Promise<UserDE>;
}
