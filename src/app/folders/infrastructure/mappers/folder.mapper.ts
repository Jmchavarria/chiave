import { FolderDE } from '../../domain/entities/folder.domain-entity';
import { FolderOrmEntity } from '../persistence/folder.orm-entity';

export class FolderMapper {
  static toDomain(entity: FolderOrmEntity): FolderDE {
    return FolderDE.reconstituite({
      id: entity.id,
      name: entity.name,
      isArchived: entity.isArchived,
      isDeleted: entity.isDeleted,
      userId: entity.userId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  static toPersistence(domain: FolderDE): FolderOrmEntity {
    const entity = new FolderOrmEntity();

    if (domain.id) {
      entity.id = domain.id;
    }
    entity.isDeleted = domain.isDeleted;
    entity.isArchived = domain.isArchived;
    entity.name = domain.name;
    entity.userId = domain.userId;

    return entity;
  }
}
