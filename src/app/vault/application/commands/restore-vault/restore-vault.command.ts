// src/modules/vaults/application/commands/restore-vault/restore-vault.command.ts
export class RestoreVaultCommand {
  constructor(
    public readonly id: number,
    public readonly userId: number,
  ) {}
}
