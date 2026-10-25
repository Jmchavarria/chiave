import type { ValidationOptions, ValidationArguments } from 'class-validator';
import { registerDecorator, validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { VaultItemEnumType } from '../../../types/vault-item-type.enum';
import { KeySshDataHttpDto } from './key-ssh-data.http-dto';
import { IdentityDataHttpDto } from './identity-data.http-dto';
import { CardDataHttpDto } from './card-data.http-dto';
import { LoginDataHttpDto } from './login-data.http-dto';

interface VaultContainerWithRef {
  type: VaultItemEnumType;
  [key: string]: unknown;
}

export function IsValidVaultData(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string): void {
    registerDecorator({
      name: 'isValidVaultData',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown, args: ValidationArguments): boolean {
          const dto = args.object as VaultContainerWithRef;
          const type = dto.type;

          if (!value || typeof value !== 'object') {
            return false;
          }

          let targetDtoClass: new () => object;

          // Enrutamos según el tipo de ítem de la bóveda
          switch (type) {
            case VaultItemEnumType.LOGIN:
              targetDtoClass = LoginDataHttpDto;
              break;
            case VaultItemEnumType.CARD:
              targetDtoClass = CardDataHttpDto;
              break;
            case VaultItemEnumType.IDENTITY:
              targetDtoClass = IdentityDataHttpDto;
              break;
            case VaultItemEnumType.SSH_KEY:
              targetDtoClass = KeySshDataHttpDto;
              break;
            default:
              return false;
          }

          // Transformamos el objeto plano y aplicamos validación estricta
          const instance = plainToInstance(targetDtoClass, value as Record<string, unknown>);
          const errors = validateSync(instance, {
            whitelist: true,
            forbidNonWhitelisted: true,
          });

          return errors.length === 0;
        },
        defaultMessage(): string {
          return 'Los campos internos de data no son válidos para el tipo de ítem seleccionado o contienen propiedades no permitidas.';
        },
      },
    });
  };
}
