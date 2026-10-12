import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenServicePort } from '../../domain/ports/token-service.port';

export interface RefreshTokenPayload {
  sub: number;
  email: string;
  jti: string;
}

@Injectable()
export class JwtTokenService implements TokenServicePort {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signAccessToken(payload: { sub: number; email: string }): Promise<string> {
    return this.jwtService.signAsync(payload, {
      expiresIn: '15m',
    });
  }

  async signRefreshToken(payload: RefreshTokenPayload): Promise<string> {
    const secret = this.configService.getOrThrow<string>('JWT_REFRESH_SECRET');

    return this.jwtService.signAsync(payload, {
      secret,
      expiresIn: '7d',
    });
  }

  async verifyRefreshToken(token: string): Promise<RefreshTokenPayload> {
    const secret = this.configService.getOrThrow<string>('JWT_REFRESH_SECRET');

    return this.jwtService.verifyAsync<RefreshTokenPayload>(token, {
      secret,
    });
  }
}
