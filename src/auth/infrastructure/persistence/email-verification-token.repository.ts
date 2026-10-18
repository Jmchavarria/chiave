import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { EmailVerificationTokenOrmEntity } from './orm/email-verification-token.orm-entity';
import { UserOrmEntity } from '../../../users/infrastructure/persistence/user.orm-entity';
import {
  EmailVerificationTokenPort,
  SaveEmailTokenVerficationProps,
} from '../../domain/ports/email-verification-token.port';
import { EmailVerificationTokenDE } from '../../domain/entities/email-verification-token.doman-entity';
import { EmailVerificationTokenMapper } from '../mappers/email-verification-token.mapper';
import { CustomError } from '../../../common/errors/custom.error';
import { ErrorCode } from '../../../common/errors/error-code-enum';

@Injectable()
export class TypeOrmEmailVerificationTokenRepository implements EmailVerificationTokenPort {
  constructor(
    @InjectRepository(EmailVerificationTokenOrmEntity)
    private readonly repository: Repository<EmailVerificationTokenOrmEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async save(input: SaveEmailTokenVerficationProps): Promise<void> {
    await this.repository.save(input);
  }

  async findByUser(userId: number): Promise<EmailVerificationTokenDE | null> {
    const token = await this.repository.findOneBy({ userId });

    return token ? EmailVerificationTokenMapper.toDomain(token) : null;
  }
  async verifyAndActivateUser(userId: number): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const tokenRepository = manager.getRepository(EmailVerificationTokenOrmEntity);
      const userRepository = manager.getRepository(UserOrmEntity);

      const result = await tokenRepository
        .createQueryBuilder()
        .update(EmailVerificationTokenOrmEntity)
        .set({ usedAt: () => 'CURRENT_TIMESTAMP' })
        .where('user_id = :userId', { userId })
        .andWhere('expires_at > CURRENT_TIMESTAMP')
        .andWhere('used_at IS NULL')
        .returning(['user_id'])
        .execute();

      const rows: unknown = result.raw;
      const firstRow: unknown = Array.isArray(rows) ? rows[0] : undefined;

      if (typeof firstRow !== 'object' || firstRow === null || !('user_id' in firstRow)) {
        throw new CustomError({
          message: 'No se pudo encontrar un token de verificación activo para este usuario.',
          code: ErrorCode.invalid_verification_email,
        });
      }

      await userRepository.update(
        { id: userId },
        {
          status: 'ACTIVE',
          emailVerifiedAt: new Date(),
        },
      );
    });
  }
}
