import { UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginUserCommand } from './login-user.command';
import { PasswordHasherPort } from '../../../../users/domain/ports/password-hasher.port';
import { UserRepositoryPort } from '../../../../users/domain/ports/user-repository.port';
import { TokenServicePort } from '../../../domain/ports/token-service.port';

export interface LoginUserResult {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
}

@CommandHandler(LoginUserCommand)
export class LoginUserHandler implements ICommandHandler<LoginUserCommand, LoginUserResult> {
  constructor(
    private readonly userRepository: UserRepositoryPort,
    private readonly passwordHasher: PasswordHasherPort,
    private readonly tokenService: TokenServicePort,
  ) {}

  async execute(command: LoginUserCommand): Promise<LoginUserResult> {
    const user = await this.userRepository.findByEmail(command.email);

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await this.passwordHasher.verify(command.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('This account is not set up for logging in');
    }

    if (user.id === undefined) {
      throw new UnauthorizedException('The user could not be authenticated');
    }

    const accessToken = await this.tokenService.signAccessToken({
      sub: user.id,
      email: user.email,
    });

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn: 900,
    };
  }
}
