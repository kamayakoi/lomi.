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
  const { data: link } = await supabase
    .from('merchant_organization_links')
    .select('organization_id')
    .eq('merchant_id', userId)
    .eq('organization_id', organizationId)
    .maybeSingle();

  if (!link) {
    return false;
  }

  const { data: key } = await supabase
    .from('api_keys')
    .select('api_key')
    .eq('organization_id', organizationId)
    .eq('environment', 'test')
    .eq('key_type', 'secret')
    .eq('is_active', true)
    .is('deleted_at', null)
    .limit(1)
    .maybeSingle();

  return !!key;
}
