import type { EncryptResult } from '../../infrastructure/persistence/encryption.adapter';

export abstract class EncryptionPort {
  abstract encrypt(plainText: string): EncryptResult;
  abstract decrypt(encryptedData: string, iv: string, authTag: string): string;
}
