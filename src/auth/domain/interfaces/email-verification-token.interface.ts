export interface IEmailVerificationToken {
  id: number;
  expiresAt: Date;
  usedAt: Date | null;
  tokenHash: string;
}
