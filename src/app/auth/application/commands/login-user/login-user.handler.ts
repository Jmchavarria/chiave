import { UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { createHash, randomUUID } from 'node:crypto';
import { LoginUserCommand } from './login-user.command';
import { UserRepositoryPort } from '../../../../users/domain/ports/user-repository.port';
import { PasswordHasherPort } from '../../../../users/domain/ports/password-hasher.port';
import { TokenServicePort } from '../../../domain/ports/token-service.port';
import { RefreshTokenRepositoryPort } from '../../../domain/ports/refresh-token-repository.port';

export interface LoginUserResult {
  user: {
    id: number;
    name: string;
    email: string;
  };
  authSession: {
    accessToken: string;
    refreshToken: string;
  };
}

const hashToken = (token: string): string => createHash('sha256').update(token).digest('hex');

@CommandHandler(LoginUserCommand)
export class LoginUserHandler implements ICommandHandler<LoginUserCommand, LoginUserResult> {
  constructor(
    private readonly userRepository: UserRepositoryPort,
    private readonly passwordHasher: PasswordHasherPort,
    private readonly tokenService: TokenServicePort,
    private readonly refreshTokenRepository: RefreshTokenRepositoryPort,
  ) {}

  async execute(command: LoginUserCommand): Promise<LoginUserResult> {
    const user = await this.userRepository.findByEmail(command.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordIsValid = await this.passwordHasher.verify(command.password, user.passwordHash);

    if (!passwordIsValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('The account is not active');
    }

    const jti = randomUUID();

    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.signAccessToken({
        sub: user.id,
        email: user.email,
      }),
      this.tokenService.signRefreshToken({
        sub: user.id,
        email: user.email,
        jti,
      }),
    ]);

    await this.refreshTokenRepository.create({
      userId: user.id,
      jti,
      tokenHash: hashToken(refreshToken),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      revokedAt: null,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      authSession: {
        accessToken,
        refreshToken,
      },
    };
  }
}
