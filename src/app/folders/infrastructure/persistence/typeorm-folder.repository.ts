import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FolderRepositoryPort } from '../../domain/ports/folder-repository.port';
import { FolderOrmEntity } from './folder.orm-entity';
import { FolderDE } from '../../domain/entities/folder.domain-entity';
import { FolderMapper } from '../mappers/folder.mapper';

@Injectable()
export class TypeOrmfolderRepository implements FolderRepositoryPort {
  constructor(
    @InjectRepository(FolderOrmEntity)
    private readonly repository: Repository<FolderOrmEntity>,
  ) {}

  async save(folder: FolderDE): Promise<FolderDE> {
    const persistenceEntity = FolderMapper.toPersistence(folder);
    const savedEntity = await this.repository.save(persistenceEntity);
    return FolderMapper.toDomain(savedEntity);
  }

  async findByNameAndUserId(name: string, userId: number): Promise<FolderDE | null> {
    const record = await this.repository.findOne({
      where: { name, userId },
    });
    return record ? FolderMapper.toDomain(record) : null;
  }

  async findById(id: number): Promise<FolderDE | null> {
    const found = await this.repository.findOne({ where: { id } });
    return found ? FolderMapper.toDomain(found) : null;
  }

  async findByUserId(userId: number): Promise<FolderDE[]> {
    const found = await this.repository.find({ where: { userId } });
    return found.map((item) => FolderMapper.toDomain(item));
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
