import { Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { BaseRepository } from '../../database/base.repository';
import { SUPABASE_CLIENT } from '../../database/supabase.provider';

@Injectable()
export class NotificationsRepository extends BaseRepository<any> {
  constructor(
    @Inject(SUPABASE_CLIENT) protected readonly supabaseClient: SupabaseClient,
  ) {
    super(supabaseClient, 'notifications');
  }
}
