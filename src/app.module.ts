import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './app/users/users.module';
import { AuthModule } from './app/auth/auth.module';
import { VaultModule } from './app/vault/vault.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT ?? 5432),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME ?? 'chiave',
      autoLoadEntities: true,
      synchronize: false,
    }),
    UsersModule,
    AuthModule,
    VaultModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
