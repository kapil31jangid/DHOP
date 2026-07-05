import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ResponseEnvelope<T> {
  success: boolean;
  data: T;
  meta?: any;
}

@Injectable()
export class ResponseTransformInterceptor<T>
  implements NestInterceptor<T, ResponseEnvelope<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseEnvelope<T>> {
    return next.handle().pipe(
      map((value) => {
        // If the return object is already styled with success and data
        if (value && typeof value === 'object' && 'success' in value && 'data' in value) {
          return value;
        }

        // Handle standard pagination structures returned by services
        if (value && typeof value === 'object' && 'data' in value && 'meta' in value) {
          return {
            success: true,
            data: value.data,
            meta: value.meta,
          };
        }

        return {
          success: true,
          data: value === undefined ? null : value,
        };
      }),
    );
  }
}
