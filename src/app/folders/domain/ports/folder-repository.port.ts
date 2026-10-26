import type { FolderDE } from '../entities/folder.domain-entity';

export interface CreateFolderProps {
  name: string;
  userId: number;
}

export abstract class FolderRepositoryPort {
  abstract save(folder: FolderDE): Promise<FolderDE>;
  abstract findByNameAndUserId(name: string, userId: number): Promise<FolderDE | null>;
  abstract findById(id: number): Promise<FolderDE | null>;
  abstract findByUserId(userId: number): Promise<FolderDE[]>;
  abstract delete(id: number): Promise<void>;
}
