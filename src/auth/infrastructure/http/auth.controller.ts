import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { LoginUserCommand } from '../../application/commands/login-user/login-user.command';
import { LoginUserResult } from '../../application/commands/login-user/login-user.handler';
import { UserDE } from '../../../users/domain/entities/user.domain-entity';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUserResult } from '../../application/queries/get-current-user.ts/get-current-user.handler';
import { GetCurrentUserQuery } from '../../application/queries/get-current-user.ts/get-current-user.query';
import { LoginHttpDto } from './dto/login.http-dto';

interface AuthenticatedRequest {
  user: {
    sub: number;
    email: string;
  };
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginHttpDto): Promise<LoginUserResult> {
    return this.commandBus.execute<LoginUserCommand, LoginUserResult>(
      new LoginUserCommand(body.email, body.password),
    );
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@Req() request: AuthenticatedRequest): Promise<CurrentUserResult> {
    const user = await this.queryBus.execute<GetCurrentUserQuery, UserDE>(
      new GetCurrentUserQuery(request.user.sub),
    );
    if (user.id === undefined) {
      throw new Error('The user does not have a valid ID');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      status: user.status,
      emailVerifiedAt: user.emailVerifiedAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
