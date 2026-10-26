import type { UserStatusType } from '../types/user-status.type';

export interface IUser {
  id?: number;
  name: string;
  email: string;
  passwordHash?: string;
  status: UserStatusType;
  emailVerifiedAt: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}
