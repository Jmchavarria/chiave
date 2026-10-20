export class DeleteVaultCommand {
  constructor(
    public readonly id: number,
    public readonly userId: number,
  ) {}
}
