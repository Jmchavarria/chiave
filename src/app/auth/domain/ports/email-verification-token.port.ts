import type { EmailVerificationTokenDE } from '../entities/email-verification-token.doman-entity';

export interface SaveEmailTokenVerficationProps {
  userId: number;
  tokenHash: string;
  expiresAt: Date;
}
export abstract class EmailVerificationTokenPort {
  abstract save(input: SaveEmailTokenVerficationProps): Promise<void>;
  abstract findByUser(userId: number): Promise<EmailVerificationTokenDE | null>;
  abstract verifyAndActivateUser(userId: number): Promise<void>;
}
