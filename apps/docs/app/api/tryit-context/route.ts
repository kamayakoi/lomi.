/* @proprietary license */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import {
  COOKIE_TRYIT_ORG,
  COOKIE_TRYIT_USE_TEST_KEY,
} from '@/lib/tryit/constants';

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const c = await cookies();
  const useTestKey = c.get(COOKIE_TRYIT_USE_TEST_KEY)?.value === 'true';
  const cookieOrg = c.get(COOKIE_TRYIT_ORG)?.value ?? null;

  if (!user) {
    return NextResponse.json({
      signedIn: false,
      useTestKey,
      organizations: [] as { id: string; name: string }[],
      selectedOrganizationId: null as string | null,
      needsOrganizationChoice: false,
    });
  }

  const { data: keyRows } = await supabase
    .from('api_keys')
    .select('organization_id')
    .eq('environment', 'test')
    .eq('key_type', 'secret')
    .eq('is_active', true)
    .is('deleted_at', null);

  const orgIds = [
    ...new Set((keyRows ?? []).map((r) => r.organization_id)),
  ];

  if (orgIds.length === 0) {
    return NextResponse.json({
      signedIn: true,
      useTestKey,
      organizations: [],
      selectedOrganizationId: null,
      needsOrganizationChoice: false,
    });
  }

  const { data: orgs } = await supabase
    .from('organizations')
    .select('organization_id, name')
    .in('organization_id', orgIds);

  const organizations =
    orgs?.map((o) => ({
      id: o.organization_id,
      name: o.name,
    })) ?? [];

  const validCookieOrg =
    cookieOrg && orgIds.includes(cookieOrg) ? cookieOrg : null;
  const selectedOrganizationId =
    validCookieOrg ?? (orgIds.length === 1 ? orgIds[0]! : null);
  const needsOrganizationChoice =
    orgIds.length > 1 && !validCookieOrg && orgIds.length > 0;

  return NextResponse.json({
    signedIn: true,
    useTestKey,
    organizations,
    selectedOrganizationId,
    needsOrganizationChoice,
  });
}
