import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { UserStatusType } from '../../domain/types/user-status.type';
import { VaultItemsOrmEntity } from '../../../vault/infrastructure/persistence/vault-item.orm-entity';

@Entity({ name: 'users' })
@Index('UQ_users_email', ['email'], { unique: true })
export class UserOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 254 })
  email: string;

  @Column({ name: 'password_hash', type: 'varchar', length: 255, select: false })
  passwordHash: string;

  @Column({
    type: 'varchar',
    length: 30,
    default: 'PENDING_VERIFICATION',
  })
  status: UserStatusType;

  @OneToMany(() => VaultItemsOrmEntity, (vaultItem) => vaultItem.user)
  vaultItems: VaultItemsOrmEntity[];

  @Column({
    name: 'email_verified_at',
    type: 'timestamptz',
    nullable: true,
  })
  emailVerifiedAt: Date | null;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
  })
  updatedAt: Date;
}
