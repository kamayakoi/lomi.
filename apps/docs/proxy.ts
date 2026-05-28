/* @proprietary license */

import { NextResponse, type NextRequest } from "next/server";

/**
 * Docs locale (EN/FR) is resolved in server components via `getDocsLocale()` from the
 * `lomi.language` cookie — not via Fumadocs `createI18nMiddleware`, so public URLs stay
 * unchanged (no `/{lang}/...` segment or internal rewrite).
 *
 * Do not call Supabase auth.getSession() here: docs has no /auth or /workspace routes,
 * and reading shared *.lomi.africa cookies can trigger refresh_token rate limits.
 */
export default async function proxy(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp3)$).*)",
  ],
};
