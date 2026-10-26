export class CreateFolderCommand {
  constructor(
    public readonly userId: number,

    public payload: { name: string },
  ) {}
}
