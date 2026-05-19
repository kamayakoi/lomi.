import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/api';

type DatabaseFunctions = Database['public']['Functions'];

@Injectable()
export class SupabaseService implements OnModuleInit {
  private client: SupabaseClient<Database>;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const supabaseUrl =
      this.configService.get<string>('SUPABASE_URL') ||
      process.env.SUPABASE_URL;

    // Use SERVICE_ROLE_KEY for API (bypasses RLS)
    // This is secure because:
    // 1. API Key Guard validates all requests
    // 2. Service layer filters by organization_id
    // 3. Service key never exposed to clients
    const supabaseKey =
      this.configService.get<string>('SUPABASE_SECRET_KEY') ||
      process.env.SUPABASE_SECRET_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error(
        'Supabase URL or Service Role Key is missing! Check your .env file.',
      );
    }

    this.client = createClient<Database>(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
      },
    });
  }

  getClient(): SupabaseClient<Database> {
    return this.client;
  }

  /**
   * Typed RPC helper method that properly infers function arguments and return types
   */
  async rpc<FnName extends keyof DatabaseFunctions>(
    fnName: FnName,
    args: DatabaseFunctions[FnName]['Args'],
  ): Promise<{
    data: DatabaseFunctions[FnName]['Returns'] | null;
    error: Error | null;
  }> {
    const { data, error } = await this.client.rpc(
      fnName as string,
      args as never,
    );
    return {
      data: data as DatabaseFunctions[FnName]['Returns'] | null,
      error,
    };
  }

  /**
   * Typed table helper that returns a properly typed query builder
   */
  from<TableName extends keyof Database['public']['Tables']>(
    table: TableName,
  ): ReturnType<SupabaseClient<Database>['from']> {
    return this.client.from(table) as ReturnType<
      SupabaseClient<Database>['from']
    >;
  }
}
