import { Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from './supabase.provider';

@Injectable()
export abstract class BaseRepository<T> {
  constructor(
    @Inject(SUPABASE_CLIENT) protected readonly supabase: SupabaseClient,
    protected readonly tableName: string,
  ) {}

  async findMany(options?: {
    select?: string;
    filters?: Record<string, any>;
    orderBy?: { column: string; ascending?: boolean };
  }): Promise<T[]> {
    let query = this.supabase.from(this.tableName).select(options?.select || '*');

    if (options?.filters) {
      Object.entries(options.filters).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          query = query.eq(key, val);
        }
      });
    }

    if (options?.orderBy) {
      query = query.order(options.orderBy.column, {
        ascending: options.orderBy.ascending ?? true,
      });
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`[BaseRepository.findMany] Error in table ${this.tableName}: ${error.message}`);
    }

    return (data || []) as T[];
  }

  async findOne(id: string, select?: string): Promise<T | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select(select || '*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw new Error(`[BaseRepository.findOne] Error in table ${this.tableName}: ${error.message}`);
    }

    return data as T | null;
  }

  async create(data: Partial<T>): Promise<T> {
    const { data: created, error } = await this.supabase
      .from(this.tableName)
      .insert(data as any)
      .select()
      .single();

    if (error) {
      throw new Error(`[BaseRepository.create] Error in table ${this.tableName}: ${error.message}`);
    }

    return created as T;
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    const { data: updated, error } = await this.supabase
      .from(this.tableName)
      .update(data as any)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`[BaseRepository.update] Error in table ${this.tableName}: ${error.message}`);
    }

    return updated as T;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from(this.tableName)
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`[BaseRepository.delete] Error in table ${this.tableName}: ${error.message}`);
    }
  }
}
