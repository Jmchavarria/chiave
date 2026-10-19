export class verifyAndActivateUserCommand {
  constructor(
    public userId: number,
    public token: string,
  ) {}
}
