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

  async findByToken(tokenHash: string): Promise<EmailVerificationTokenDE | null> {
    const token = await this.repository.findOneBy({ tokenHash });

    return token ? EmailVerificationTokenMapper.toDomain(token) : null;
  }

  async verifyAndActivateUser(tokenHash: string): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const tokenRepository = manager.getRepository(EmailVerificationTokenOrmEntity);

      const userRepository = manager.getRepository(UserOrmEntity);

      const result = await tokenRepository
        .createQueryBuilder()
        .update(EmailVerificationTokenOrmEntity)
        .set({ usedAt: () => 'CURRENT_TIMESTAMP' })
        .where('token_hash = :tokenHash', { tokenHash })
        .andWhere('used_at IS NULL')
        .andWhere('expires_at > CURRENT_TIMESTAMP')
        .returning(['user_id'])
        .execute();

      const rows: unknown = result.raw;

      if (!Array.isArray(rows)) {
        throw new CustomError({
          message: 'No se pudo validar el token de verificación.',
          code: ErrorCode.invalid_verification_email,
        });
      }

      const firstRow: unknown = rows[0];

      if (
        typeof firstRow !== 'object' ||
        firstRow === null ||
        !('user_id' in firstRow) ||
        typeof firstRow.user_id !== 'number'
      ) {
        throw new CustomError({
          message: 'El token de verificación es inválido, expiró o ya fue utilizado.',
          code: ErrorCode.invalid_verification_email,
        });
      }

      const userId = firstRow.user_id;
      const verifiedAt = new Date();

      const updateResult = await userRepository.update(
        {
          id: userId,
          status: 'PENDING_VERIFICATION',
        },
        {
          status: 'ACTIVE',
          emailVerifiedAt: verifiedAt,
        },
      );

      if (updateResult.affected !== 1) {
        throw new CustomError({
          message: 'No se pudo activar la cuenta del usuario.',
          code: ErrorCode.invalid_verification_email,
        });
      }
    });
  }
}
