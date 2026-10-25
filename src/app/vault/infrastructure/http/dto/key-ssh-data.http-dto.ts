import { Type } from 'class-transformer';
import { IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { CustomFieldHttpDto } from './custom-fields.http-dto';

export class KeySshDataHttpDto {
  @IsString({ message: 'La clave privada debe ser una cadena de texto' })
  @IsOptional() // A veces solo se guarda la pública o el usuario decide dónde ponerla
  privateKey?: string;

  @IsString({ message: 'La clave pública debe ser una cadena de texto' })
  @IsOptional()
  publicKey?: string;

  @IsString({ message: 'La huella digital (fingerprint) debe ser una cadena de texto' })
  @IsOptional()
  fingerPrint?: string;

  @IsArray({ message: 'Los campos personalizados deben ser un arreglo' })
  @ValidateNested({ each: true })
  @Type(() => CustomFieldHttpDto)
  @IsOptional()
  customFields?: CustomFieldHttpDto[];
}
