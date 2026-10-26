import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateFolderHandler } from './application/commands/create-folder/create-folder.handler';
import { FolderRepositoryPort } from './domain/ports/folder-repository.port';
import { FolderController } from './infrastructure/http/folder.controller';
import { FolderOrmEntity } from './infrastructure/persistence/folder.orm-entity';
import { TypeOrmfolderRepository } from './infrastructure/persistence/typeorm-folder.repository';
import { AuthModule } from '../auth/auth.module';
import { FindFolderByIdHandler } from './application/queries/find-folder-by-id/find-folder-by-id.handler';
import { FindFoldersByUserHandler } from './application/queries/find-folders-by-user/find-folders-by-user.handler';
import { DeleteFolderHandler } from './application/commands/delete-folder/delete-folder.handler';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([FolderOrmEntity]), AuthModule],
  controllers: [FolderController],
  providers: [
    CreateFolderHandler,
    FindFolderByIdHandler,
    FindFoldersByUserHandler,
    DeleteFolderHandler,
    {
      provide: FolderRepositoryPort,
      useClass: TypeOrmfolderRepository,
    },
  ],
  exports: [FolderRepositoryPort],
})
export class FolderModule {}
