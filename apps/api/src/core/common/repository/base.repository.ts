import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../../utils/supabase/supabase.service';

/**
 * BaseRepository
 *
 * Enforces the Repository pattern across the application to abstract away
 * Supabase client calls. All new repositories should extend this class.
 */
@Injectable()
export abstract class BaseRepository {
  constructor(protected readonly supabase: SupabaseService) {}

  /**
   * Helper method to execute a Supabase RPC call and handle errors consistently.
   * By forcing all RPC calls through this method, we can easily add telemetry,
   * logging, or standardized error mapping in the future.
   */
  protected async executeRpc<R>(
    rpcName: string,
    args: Record<string, any>,
  ): Promise<R> {
    const { data, error } = await this.supabase
      .getClient()
      .rpc(rpcName as any, args as any);

    if (error) {
      // TODO: Map to a custom DatabaseException
      throw new Error(`RPC [${rpcName}] failed: ${error.message}`);
    }

    return data as R;
  }
}
