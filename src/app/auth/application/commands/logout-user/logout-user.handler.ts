import { UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LogoutUserCommand } from './logout-user.command';
import { TokenServicePort } from '../../../domain/ports/token-service.port';
import { RefreshTokenRepositoryPort } from '../../../domain/ports/refresh-token-repository.port';

@CommandHandler(LogoutUserCommand)
export class LogoutUserHandler implements ICommandHandler<LogoutUserCommand, void> {
  constructor(
    private readonly tokenService: TokenServicePort,
    private readonly refreshTokenRepository: RefreshTokenRepositoryPort,
  ) {}

  async execute(command: LogoutUserCommand): Promise<void> {
    let payload: {
      sub: number;
      email: string;
      jti: string;
    };

    try {
      payload = await this.tokenService.verifyRefreshToken(command.refreshToken);
    } catch {
      throw new UnauthorizedException('Refresh token inválido o expirado');
    }

    if (
      Number.isInteger(payload.sub) ||
      payload.sub <= 0 ||
      typeof payload.jti !== 'string' ||
      !payload.jti
    ) {
      throw new UnauthorizedException('Refresh token inválido');
    }

    const session = await this.refreshTokenRepository.findByJti(payload.jti);

    if (
      !session ||
      session.userId !== payload.sub ||
      session.revokedAt !== null ||
      session.expiresAt.getTime() <= Date.now()
    ) {
      throw new UnauthorizedException('La sesión no es válida');
    }

    await this.refreshTokenRepository.revoke(payload.jti);
  }
}
