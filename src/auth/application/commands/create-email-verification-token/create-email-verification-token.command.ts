export class CreateEmailVerificationTokenCommand {
  constructor(
    public userId: number,
    public readonly email: string,
    public readonly name: string,
  ) {}
}
