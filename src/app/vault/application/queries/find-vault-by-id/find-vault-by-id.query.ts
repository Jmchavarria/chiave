export class FindVaultByIdQuery {
  constructor(
    public readonly id: number,
    public readonly userId: number,
  ) {}
}
