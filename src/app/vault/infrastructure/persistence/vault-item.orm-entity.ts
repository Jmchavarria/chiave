// src/app/vault/infrastructure/persistence/entities/vault-item.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { VaultItemEnumType } from '../../types/vault-item-type.enum';
import { UserOrmEntity } from '../../../users/infrastructure/persistence/user.orm-entity';

@Entity('vault_items')
export class VaultItemsOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number; // Identificador numérico del usuario propietario

  @Column({ nullable: true })
  folderId?: number; // Identificador numérico de la carpeta (opcional)

  @Column({
    type: 'enum',
    enum: VaultItemEnumType,
    default: VaultItemEnumType.LOGIN,
  })
  type: VaultItemEnumType;

  // ==========================================
  // CAMPOS COMUNES
  // ==========================================
  @Column()
  title: string;

  @Column({ default: false })
  isFavorite: boolean;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @ManyToOne(() => UserOrmEntity, (user) => user.vaultItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserOrmEntity;
  // ==========================================
  // 1. TIPO LOGIN
  // ==========================================
  @Column({ nullable: true })
  username?: string;

  @Column({ type: 'text', nullable: true })
  secretValue?: string;

  @Column({ nullable: true })
  authenticatorKey?: string;

  @Column({ type: 'text', nullable: true })
  website?: string;

  @Column({ nullable: true })
  cardholderName?: string;

  @Column({ nullable: true })
  brand?: string;

  @Column({ nullable: true })
  number?: string;

  @Column({ nullable: true })
  expMonth?: string;

  @Column({ nullable: true })
  expYear?: string;

  @Column({ nullable: true })
  code?: string; // CVV

  @Column({ nullable: true })
  identityTitle?: string;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  middleName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ nullable: true })
  identityUsername?: string;

  @Column({ nullable: true })
  company?: string;

  @Column({ nullable: true })
  ssn?: string;

  @Column({ nullable: true })
  passportNumber?: string;

  @Column({ nullable: true })
  passportExpDate?: string;

  @Column({ nullable: true })
  licenseNumber?: string;

  @Column({ nullable: true })
  identityEmail?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  address1?: string;

  @Column({ nullable: true })
  address2?: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  state?: string;

  @Column({ nullable: true })
  postalCode?: string;

  @Column({ nullable: true })
  country?: string;

  @Column({ type: 'text', nullable: true })
  publicKey?: string;

  @Column({ type: 'text', nullable: true })
  privateKey?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
