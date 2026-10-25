import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { CustomFieldTypeEnumType } from '../../../types/custom-fields-type.enum';

export class CustomFieldHttpDto {
  @IsString({ message: 'El nombre del campo personalizado debe ser texto' })
  @IsNotEmpty({ message: 'El nombre del campo personalizado no puede estar vacío' })
  name: string;

  @IsEnum(CustomFieldTypeEnumType, {
    message: 'El tipo de campo personalizado debe ser text, checkbox o hidden',
  })
  type: CustomFieldTypeEnumType;

  @IsOptional()
  value?: string | boolean | number;
}
