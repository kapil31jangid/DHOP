import { Global, Module } from '@nestjs/common';
import { SupabaseProvider } from './supabase.provider';
import { FirebaseAdminProvider } from './firebase.provider';

@Global()
@Module({
  providers: [SupabaseProvider, FirebaseAdminProvider],
  exports: [SupabaseProvider, FirebaseAdminProvider],
})
export class DatabaseModule {}
