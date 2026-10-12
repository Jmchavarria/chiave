import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, IsNull, Repository } from 'typeorm';
import {
  RefreshTokenRepositoryPort,
  RefreshTokenSession,
} from '../../domain/ports/refresh-token-repository.port';
import { RefreshTokenOrmEntity } from './orm/refresh-token.orm-entity';

@Injectable()
export class TypeOrmRefreshTokenRepository implements RefreshTokenRepositoryPort {
  constructor(
    @InjectRepository(RefreshTokenOrmEntity)
    private readonly repository: Repository<RefreshTokenOrmEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async create(session: RefreshTokenSession): Promise<void> {
    await this.repository.save(this.repository.create(session));
  }

  async findByJti(jti: string): Promise<RefreshTokenSession | null> {
    const session = await this.repository.findOne({
      where: { jti },
    });

    if (!session) {
      return null;
    }

    return {
      userId: session.userId,
      jti: session.jti,
      tokenHash: session.tokenHash,
      expiresAt: session.expiresAt,
      revokedAt: session.revokedAt,
    };
  }

  async rotate(currentJti: string, nextSession: RefreshTokenSession): Promise<boolean> {
    return this.dataSource.transaction(async (manager) => {
      const result = await manager.update(
        RefreshTokenOrmEntity,
        { jti: currentJti, revokedAt: IsNull() },
        { revokedAt: new Date() },
      );

      if (result.affected !== 1) {
        return false;
      }

      await manager.save(manager.create(RefreshTokenOrmEntity, nextSession));

      return true;
    });
  }

  async revoke(jti: string): Promise<boolean> {
    const result = await this.repository.update(
      { jti, revokedAt: IsNull() },
      { revokedAt: new Date() },
    );

    return result.affected === 1;
  }
}
