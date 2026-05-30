/* @proprietary license */

import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Returns true if the user is linked to the org and the org has at least one active test secret key.
 */
export async function userCanUseTestKeyForOrg(
  supabase: SupabaseClient,
  userId: string,
  organizationId: string,
): Promise<boolean> {
  const { data: hasAccess, error: accessError } = await supabase.rpc(
    'check_user_organization_access',
    {
      p_user_id: userId,
      p_organization_id: organizationId,
    },
  );

  if (accessError || !hasAccess) {
    return false;
  }

  const { data: hasTestKey, error: keyError } = await supabase.rpc(
    'organization_has_active_test_secret_key',
    { p_organization_id: organizationId },
  );

  if (keyError) {
    return false;
  }

  return !!hasTestKey;
}
