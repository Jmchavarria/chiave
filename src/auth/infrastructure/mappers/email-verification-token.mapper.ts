import { EmailVerificationTokenDE } from '../../domain/entities/email-verification-token.doman-entity';
import type { EmailVerificationTokenOrmEntity } from '../persistence/orm/email-verification-token.orm-entity';

export class EmailVerificationTokenMapper {
  static toDomain(entity: EmailVerificationTokenOrmEntity): EmailVerificationTokenDE {
    return new EmailVerificationTokenDE({
      id: entity.id,
      expiresAt: entity.expiresAt,
      usedAt: entity.usedAt,
    });
  }
}
