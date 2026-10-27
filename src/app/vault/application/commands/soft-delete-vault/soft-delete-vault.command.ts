export class SoftDeleteVaultCommand {
  constructor(
    public readonly id: number,
    public readonly userId: number,
  ) {}
}
