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
      userId: input.userId,
      folderId: input.folderId,
      type: input.type,
      title: input.title,
      isFavorite: input.isFavorite,
      notes: input.notes,
      username: input.username,
      passwordHash: input.passwordHash,
      authenticatorKey: input.authenticatorKey,
      website: input.website,
      cardholderName: input.cardholderName,
      brand: input.brand,
      number: input.number,
      expMonth: input.expMonth,
      expYear: input.expYear,
      cvv: input.cvv,
      courtesyTitle: input.courtesyTitle,
      firstName: input.firstName,
      middleName: input.middleName,
      lastName: input.lastName,
      identityUsername: input.identityUsername,
      company: input.company,
      ssn: input.ssn,
      passportNumber: input.passportNumber,
      licenseNumber: input.licenseNumber,
      email: input.email,
      phone: input.phone,
      address1: input.address1,
      address2: input.address2,
      address3: input.address3,
      city: input.city,
      state: input.state,
      postalCode: input.postalCode,
      country: input.country,
      publicKey: input.publicKey,
      privateKey: input.privateKey,
      fingerPrint: input.fingerPrint,
    });

    const savedEntity = await this.repository.save(vault);

    return VaultMapper.toDomain(savedEntity);
  }

  async findByUserId(input: FindVaultByUserIdProps): Promise<Pagination<VaultDE[]>> {
    const { userId, pageQuery = 1, search, takeQuery = 5, isFavorite } = input;

    const query = this.repository
      .createQueryBuilder('vault')
      .where('vault.userId = :userId', { userId });

    if (isFavorite !== undefined) {
      query.andWhere('vault.isFavorite = :isFavorite', { isFavorite });
    }

    if (search?.trim()) {
      query.andWhere(
        `(
          vault.title ILIKE :search
          OR vault.type::text ILIKE :search
          OR vault.username ILIKE :search
          OR vault.website ILIKE :search
          OR vault.email ILIKE :search
        )`,
        { search: `%${search.trim()}%` },
      );
    }

    const skip = (pageQuery - 1) * takeQuery;

    const [data, total] = await query
      .orderBy('vault.createdAt', 'DESC')
      .skip(skip)
      .take(takeQuery)
      .getManyAndCount();

    return new Pagination(
      data.map((entity) => VaultMapper.toDomain(entity)),
      total,
      pageQuery,
      takeQuery,
    );
  }

  async findById(id: number, userId: number): Promise<VaultDE | null> {
    const entity = await this.repository.findOne({
      where: { id, userId },
    });

    return entity ? VaultMapper.toDomain(entity) : null;
  }

  async softDelete(id: number, userId: number): Promise<void> {
    await this.repository.softDelete({ id, userId });
  }
}
