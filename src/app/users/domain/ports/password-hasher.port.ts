export abstract class PasswordHasherPort {
  abstract hash(password: string): Promise<string>;
  abstract verify(plainText: string, hash: string): Promise<boolean>;
}
