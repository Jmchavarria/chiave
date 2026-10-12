export interface RefreshTokenSession {
  userId: number;
  jti: string;
  tokenHash: string;
  expiresAt: Date;
  revokedAt: Date | null;
}

export abstract class RefreshTokenRepositoryPort {
  abstract create(session: RefreshTokenSession): Promise<void>;

  abstract findByJti(jti: string): Promise<RefreshTokenSession | null>;

  abstract rotate(currentJti: string, nextSession: RefreshTokenSession): Promise<boolean>;

  abstract revoke(jti: string): Promise<boolean>;
}
