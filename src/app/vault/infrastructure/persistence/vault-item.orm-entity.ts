import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { VaultItemType } from '../../types/vault-item.type';

@Entity('vault_items')
export class VaultOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Index()
  @Column({ name: 'user_id', type: 'uuid' })
  userId: number;

  @Column({
    type: 'enum',
    enum: VaultItemType,
    default: VaultItemType.LOGIN,
  })
  type: VaultItemType;

  @Column({ name: 'is_favorite', type: 'boolean', default: false })
  isFavorite: boolean;

  @Column({ name: 'encrypted_data', type: 'text' })
  encryptedData: string;

  @Column({ name: 'iv', type: 'varchar', length: 64 })
  iv: string;

  @Column({ name: 'auth_tag', type: 'varchar', length: 64 })
  authTag: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;
}
