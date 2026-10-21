import { HttpStatus } from '@nestjs/common';
import type { ErrorCode } from './error-code-enum';
interface CustomErrorParams {
  code: ErrorCode;
  message: string;
  statusCode?: HttpStatus;
  details?: unknown;
}
export class CustomError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: HttpStatus;
  public readonly details?: unknown;

  constructor({ code, message, statusCode, details }: CustomErrorParams) {
    super(message);
    this.name = 'CustomError';
    this.code = code;
    this.statusCode = statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
