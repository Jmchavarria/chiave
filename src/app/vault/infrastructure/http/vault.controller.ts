import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { VaultDE } from '../../domain/entities/vault.domain-entity';
import { Pagination } from '../../../../common/pagintation';
import { FindVaultByUserIdQuery } from '../../application/queries/find-vault-by-user-id/find-vault-by-user-id.query';
import { FindVaultByUserIdHttpDto } from './find-vault-by-user-id.http-dto';
import { CreateVaultCommand } from '../../application/commands/create-vault/create-vault.command';
import { CreateVaultHttpDto } from './create-vault.http-dto';
import { DeleteVaultCommand } from '../../application/commands/delete-vault/delete-vault.command';

@Controller('vault')
export class VaultController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post(':userId')
  async createVaultItem(
    @Param('userId') userId: number,
    @Body() dto: CreateVaultHttpDto,
  ): Promise<VaultDE> {
    return this.commandBus.execute<CreateVaultCommand, VaultDE>(
      new CreateVaultCommand(
        userId,
        dto.type,
        dto.encryptedData,
        dto.iv,
        dto.authTag,
        dto.isFavorite,
      ),
    );
  }

  @Get(':id')
  findVaultByUserId(
    @Param('id') userId: number,
    @Query() input: FindVaultByUserIdHttpDto,
  ): Promise<Pagination<VaultDE[]>> {
    return this.queryBus.execute<FindVaultByUserIdQuery, Pagination<VaultDE[]>>(
      new FindVaultByUserIdQuery(
        userId,
        input.isFavorite,
        input.search,
        input.pageQuery,
        input.takeQuery,
      ),
    );
  }

  @Delete(':userId/:id')
  async deleteVaultItem(
    @Param('userId') userId: number,
    @Param('id') id: number,
  ): Promise<{ success: boolean }> {
    const success = await this.commandBus.execute<DeleteVaultCommand, boolean>(
      new DeleteVaultCommand(id, userId),
    );
    return { success };
  }
}
