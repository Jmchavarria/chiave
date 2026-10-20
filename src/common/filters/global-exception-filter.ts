import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';
import { CustomError } from '../errors/custom.error';
import { ErrorCode } from '../errors/error-code-enum';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Loguea siempre el error original
    this.logger.error(
      `[${request.method}] ${request.url}`,
      exception instanceof Error ? exception.stack : String(exception),
    );

    if (exception instanceof CustomError) {
      response.status(exception.statusCode).json({
        success: false,
        error: {
          code: exception.code,
          message: exception.message,
          details: exception.details ?? undefined,
        },
        path: request.url,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    if (exception instanceof QueryFailedError) {
      response.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        error: {
          code: ErrorCode.database_error,
          message: 'Database operation failed',
        },
        path: request.url,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      const normalizedResponse =
        typeof exceptionResponse === 'string'
          ? { message: exceptionResponse }
          : (exceptionResponse as Record<string, unknown>);

      response.status(status).json({
        success: false,
        error: {
          code: normalizedResponse.code ?? ErrorCode.internal_server_error,
          message:
            typeof normalizedResponse.message === 'string'
              ? normalizedResponse.message
              : exception.message,
        },
        path: request.url,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const error = exception instanceof Error ? exception : new Error(String(exception));
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: {
        code: ErrorCode.internal_server_error,
        message: error.message || 'Internal server error',
      },
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
