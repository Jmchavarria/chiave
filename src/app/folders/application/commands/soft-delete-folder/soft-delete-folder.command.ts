export class SoftDeleteFolderCommand {
  constructor(
    public readonly id: number,
    public readonly userId: number,
  ) {}
}
