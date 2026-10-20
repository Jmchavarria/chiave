import { IsEnum, IsBoolean, IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { VaultItemEnumType } from '../../types/vault-item.type';

export class CreateVaultHttpDto {
  @IsEnum(VaultItemEnumType)
  @IsNotEmpty()
  type: VaultItemEnumType;

  @IsString()
  @IsNotEmpty()
  encryptedData: string;

  @IsString()
  @IsNotEmpty()
  iv: string;

  @IsString()
  @IsNotEmpty()
  authTag: string;

  @IsBoolean()
  @IsOptional()
  isFavorite?: boolean;
}
