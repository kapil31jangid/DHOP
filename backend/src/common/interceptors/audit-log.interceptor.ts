import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../database/supabase.provider';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuditLogInterceptor.name);

  constructor(
    @Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, user } = request;

    // Only audit modifying operations
    const isMutation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);

    return next.handle().pipe(
      tap(async () => {
        if (!isMutation || !user) {
          return;
        }

        try {
          // Parse action
          let action: 'CREATE' | 'UPDATE' | 'DELETE' = 'UPDATE';
          if (method === 'POST') action = 'CREATE';
          if (method === 'DELETE') action = 'DELETE';

          // Extract module name from request URL (e.g., /api/v1/medicines/123 -> medicines)
          const urlParts = url.split('/');
          const apiIndex = urlParts.indexOf('v1');
          const moduleName =
            apiIndex !== -1 && urlParts[apiIndex + 1]
              ? urlParts[apiIndex + 1]
              : 'system';

          const description = `${user.name || user.email} (${user.role}) performed ${action} in ${moduleName} module via ${method} ${url}`;

          // Insert log into PostgreSQL audit_logs table via Supabase client
          const { error } = await this.supabase.from('audit_logs').insert({
            facility_id: user.facilityId || null,
            user_id: user.id || null,
            module: moduleName,
            action,
            description,
          });

          if (error) {
            this.logger.error(`[AuditLogInterceptor] Failed to write audit log: ${error.message}`);
          }
        } catch (err) {
          this.logger.error(`[AuditLogInterceptor] Error during audit logging: ${err.message}`);
        }
      }),
    );
  }
}
