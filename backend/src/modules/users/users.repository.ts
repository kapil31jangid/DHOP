import { Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { BaseRepository } from '../../database/base.repository';
import { SUPABASE_CLIENT } from '../../database/supabase.provider';

@Injectable()
export class UsersRepository extends BaseRepository<any> {
  constructor(
    @Inject(SUPABASE_CLIENT) protected readonly supabaseClient: SupabaseClient,
  ) {
    super(supabaseClient, 'users');
  }

  async findByFirebaseUid(firebaseUid: string): Promise<any | null> {
    const { data, error } = await this.supabaseClient
      .from('users')
      .select('*')
      .eq('firebase_uid', firebaseUid)
      .maybeSingle();

    if (error) {
      throw new Error(`[UsersRepository.findByFirebaseUid] Failed to fetch: ${error.message}`);
    }

    return data;
  }
}
