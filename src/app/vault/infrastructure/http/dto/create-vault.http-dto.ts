import { IsEnum, IsString, IsOptional, IsBoolean, IsObject, IsNotEmpty } from 'class-validator';
import { IsValidVaultData } from './is-valid-vault-data.validator';
import { VaultItemEnumType } from '../../../types/vault-item-type.enum';

export class CreateVaultHttpDto {
  @IsString({ message: 'El título debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El título no puede estar vacío' })
  title: string;

  @IsEnum(VaultItemEnumType, { message: 'El tipo de ítem de bóveda no es válido' })
  type: VaultItemEnumType;

  @IsString({ message: 'El valor secreto debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El valor secreto es obligatorio' })
  secretValue: string;

  @IsObject({ message: 'El campo data debe ser un objeto válido' })
  @IsValidVaultData({ message: 'Estructura de datos inválida para este tipo de vault' })
  data: Record<string, unknown>;

  @IsString({ message: 'Las notas deben ser una cadena de texto' })
  @IsOptional()
  notes?: string;

  @IsBoolean({ message: 'El campo isFavorite debe ser un valor booleano' })
  @IsOptional()
  isFavorite?: boolean;
}
