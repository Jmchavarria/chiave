export abstract class EmailServicePort {
  abstract sendVerificationEmail(params: {
    to: string;
    name: string;
    token: string;
  }): Promise<void>;
}
