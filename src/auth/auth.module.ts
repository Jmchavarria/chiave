import { ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { LoginUserHandler } from './application/commands/login-user/login-user.handler';
import { TokenServicePort } from './domain/ports/token-service.port';
import { JwtTokenService } from './infrastructure/security/jwt-token-service';
import { Module } from '@nestjs/common';
import { AuthController } from './infrastructure/http/auth.controller';

@Module({
  imports: [
    CqrsModule,
    UsersModule,
    JwtModule.registerAsync({
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
    LoginUserHandler,
    {
      provide: TokenServicePort,
      useClass: JwtTokenService,
    },
  ],
})
export class AuthModule {}
