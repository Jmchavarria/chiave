import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '../../common/common.module';
import { UsersModule } from '../users/users.module';
import { CreateEmailVerificationTokenHandler } from './application/commands/create-email-verification-token/create-email-verification-token.handler';
import { LoginUserHandler } from './application/commands/login-user/login-user.handler';
import { LogoutUserHandler } from './application/commands/logout-user/logout-user.handler';
import { RefreshTokensHandler } from './application/commands/refresh-token/refresh-tokens.handler';
import { VerifyAndActivateUserHandler } from './application/commands/verify-and-activate-user/verify-and-activate-user.handler';
import { GetCurrentUserHandler } from './application/queries/get-current-user.ts/get-current-user.handler';
import { EmailVerificationTokenPort } from './domain/ports/email-verification-token.port';
import { RefreshTokenRepositoryPort } from './domain/ports/refresh-token-repository.port';
import { TokenServicePort } from './domain/ports/token-service.port';
import { AuthController } from './infrastructure/http/auth.controller';
import { TypeOrmEmailVerificationTokenRepository } from './infrastructure/persistence/email-verification-token.repository';
import { EmailVerificationTokenOrmEntity } from './infrastructure/persistence/orm/email-verification-token.orm-entity';
import { RefreshTokenOrmEntity } from './infrastructure/persistence/orm/refresh-token.orm-entity';
import { TypeOrmRefreshTokenRepository } from './infrastructure/persistence/typeorm-refresh-token.repository';
import { JwtTokenService } from './infrastructure/security/jwt-token-service';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';

@Module({
  imports: [
    ConfigModule,
    CqrsModule,
    UsersModule,
    CommonModule,
    TypeOrmModule.forFeature([RefreshTokenOrmEntity, EmailVerificationTokenOrmEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
        signOptions: {
          expiresIn: '15m',
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    LoginUserHandler,
    RefreshTokensHandler,
    LogoutUserHandler,
    GetCurrentUserHandler,
    TypeOrmRefreshTokenRepository,
    CreateEmailVerificationTokenHandler,
    VerifyAndActivateUserHandler,
    JwtService,
    {
      provide: EmailVerificationTokenPort,
      useClass: TypeOrmEmailVerificationTokenRepository,
    },
    {
      provide: RefreshTokenRepositoryPort,
      useClass: TypeOrmRefreshTokenRepository,
    },
    {
      provide: TokenServicePort,
      useClass: JwtTokenService,
    },
  ],
  exports: [EmailVerificationTokenPort, JwtModule, PassportModule],
})
export class AuthModule {}
