export class DeleteFolderCommand {
  constructor(
    public readonly id: number,
    public readonly userId: number,
  ) {}
}
