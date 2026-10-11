import type { UserStatus } from '../types/user-status.type';

export interface IUser {
  id?: number;
  name: string;
  email: string;
  passwordHash?: string;
  status: UserStatus;
  emailVerifiedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
