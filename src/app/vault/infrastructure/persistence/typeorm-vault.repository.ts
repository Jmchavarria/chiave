import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { VaultItemsOrmEntity } from './vault-item.orm-entity';
import { VaultDE } from '../../domain/entities/vault.domain-entity';
import { VaultMapper } from '../mappers/vault.mapper';
import {
  FindVaultByUserIdProps,
  VaultRepositoryPort,
} from '../../domain/ports/vault-repository.port';
import { Pagination } from '../../../../common/pagintation';
@Injectable()
export class TypeOrmVaultRepository implements VaultRepositoryPort {
  constructor(
    @InjectRepository(VaultItemsOrmEntity)
    private readonly repository: Repository<VaultItemsOrmEntity>,
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

  async findByUserId(input: FindVaultByUserIdProps): Promise<Pagination<VaultDE[]>> {
    const { userId, pageQuery = 1, search, takeQuery = 5, isFavorite } = input;
    const query = this.repository
      .createQueryBuilder('vault')
      .where('vault.user_id = :userId', { userId });

    for (const [field, value] of Object.entries({ isFavorite })) {
      if (value !== undefined) {
        query.andWhere(`vault.${field} = :${field} `, { [field]: value });
      }
    }

    const skip = (pageQuery - 1) * takeQuery;

    if (search?.trim()) {
      query.andWhere(
        `
        (
        vault.email ILIKE :search OR
        vault.query ILIKE :search
        )
        `,
        {
          search: `%${search}`,
        },
      );
    }
    const data = await query
      .orderBy(`vault.createdAt`, 'DESC')
      .skip(skip)
      .take(takeQuery)
      .getMany();

    const total = await query.getCount();

    return new Pagination(
      data.map((entity) => VaultMapper.toReconstituite(entity)),
      total,
      pageQuery,
      takeQuery,
    );
  }
}
