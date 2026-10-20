import { IsBoolean, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { VaultItemEnumType } from '../../types/vault-item.type';

export class CreateVaultHttpDto {
  @IsNotEmpty()
  @IsEnum(VaultItemEnumType)
  type: VaultItemEnumType;

  @IsBoolean()
  isFavorite: boolean;

  @IsString()
  encryptedData: string;

  @IsString()
  iv: string;

  @IsString()
  authTag: string;
}
