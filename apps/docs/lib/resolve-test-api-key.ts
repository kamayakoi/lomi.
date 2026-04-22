/* @proprietary license */

import type { SupabaseClient } from '@supabase/supabase-js';

export type ResolveTestKeyOptions = {
  /** When set, must match an org the user can access and that has a test secret key. */
  activeOrganizationId: string | null;
};

/** Row shape returned by `public.fetch_docs_test_secret_key` (see dashboard migrations). */
type DocsTestSecretKeyRow = {
  api_key: string;
  organization_id: string;
};

/**
 * Returns the newest active test **secret** API key for the resolved organization, or null.
 * Uses the docs-only RPC `fetch_docs_test_secret_key` (server-side membership checks).
 * Dashboard list UI continues to use `fetch_api_keys`; see `lib/supabase/AUTH.md`.
 */
export async function resolveTestSecretApiKey(
  supabase: SupabaseClient,
  options: ResolveTestKeyOptions,
): Promise<string | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase.rpc('fetch_docs_test_secret_key', {
    p_organization_id: options.activeOrganizationId,
  });

  if (error || !data?.length) {
    return null;
  }

  const row = data[0] as DocsTestSecretKeyRow;
  return row.api_key ?? null;
}
