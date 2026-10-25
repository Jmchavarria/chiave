import { IsString, IsOptional, IsEmail, IsEnum, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CourtesyTitle } from '../../../types/courtesy-title-type.enum';
import { CustomFieldHttpDto } from './custom-fields.http-dto';

export class IdentityDataHttpDto {
  // Básicos
  @IsEnum(CourtesyTitle, { message: 'El tratamiento de cortesía no es válido' })
  @IsOptional()
  courtesyTitle?: CourtesyTitle;

  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsOptional()
  firstName?: string;

  @IsString({ message: 'El apellido debe ser una cadena de texto' })
  @IsOptional()
  lastName?: string;

  @IsString({ message: 'El identificador de usuario debe ser una cadena de texto' })
  @IsOptional()
  usernameIdenity?: string; // (Nota: tienes un pequeño typo "idenity", ajústalo si deseas)

  @IsString({ message: 'La empresa debe ser una cadena de texto' })
  @IsOptional()
  enterprise?: string;

  // Información ID
  @IsString({ message: 'El número de seguro social debe ser una cadena de texto' })
  @IsOptional()
  socialSecurityNumber?: string;

  @IsString({ message: 'El número de pasaporte debe ser una cadena de texto' })
  @IsOptional()
  passportNumber?: string;

  @IsString({ message: 'El número de licencia o identidad fiscal debe ser una cadena de texto' })
  @IsOptional()
  licenseNumber?: string;

  // Contact information
  @IsEmail({}, { message: 'El correo electrónico no es válido' }) // 👈 CORREGIDO: Antes tenía IsDateString
  @IsOptional()
  email?: string;

  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  @IsOptional()
  phone?: string;

  // Address
  @IsString({ message: 'La dirección 1 debe ser una cadena de texto' })
  @IsOptional()
  address1?: string;

  @IsString({ message: 'La dirección 2 debe ser una cadena de texto' })
  @IsOptional()
  address2?: string;

  @IsString({ message: 'La dirección 3 debe ser una cadena de texto' })
  @IsOptional()
  address3?: string;

  @IsString({ message: 'La ciudad debe ser una cadena de texto' })
  @IsOptional()
  city?: string;

  @IsString({ message: 'El estado o provincia debe ser una cadena de texto' })
  @IsOptional()
  state?: string;

  @IsString({ message: 'El código postal debe ser una cadena de texto' })
  @IsOptional()
  postalCode?: string;

  @IsString({ message: 'El país debe ser una cadena de texto' })
  @IsOptional()
  country?: string;

  // Campos personalizados (Custom Fields)
  @IsArray({ message: 'Los campos personalizados deben ser un arreglo' })
  @ValidateNested({ each: true })
  @Type(() => CustomFieldHttpDto)
  @IsOptional()
  customFields?: CustomFieldHttpDto[];
}
