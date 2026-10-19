import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UserRepositoryPort } from './domain/ports/user-repository.port';
import { TypeOrmUserRepository } from './infrastructure/persistence/typeorm-user.repository';
import { UserOrmEntity } from './infrastructure/persistence/user.orm-entity';
import { CreateUserHandler } from './application/commands/create-user/create-user.handler';
import { PasswordHasherPort } from './domain/ports/password-hasher.port';
import { Argon2PasswordHasher } from './infrastructure/hashing/argon2-password-hasher';
import { UsersController } from './infrastructure/http/users.controller';
import { GetUserByEmailHandler } from './application/queries/find-user-by-email/find-user-by-email.handler';
import { GetUserByIdHandler } from './application/queries/find-user-by-id/find-user-by-id.handler';

@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity]), CqrsModule],
  controllers: [UsersController],
  providers: [
    CreateUserHandler,
    GetUserByEmailHandler,
    GetUserByIdHandler,
    {
      provide: PasswordHasherPort,
      useClass: Argon2PasswordHasher,
    },
    {
      provide: UserRepositoryPort,
      useClass: TypeOrmUserRepository,
    },
  ],
  exports: [UserRepositoryPort, PasswordHasherPort],
})
export class UsersModule {}
