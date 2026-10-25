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
import { UpdateVaultHttpDto } from './update-vault.http-dto';
import { CurrentUser } from '../../../auth/decorators/curren-user.decorator';
import { JwtAuthGuard } from '../../../auth/infrastructure/http/guards/jwt-auth.guard';

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
      new CreateVaultCommand(
        userId,
        input.title,
        input.username,
        input.website,
        input.secretValue,
        input.notes,
        input.type,
        input.isFavorite,
      ),
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
    @Param('id', ParseIntPipe) id: number,
    @Body() input: UpdateVaultHttpDto,
    @CurrentUser('sub') userId: number,
  ): Promise<VaultDE> {
    return this.commandBus.execute<UpdateVaultCommand, VaultDE>(
      new UpdateVaultCommand(id, userId, input.type, input.isFavorite),
    );
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
