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
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { VaultDE } from '../../domain/entities/vault.domain-entity';
import { Pagination } from '../../../../common/pagintation';
import { FindVaultByUserIdQuery } from '../../application/queries/find-vault-by-user-id/find-vault-by-user-id.query';
import { FindVaultByUserIdHttpDto } from './find-vault-by-user-id.http-dto';
import { CreateVaultCommand } from '../../application/commands/create-vault/create-vault.command';
import { CreateVaultHttpDto } from './dto/create-vault.http-dto';
import { UpdateVaultCommand } from '../../application/commands/update-vault/update-vault.command';
import { DeleteVaultCommand } from '../../application/commands/delete-vault/delete-vault.command';
import { CurrentUser } from '../../../auth/decorators/curren-user.decorator';
import { JwtAuthGuard } from '../../../auth/infrastructure/http/guards/jwt-auth.guard';
import { UpdateVaultHttpDto } from './dto/update-vault.http-dto';
import { FindArchivedVaultsQuery } from '../../application/queries/find-archived-vaults/find-archived-vaults.query';
import { ArchiveVaultCommand } from '../../application/commands/archive-vault/archive-vault.command';
import { UnarchiveVaultCommand } from '../../application/commands/unarchive-vault/unarchive-vault.command';
import { FindTrashVaultsQuery } from '../../application/queries/find-trash-vaults/find-trash-vaults.query';

@UseGuards(JwtAuthGuard)
@Controller('vault')
export class VaultController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async createVaultItem(
    @CurrentUser('sub') userId: number,
    @Body() input: CreateVaultHttpDto,
  ): Promise<VaultDE> {
    return this.commandBus.execute<CreateVaultCommand, VaultDE>(
      new CreateVaultCommand(userId, input),
    );
  }

  @Get('by-user')
  async findVaultByUserId(
    @CurrentUser('sub') userId: number,
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
  @Patch(':id')
  async updateVaultItem(
    @CurrentUser('sub') userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() input: UpdateVaultHttpDto,
  ): Promise<VaultDE> {
    return this.commandBus.execute<UpdateVaultCommand, VaultDE>(
      new UpdateVaultCommand(id, userId, input),
    );
  }

  @Get('archived')
  async findArchived(@CurrentUser('sub') userId: number): Promise<VaultDE[]> {
    return this.queryBus.execute(new FindArchivedVaultsQuery(userId));
  }

  @Patch(':id/archive')
  async archive(
    @CurrentUser('sub') userId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<VaultDE> {
    return this.commandBus.execute(new ArchiveVaultCommand(id, userId));
  }

  @Patch(':id/unarchive')
  async unarchive(
    @CurrentUser('sub') userId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<VaultDE> {
    return this.commandBus.execute(new UnarchiveVaultCommand(id, userId));
  }

  @Get('trash')
  async findTrash(@CurrentUser('sub') userId: number): Promise<VaultDE[]> {
    return this.queryBus.execute(new FindTrashVaultsQuery(userId));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteVaultItem(
    @CurrentUser('sub') userId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ success: boolean }> {
    await this.commandBus.execute<DeleteVaultCommand, void>(new DeleteVaultCommand(id, userId));
    return { success: true };
  }
}
