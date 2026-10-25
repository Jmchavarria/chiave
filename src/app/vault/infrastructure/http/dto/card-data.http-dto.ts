import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsCreditCard,
  Length,
  Matches,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CustomFieldHttpDto } from './custom-fields.http-dto';

export class CardDataHttpDto {
  @IsString({ message: 'El nombre del titular debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre del titular es obligatorio' })
  cardholderName: string;

  @IsString({ message: 'La marca de la tarjeta debe ser una cadena de texto' })
  @IsOptional()
  brand?: string; // Ej: visa, mastercard, amex

  @IsCreditCard({ message: 'El número de tarjeta de crédito no es válido' })
  @IsNotEmpty({ message: 'El número de tarjeta es obligatorio' })
  number: string;

  @IsString({ message: 'El mes de expiración debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El mes de expiración es obligatorio' })
  @Matches(/^(0[1-9]|1[0-2])$/, {
    message: 'El mes de expiración debe tener un formato válido (01 a 12)',
  })
  expMonth: string;

  @IsString({ message: 'El año de expiración debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El año de expiración es obligatorio' })
  @Matches(/^([0-9]{2}|[0-9]{4})$/, {
    message: 'El año de expiración debe tener 2 o 4 dígitos (ej: 28 o 2028)',
  })
  expYear: string;

  @IsString({ message: 'El código de seguridad debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El código de seguridad (CVV) es obligatorio' })
  @Length(3, 4, { message: 'El CVV debe tener entre 3 y 4 dígitos' })
  cvv: string;

  // Soporte para campos personalizados
  @IsArray({ message: 'Los campos personalizados deben ser un arreglo' })
  @ValidateNested({ each: true })
  @Type(() => CustomFieldHttpDto)
  @IsOptional()
  customFields?: CustomFieldHttpDto[];
}
