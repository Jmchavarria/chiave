export class UpdateFolderCommand {
  constructor(
    public readonly id: number,
    public readonly userId: number,
    public readonly input: { name?: string },
  ) {}
}
