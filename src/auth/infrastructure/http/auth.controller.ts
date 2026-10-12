import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { LoginUserCommand } from '../../application/commands/login-user/login-user.command';
import { LoginUserResult } from '../../application/commands/login-user/login-user.handler';
import { LogoutUserCommand } from '../../application/commands/logout-user/logout-user.command';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginHttpDto } from './dto/login.http-dto';
import { RefreshTokensCommand } from '../../application/commands/refresh-token/refresh-tokens.command';
import { RefreshTokensResult } from '../../application/commands/refresh-token/refresh-tokens.handler';
import { GetCurrentUserQuery } from '../../application/queries/get-current-user.ts/get-current-user.query';
import { UserDE } from '../../../users/domain/entities/user.domain-entity';
import { VerifyEmailCommand } from '../../application/commands/verify-email/verify-email.command';

interface AuthenticatedRequest {
  user: {
    sub: number;
    email: string;
  };
}

interface RefreshTokenHttpDto {
  refreshToken: string;
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() body: LoginHttpDto): Promise<LoginUserResult> {
    return this.commandBus.execute<LoginUserCommand, LoginUserResult>(
      new LoginUserCommand(body.email, body.password),
    );
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(@Body() body: RefreshTokenHttpDto): Promise<RefreshTokensResult> {
    return this.commandBus.execute<RefreshTokensCommand, RefreshTokensResult>(
      new RefreshTokensCommand(body.refreshToken),
    );
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Body() body: RefreshTokenHttpDto): Promise<void> {
    await this.commandBus.execute(new LogoutUserCommand(body.refreshToken));
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getCurrentUser(@Req() request: AuthenticatedRequest): Promise<UserDE> {
    return this.queryBus.execute<GetCurrentUserQuery, UserDE>(
      new GetCurrentUserQuery(request.user.sub),
    );
  }

  @Post('verify-email')
  async verifyEmail(@Query('token') token: string): Promise<void> {
    await this.commandBus.execute(new VerifyEmailCommand(token));
  }
}
