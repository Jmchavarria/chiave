import { UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { createHash, randomUUID, timingSafeEqual } from 'node:crypto';
import { RefreshTokensCommand } from './refresh-tokens.command';
import { TokenServicePort } from '../../../domain/ports/token-service.port';
import { RefreshTokenRepositoryPort } from '../../../domain/ports/refresh-token-repository.port';
import { UserRepositoryPort } from '../../../../users/domain/ports/user-repository.port';

export interface RefreshTokensResult {
  accessToken: string;
  refreshToken: string;
}

const hashToken = (token: string): string => createHash('sha256').update(token).digest('hex');

const hashesMatch = (storedHash: string, receivedHash: string): boolean => {
  const stored = Buffer.from(storedHash, 'hex');
  const received = Buffer.from(receivedHash, 'hex');

  return stored.length === 32 && received.length === 32 && timingSafeEqual(stored, received);
};

@CommandHandler(RefreshTokensCommand)
export class RefreshTokensHandler implements ICommandHandler<
  RefreshTokensCommand,
  RefreshTokensResult
> {
  constructor(
    private readonly tokenService: TokenServicePort,
    private readonly refreshTokenRepository: RefreshTokenRepositoryPort,
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(command: RefreshTokensCommand): Promise<RefreshTokensResult> {
    let payload: { sub: number; email: string; jti: string };

    try {
      payload = await this.tokenService.verifyRefreshToken(command.refreshToken);
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    if (
      !payload ||
      !Number.isInteger(payload.sub) ||
      payload.sub <= 0 ||
      typeof payload.email !== 'string' ||
      typeof payload.jti !== 'string' ||
      payload.jti.length === 0
    ) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const session = await this.refreshTokenRepository.findByJti(payload.jti);

    if (
      session?.userId !== payload.sub ||
      session.revokedAt !== null ||
      session.expiresAt.getTime() <= Date.now() ||
      !hashesMatch(session.tokenHash, hashToken(command.refreshToken))
    ) {
      throw new UnauthorizedException('The session is invalid');
    }

    const user = await this.userRepository.findById(payload.sub);

    if (user?.id === undefined || user.status !== 'ACTIVE' || user.email !== payload.email) {
      throw new UnauthorizedException('The account is not active');
    }

    const nextJti = randomUUID();

    const nextRefreshToken = await this.tokenService.signRefreshToken({
      sub: user.id,
      email: user.email,
      jti: nextJti,
    });

    const nextSession = {
      userId: user.id,
      jti: nextJti,
      tokenHash: hashToken(nextRefreshToken),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      revokedAt: null,
    };

    const rotated = await this.refreshTokenRepository.rotate(payload.jti, nextSession);

    if (!rotated) {
      throw new UnauthorizedException('The refresh token has already been used or revoked');
    }

    const accessToken = await this.tokenService.signAccessToken({
      sub: user.id,
      email: user.email,
    });

    return {
      accessToken,
      refreshToken: nextRefreshToken,
    };
  }
}
