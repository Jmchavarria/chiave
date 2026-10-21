import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, IsNull, Repository } from 'typeorm';
import { EmailVerificationTokenOrmEntity } from './orm/email-verification-token.orm-entity';
import { UserOrmEntity } from '../../../users/infrastructure/persistence/user.orm-entity';
import {
  EmailVerificationTokenPort,
  SaveEmailTokenVerficationProps,
} from '../../domain/ports/email-verification-token.port';
import { EmailVerificationTokenDE } from '../../domain/entities/email-verification-token.doman-entity';
import { EmailVerificationTokenMapper } from '../mappers/email-verification-token.mapper';

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
    const token = await this.repository.findOne({
      where: {
        userId,
        usedAt: IsNull(),
      },
    });

    return token ? EmailVerificationTokenMapper.toDomain(token) : null;
  }
  async verifyAndActivateUser(userId: number): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const tokenRepository = manager.getRepository(EmailVerificationTokenOrmEntity);

      const userRepository = manager.getRepository(UserOrmEntity);

      const result = await tokenRepository
        .createQueryBuilder()
        .update(EmailVerificationTokenOrmEntity)
        .set({
          usedAt: () => 'CURRENT_TIMESTAMP',
        })
        .where('user_id = :userId', { userId })
        .andWhere('expires_at > CURRENT_TIMESTAMP')
        .andWhere('used_at IS NULL')
        .execute();

      if (!result.affected) {
        throw new BadRequestException(
          'An active verification token could not be found for this user.',
        );
      }

      const userResult = await userRepository.update(
        { id: userId },
        {
          status: 'ACTIVE',
          emailVerifiedAt: new Date(),
        },
      );

      if (!userResult.affected) {
        throw new BadRequestException('The user could not be activated.');
      }
    });
  }
}
