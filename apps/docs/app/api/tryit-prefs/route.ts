/* @proprietary license */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { userCanUseTestKeyForOrg } from '@/lib/tryit/verify-org-access';
import { tryitPreferenceCookieOptions } from '@/lib/tryit/cookie-options';
import {
  COOKIE_TRYIT_ORG,
  COOKIE_TRYIT_USE_TEST_KEY,
} from '@/lib/tryit/constants';

const bodySchema = z.object({
  useTestKey: z.boolean(),
  organizationId: z.string().uuid().nullable().optional(),
});

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const { useTestKey, organizationId: rawOrg } = parsed.data;
  const organizationId = rawOrg ?? null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (organizationId) {
    const ok = await userCanUseTestKeyForOrg(supabase, user.id, organizationId);
    if (!ok) {
      return NextResponse.json(
        { error: 'Organization not allowed or no test secret key' },
        { status: 403 },
      );
    }
  }

  const opts = tryitPreferenceCookieOptions();
  const res = NextResponse.json({ ok: true });

  res.cookies.set(
    COOKIE_TRYIT_USE_TEST_KEY,
    useTestKey ? 'true' : 'false',
    opts,
  );

  if (organizationId) {
    res.cookies.set(COOKIE_TRYIT_ORG, organizationId, opts);
  } else {
    res.cookies.set(COOKIE_TRYIT_ORG, '', { ...opts, maxAge: 0 });
  }

  return res;
}
