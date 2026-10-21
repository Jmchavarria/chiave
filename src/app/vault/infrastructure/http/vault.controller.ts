import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { VaultDE } from '../../domain/entities/vault.domain-entity';
import { Pagination } from '../../../../common/pagintation';
import { FindVaultByUserIdQuery } from '../../application/queries/find-vault-by-user-id/find-vault-by-user-id.query';
import { FindVaultByUserIdHttpDto } from './find-vault-by-user-id.http-dto';
import { CreateVaultCommand } from '../../application/commands/create-vault/create-vault.command';
import { CreateVaultHttpDto } from './create-vault.http-dto';
import { UpdateVaultCommand } from '../../application/commands/update-vault/update-vault.command';
import { ToggleFavoriteVaultCommand } from '../../application/commands/toggle-favorite-vault/toggle-favorite-vault.command';
import { DeleteVaultCommand } from '../../application/commands/delete-vault/delete-vault.command';
import { UpdateVaultHttpDto } from './update-vault.http-dto';

@Controller('vault')
export class VaultController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post(':userId')
  async createVaultItem(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() dto: CreateVaultHttpDto,
  ): Promise<VaultDE> {
    return this.commandBus.execute<CreateVaultCommand, VaultDE>(
      new CreateVaultCommand(
        userId,
        dto.title,
        dto.type,
        dto.encryptedData,
        dto.iv,
        dto.authTag,
        dto.isFavorite,
      ),
    );
  }

  @Get(':id')
  async findVaultByUserId(
    @Param('id', ParseIntPipe) userId: number,
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

  @Put(':userId/:id')
  async updateVaultItem(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateVaultHttpDto,
  ): Promise<VaultDE> {
    return this.commandBus.execute<UpdateVaultCommand, VaultDE>(
      new UpdateVaultCommand(
        id,
        userId,
        dto.type,
        dto.encryptedData,
        dto.iv,
        dto.authTag,
        dto.isFavorite,
      ),
    );
  }

  @Patch(':userId/:id/favorite')
  async toggleFavoriteVaultItem(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<VaultDE> {
    return this.commandBus.execute<ToggleFavoriteVaultCommand, VaultDE>(
      new ToggleFavoriteVaultCommand(id, userId),
    );
  }

  @Delete(':userId/:id')
  @HttpCode(HttpStatus.OK)
  async deleteVaultItem(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ success: boolean }> {
    await this.commandBus.execute<DeleteVaultCommand, void>(new DeleteVaultCommand(id, userId));
    return { success: true };
  }
}
