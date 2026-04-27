/* @proprietary license */

import { source } from '@/lib/utils/source';
import { getLLMText } from '@/lib/utils/get-llm-text';

export const revalidate = false;

export async function GET() {
  const scan = source
    .getPages('en')
    .filter((file) => file.slugs[0] !== 'openapi')
    .map(getLLMText);
  const scanned = await Promise.all(scan);

  return new Response(scanned.join('\n\n'));
}
