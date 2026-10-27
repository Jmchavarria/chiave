import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FolderRepositoryPort } from '../../domain/ports/folder-repository.port';
import { FolderOrmEntity } from './folder.orm-entity';
import { FolderDE } from '../../domain/entities/folder.domain-entity';
import { FolderMapper } from '../mappers/folder.mapper';
import { VaultItemsOrmEntity } from '../../../vault/infrastructure/persistence/vault-item.orm-entity';

@Injectable()
export class TypeOrmfolderRepository implements FolderRepositoryPort {
  constructor(
    @InjectRepository(FolderOrmEntity)
    private readonly repository: Repository<FolderOrmEntity>,
    @InjectRepository(VaultItemsOrmEntity)
    private readonly vaultOrmRepository: Repository<VaultItemsOrmEntity>,
  ) {}

  async save(folder: FolderDE): Promise<FolderDE> {
    const persistenceEntity = FolderMapper.toPersistence(folder);
    const savedEntity = await this.repository.save(persistenceEntity);
    return FolderMapper.toDomain(savedEntity);
  }

  async findByNameAndUser(name: string, userId: number): Promise<FolderDE | null> {
    const record = await this.repository.findOne({
      where: { isArchived: false, name, userId },
      order: { createdAt: 'DESC' },
    });
    return record ? FolderMapper.toDomain(record) : null;
  }

  async findArchivedByUser(userId: number): Promise<FolderDE[]> {
    const records = await this.repository.find({
      where: { userId, isArchived: true },
      order: { createdAt: 'DESC' },
    });
    return records.map((record) => FolderMapper.toDomain(record));
  }

  async findById(id: number): Promise<FolderDE | null> {
    const found = await this.repository.findOne({ where: { id } });
    return found ? FolderMapper.toDomain(found) : null;
  }

  async findByUserId(userId: number): Promise<FolderDE[]> {
    const found = await this.repository.find({ where: { userId } });
    return found.map((item) => FolderMapper.toDomain(item));
  }

  async findTrashByUserId(userId: number): Promise<FolderDE[]> {
    const ormEntities = await this.repository.find({
      where: {
        userId,
        isDeleted: true,
      },
      order: {
        updatedAt: 'DESC',
      },
    });

    return ormEntities.map((ormEntity) => FolderMapper.toDomain(ormEntity));
  }

  async softDeleteByFolderIdCascading(folderId: number, userId: number): Promise<void> {
    await this.repository.update(
      { id: folderId, userId },
      { isDeleted: true, isArchived: false, updatedAt: new Date() },
    );

    await this.vaultOrmRepository.update(
      { folderId, userId },
      { isDeleted: true, isArchived: false, updatedAt: new Date() },
    );
  }

  async restoreByFolderIdCascading(folderId: number, userId: number): Promise<void> {
    await this.vaultOrmRepository.update(
      { folderId, userId },
      { isDeleted: false, updatedAt: new Date() },
    );
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
