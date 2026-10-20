import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserOrmEntity } from '../../../users/infrastructure/persistence/user.orm-entity';
import { VaultItemEnumType } from '../../types/vault-item.type';

@Entity('vault_items')
export class VaultItemsOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ name: 'user_id', type: 'number' })
  userId: number;

  @ManyToOne(() => UserOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserOrmEntity;

  @Column({
    type: 'enum',
    enum: VaultItemEnumType,
    default: VaultItemEnumType.LOGIN,
  })
  type: VaultItemEnumType;

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
