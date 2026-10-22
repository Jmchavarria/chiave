import type { EncryptionPort } from '../../domain/ports/encryption-repository.port';
import crypto from 'node:crypto';
import 'dotenv/config';

export interface EncryptResult {
  encryptedData: string;
  iv: string;
  authTag: string;
}

export class EncryptionAdapter implements EncryptionPort {
  private readonly algorithm = 'aes-256-gcm';
  private readonly key: Buffer;

  constructor() {
    const secretKey = process.env.VAULT_ENCRYPTION_KEY;

    if (!secretKey) {
      throw new Error('ERROR: The environment variable ‘VAULT_ENCRYPTION_KEY’ is not defined.');
    }

    // Deriva una clave fija de 32 bytes (256 bits) requerida por AES-256
    this.key = crypto.scryptSync(secretKey, 'salt', 32);
  }

  encrypt(plainText: string): EncryptResult {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);

    let encrypted = cipher.update(plainText, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag().toString('hex');

    return {
      encryptedData: encrypted,
      iv: iv.toString('hex'),
      authTag: authTag,
    };
  }

  decrypt(encryptedData: string, iv: string, authTag: string): string {
    const ivBuffer = Buffer.from(iv, 'hex');
    const authTagBuffer = Buffer.from(authTag, 'hex');

    const decipher = crypto.createDecipheriv(this.algorithm, this.key, ivBuffer);
    decipher.setAuthTag(authTagBuffer);

    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }
}
