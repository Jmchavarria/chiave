import { IsEnum, IsNotEmpty, IsOptional, IsString, IsBoolean } from 'class-validator';
import { VaultItemEnumType } from '../../types/vault-item.type';

export class CreateVaultHttpDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsEnum(VaultItemEnumType)
  @IsOptional()
  type?: VaultItemEnumType;

  @IsBoolean()
  @IsOptional()
  isFavorite?: boolean;

  @IsString()
  @IsNotEmpty()
  secretValue: string;
}
