import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { Pagination } from '../pagintation';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T[] | T;
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<unknown, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((response: Pagination<T> | T): ApiResponse<T> => {
        const message = 'Request successful';

        if (response && typeof response === 'object' && 'page' in response) {
          return {
            success: true,
            message,
            data: response.data,
            page: response.page,
            limit: response.limit,
            total: response.total,
            totalPages: response.totalPages,
          };
        }

        return {
          success: true,
          message,
          data: response,
        };
      }),
    );
  }
}
