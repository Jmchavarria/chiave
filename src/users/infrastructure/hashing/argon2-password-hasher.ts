import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { PasswordHasherPort } from '../../domain/ports/password-hasher.port';

@Injectable()
export class Argon2PasswordHasher implements PasswordHasherPort {
  hash(password: string): Promise<string> {
    return argon2.hash(password);
  }

  async verify(password: string, passwordHash: string): Promise<boolean> {
    return argon2.verify(passwordHash, password);
  }
}
