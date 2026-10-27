import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  ParseIntPipe,
  Delete,
  Patch,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateFolderCommand } from '../../application/commands/create-folder/create-folder.command';
import { JwtAuthGuard } from '../../../auth/infrastructure/http/guards/jwt-auth.guard';
import { CurrentUser } from '../../../auth/decorators/curren-user.decorator';
import { CreateFolderHttpDto } from './dto/create-folder.http-dto';
import { VaultDE } from '../../../vault/domain/entities/vault.domain-entity';
import { FindFolderByIdQuery } from '../../application/queries/find-folder-by-id/find-folder-by-id-query';
import { FindFoldersByUserQuery } from '../../application/queries/find-folders-by-user/find-folders-by-user.query';
import { FolderDE } from '../../domain/entities/folder.domain-entity';
import { DeleteFolderCommand } from '../../application/commands/delete-folder/delete-folder.command';
import { UpdateFolderCommand } from '../../application/commands/update-folder/update-folder.command';
import { UpdateFolderHttpDto } from './dto/update-folder.http-dto';
import { FindArchivedFoldersQuery } from '../../application/queries/find-archived-folder/find-archived-folder.query';
import { ArchiveFolderCommand } from '../../application/commands/archive-folder/archive-folder.command';
import { UnarchiveFolderCommand } from '../../application/commands/unarchive-folder/unarchive-folder.command';
import { SoftDeleteFolderCommand } from '../../application/commands/soft-delete-folder/soft-delete-folder.command';
import { RestoreFolderCommand } from '../../application/commands/restore-folder/restore-folder.command';
import { FindTrashFoldersQuery } from '../../application/queries/find-trash-folders/find-trash-folders.query';

@Controller('folder')
@UseGuards(JwtAuthGuard)
export class FolderController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async create(
    @CurrentUser('sub') userId: number,
    @Body() input: CreateFolderHttpDto,
  ): Promise<VaultDE> {
    return this.commandBus.execute(new CreateFolderCommand(userId, input));
  }

  @Patch(':id')
  async update(
    @CurrentUser('sub') userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() input: UpdateFolderHttpDto,
  ): Promise<VaultDE> {
    return this.commandBus.execute(new UpdateFolderCommand(id, userId, input));
  }

  @Get(':id')
  async findById(
    @CurrentUser('sub') userId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<VaultDE | null> {
    return this.queryBus.execute(new FindFolderByIdQuery(id, userId));
  }

  @Get()
  async findByUser(@CurrentUser('sub') userId: number): Promise<FolderDE[]> {
    return this.queryBus.execute(new FindFoldersByUserQuery(userId));
  }

  @Get('archived')
  async findArchived(@CurrentUser('sub') userId: number): Promise<VaultDE[]> {
    return this.queryBus.execute(new FindArchivedFoldersQuery(userId));
  }

  @Patch(':id/archive')
  async archive(
    @CurrentUser('sub') userId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<FolderDE> {
    return this.commandBus.execute(new ArchiveFolderCommand(id, userId));
  }

  @Patch(':id/unarchive')
  async unarchive(
    @CurrentUser('sub') userId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<FolderDE> {
    return this.commandBus.execute(new UnarchiveFolderCommand(id, userId));
  }

  @Delete(':id')
  async softDelete(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('sub') userId: number,
  ): Promise<FolderDE> {
    return this.commandBus.execute(new SoftDeleteFolderCommand(id, userId));
  }

  @Patch(':id/restore')
  async restore(
    @Param('id', ParseIntPipe)
    id: number,
    @CurrentUser('sub') userId: number,
  ): Promise<FolderDE> {
    return this.commandBus.execute(new RestoreFolderCommand(id, userId));
  }

  @Get('trash')
  async FindTrash(@CurrentUser('sub') userId: number): Promise<FolderDE[]> {
    return this.queryBus.execute(new FindTrashFoldersQuery(userId));
  }

  @Delete(':id/permanent')
  async deletePermanent(
    @CurrentUser('sub') userId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    await this.commandBus.execute(new DeleteFolderCommand(id, userId));

    return {
      message: 'Folder successfully deleted',
    };
  }
}
