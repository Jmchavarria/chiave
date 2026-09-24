import { PipeTransform, ArgumentMetadata, Injectable } from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CustomError } from '../errors/custom.error';
import { ErrorCode } from '../errors/error-code-enum';

@Injectable()
export class CustomValidationPipe<T = unknown> implements PipeTransform<
  unknown,
  Promise<T | unknown>
> {
  async transform(
    value: unknown,
    { metatype }: ArgumentMetadata,
  ): Promise<T | unknown> {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToInstance(metatype, value) as unknown as object;

    const errors = await validate(object, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      const details = this.formatErrors(errors);

      throw new CustomError({
        code: ErrorCode.validation_error,
        message: 'Validation failed',
        statusCode: 400,
        details,
      });
    }
    return object;
  }

  private formatErrors(
    errors: ValidationError[],
  ): Array<{ field: string; errors: string[] }> {
    const formatted: Array<{ field: string; errors: string[] }> = [];

    const extract = (errorList: ValidationError[], parentPath = '') => {
      for (const err of errorList) {
        const fieldPath = parentPath
          ? `${parentPath}.${err.property}`
          : err.property;

        if (err.constraints) {
          formatted.push({
            field: fieldPath,
            errors: Object.values(err.constraints),
          });
        }

        if (err.children && err.children.length > 0) {
          extract(err.children, fieldPath);
        }
      }
    };

    extract(errors);
    return formatted;
  }

  private toValidate(metatype: new (...args: unknown[]) => unknown): boolean {
    const types: Array<new (...args: unknown[]) => unknown> = [
      String,
      Boolean,
      Number,
      Array,
      Object,
    ];
    return !types.includes(metatype);
  }
}
