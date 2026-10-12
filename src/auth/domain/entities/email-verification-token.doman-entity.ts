export class EmailVerificationTokenDE {
  public id: number;
  public expiresAt: Date;
  public usedAt: Date;
  public tokenHash: string;

  constructor(attributes: IEmailVerificationToken) {
    Object.assign(this, attributes);
  }
}

export interface IEmailVerificationToken {
  id: number;
  expiresAt: Date;
  usedAt: Date | null;
}
