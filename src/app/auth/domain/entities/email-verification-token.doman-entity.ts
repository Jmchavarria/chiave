import type { IEmailVerificationToken } from '../interfaces/email-verification-token.interface';

export class EmailVerificationTokenDE {
  public id: number;
  public expiresAt: Date;
  public usedAt: Date;
  public tokenHash: string;

  constructor(attributes: IEmailVerificationToken) {
    Object.assign(this, attributes);
  }
}
