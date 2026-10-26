import { FolderDE } from '../../domain/entities/folder.domain-entity';
import { FolderOrmEntity } from '../persistence/folder.orm-entity';

export class FolderMapper {
  static toDomain(entity: FolderOrmEntity): FolderDE {
    return FolderDE.reconstituite({
      id: entity.id,
      name: entity.name,
      userId: entity.userId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  static toPersistence(domain: FolderDE): FolderOrmEntity {
    const entity = new FolderOrmEntity();

    // Si la entidad ya tiene un ID (fue recuperada o guardada), se lo asignamos
    if (domain.id) {
      entity.id = domain.id;
    }

    entity.name = domain.name;
    entity.userId = domain.userId;

    return entity;
  }
}
