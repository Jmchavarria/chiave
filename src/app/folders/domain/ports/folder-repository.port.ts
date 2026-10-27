import type { FolderDE } from '../entities/folder.domain-entity';

export interface CreateFolderProps {
  name: string;
  userId: number;
}

export interface UpdateFolderProps {
  userId: number;
  name?: string;
}

export abstract class FolderRepositoryPort {
  abstract save(folder: FolderDE): Promise<FolderDE>;
  abstract findByNameAndUser(name: string, userId: number): Promise<FolderDE | null>;
  abstract findArchivedByUser(userId: number): Promise<FolderDE[]>;
  abstract findById(id: number): Promise<FolderDE | null>;
  abstract findByUserId(userId: number): Promise<FolderDE[]>;
  abstract delete(id: number): Promise<void>;

  abstract findTrashByUserId(userId: number): Promise<FolderDE[]>;
  abstract softDeleteByFolderIdCascading(folderId: number, userId: number): Promise<void>;
  abstract restoreByFolderIdCascading(folderId: number, userId: number): Promise<void>;
}
