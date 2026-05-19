/* @proprietary license */

import { createClient } from '@/lib/supabase/request';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Docs locale (EN/FR) is resolved in server components via `getDocsLocale()` from the
 * `lomi.language` cookie — not via Fumadocs `createI18nMiddleware`, so public URLs stay
 * unchanged (no `/{lang}/...` segment or internal rewrite).
 */
export default async function proxy(request: NextRequest) {
  const { supabase, response } = createClient(request);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = request.nextUrl;

  // Redirect authenticated users from landing/auth pages to workspace
  if (session && pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/workspace', request.url));
  }

  // Protect workspace routes - require authentication
  if (!session && pathname.startsWith('/workspace')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp3)$).*)',
  ],
};
