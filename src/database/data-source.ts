import 'dotenv/config';
import { DataSource } from 'typeorm';
import { UserOrmEntity } from '../app/users/infrastructure/persistence/user.orm-entity';
import { EmailVerificationTokenOrmEntity } from '../app/auth/infrastructure/persistence/orm/email-verification-token.orm-entity';
import { RefreshTokenOrmEntity } from '../app/auth/infrastructure/persistence/orm/refresh-token.orm-entity';
export const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [UserOrmEntity, RefreshTokenOrmEntity, EmailVerificationTokenOrmEntity],
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV === 'development',
});
