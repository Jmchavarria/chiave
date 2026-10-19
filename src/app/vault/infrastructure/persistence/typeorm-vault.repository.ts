import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { VaultOrmEntity } from './vault-item.orm-entity';
import { VaultDE } from '../../domain/entities/vault.domain-entity';
import { VaultMapper } from '../mappers/vault.mapper';
import { VaultRepositoryPort } from '../../domain/ports/vault-repository.port';
@Injectable()
export class TypeOrmUserRepository implements VaultRepositoryPort {
  constructor(
    @InjectRepository(VaultOrmEntity)
    private readonly repository: Repository<VaultOrmEntity>,
  ) {}

  async save(input: VaultDE): Promise<VaultDE> {
    const vault = this.repository.create({
      id: input.id,
      authTag: input.authTag,
      createdAt: input.authTag,
      updatedAt: input.authTag,
      encryptedData: input.encryptedData,
      isFavorite: input.isFavorite,
      iv: input.iv,
      type: input.type,
      userId: input.userId,
    });

    const savedEntity = await this.repository.save(vault);

    return VaultMapper.toReconstituite(savedEntity);
  }
}
