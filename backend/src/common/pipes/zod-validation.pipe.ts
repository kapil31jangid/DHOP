import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { Schema } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: Schema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    // Only validate request body payloads
    if (metadata.type !== 'body') {
      return value;
    }

    const result = this.schema.safeParse(value);

    if (!result.success) {
      const errorDetails = result.error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      throw new BadRequestException({
        message: 'Validation failed',
        details: errorDetails,
      });
    }

    return result.data;
  }
}
