import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenServicePort } from '../../domain/ports/token-service.port';

@Injectable()
export class JwtTokenService implements TokenServicePort {
  constructor(private readonly jwtService: JwtService) {}

  async signAccessToken(payload: { sub: number; email: string }): Promise<string> {
    return this.jwtService.signAsync(payload);
  }
}
