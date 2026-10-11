export abstract class TokenServicePort {
  abstract signAccessToken(payload: { sub: number; email: string }): Promise<string>;
}
