import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const SUPABASE_CLIENT = 'SUPABASE_CLIENT';

export const SupabaseProvider: Provider = {
  provide: SUPABASE_CLIENT,
  useFactory: (configService: ConfigService): SupabaseClient => {
    const url = configService.get<string>('supabase.url');
    const serviceRoleKey = configService.get<string>('supabase.serviceRoleKey');
    if (!url || !serviceRoleKey) {
      throw new Error('Supabase URL or Service Role Key is missing in configurations');
    }
    return createClient(url, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  },
  inject: [ConfigService],
};
export type SupabaseClientType = SupabaseClient;
