import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { UserRepositoryPort } from '../../domain/ports/user-repository.port';
import { UserDE } from '../../domain/entities/user.domain-entity';
import { UserOrmEntity } from './user.orm-entity';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class TypeOrmUserRepository implements UserRepositoryPort {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly repository: Repository<UserOrmEntity>,
  ) {}

  async findByEmail(email: string): Promise<UserDE | null> {
    const user = await this.repository
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.email = :email', { email })
      .getOne();

    return user ? UserMapper.toDomain(user) : null;
  }

  async save(user: UserDE): Promise<UserDE> {
    const userEntity = this.repository.create({
      id: user.id,
      name: user.name,
      email: user.email,
      passwordHash: user.passwordHash,
      status: user.status,
      emailVerifiedAt: user.emailVerifiedAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });

    const savedEntity = await this.repository.save(userEntity);

    return UserMapper.toReconstituite(savedEntity);
  }

  async findById(id: number): Promise<UserDE | null> {
    const user = await this.repository.findOne({
      where: { id },
    });

    return user ? UserMapper.toReconstituite(user) : null;
  }
}
