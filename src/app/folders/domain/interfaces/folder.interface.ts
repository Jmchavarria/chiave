export interface IFolder {
  id?: number;
  name: string;
  userId: number;
  isArchived?: boolean;
  isDeleted: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
