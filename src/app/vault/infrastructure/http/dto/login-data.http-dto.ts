import { IsString, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

export class LoginDataHttpDto {
  @IsString({ message: 'El nombre de usuario debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre de usuario no puede estar vacío' })
  username: string;

  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La contraseña no puede estar vacía' })
  password: string;

  @IsString({ message: 'La clave del autenticador debe ser una cadena de texto' })
  @IsOptional()
  authenticatorKey?: string;

  @IsString({ message: 'El sitio web debe ser una cadena de texto' })
  @IsOptional()
  @IsUrl({}, { message: 'El sitio web debe ser una URL válida (ej: https://example.com)' })
  website?: string;
}
