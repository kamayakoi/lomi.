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

  const { data: orgRows, error } = await supabase.rpc(
    'get_tryit_context_for_user',
    { p_user_id: user.id },
  );

  if (error) {
    console.error('Failed to fetch try-it context:', error);
  }

  const organizations: { id: string; name: string }[] =
    orgRows?.map((o: { organization_id: string; name: string }) => ({
      id: o.organization_id,
      name: o.name,
    })) ?? [];

  if (organizations.length === 0) {
    return NextResponse.json({
      signedIn: true,
      useTestKey,
      organizations: [],
      selectedOrganizationId: null,
      needsOrganizationChoice: false,
    });
  }

  const selectedOrganizationId =
    cookieOrg && organizations.some((o) => o.id === cookieOrg)
      ? cookieOrg
      : organizations.length === 1
        ? organizations[0]!.id
        : null;

  return NextResponse.json({
    signedIn: true,
    useTestKey,
    organizations,
    selectedOrganizationId,
    needsOrganizationChoice:
      organizations.length > 1 && selectedOrganizationId === null,
  });
}
