import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '../../application/commands/create-user/create-user.command';
import { UserDE } from '../../domain/entities/user.domain-entity';
import { CreateUserHttDto } from './dto/create-user.http-dto';
import { FindUserByIdQuery } from '../../application/queries/find-user-by-id/find-user-by-id.query';

@Controller('users')
export class UsersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() body: CreateUserHttDto): Promise<UserDE> {
    return this.commandBus.execute<CreateUserCommand, UserDE>(
      new CreateUserCommand(body.name, body.email, body.password),
    );
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number): Promise<UserDE> {
    return this.queryBus.execute<FindUserByIdQuery, UserDE>(new FindUserByIdQuery(id));
  }
}
