export abstract class TokenServicePort {
  abstract signAccessToken(payload: { sub: number; email: string }): Promise<string>;

  abstract signRefreshToken(payload: { sub: number; email: string; jti: string }): Promise<string>;

  abstract verifyRefreshToken(token: string): Promise<{
    sub: number;
    email: string;
    jti: string;
  }>;
}
