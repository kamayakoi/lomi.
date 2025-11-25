/* @proprietary license */

import { source } from '@/lib/utils/source';
import { getBreadcrumbItems } from 'fumadocs-core/breadcrumb';

export const revalidate = false;

// Orama Cloud-compatible document format
// Orama Cloud requires flat arrays of primitives, not nested objects
interface OramaCloudDocument {
  id: string;
  page_id: string;
  title: string;
  description?: string;
  url: string;
  tag?: string;
  structured: {
    headings: string[];
    contents: string[];
  };
  breadcrumbs: string[];
}

export async function GET(): Promise<Response> {
  const results: OramaCloudDocument[] = [];
  const pages = source.getPages();
  for (const page of pages) {
    if (page.data._openapi) continue;

    const items = getBreadcrumbItems(page.url, source.pageTree, {
      includePage: false,
      includeRoot: true,
    });

    const structuredData = page.data.structuredData;
    const structured = structuredData
      ? {
          // Extract heading IDs (or content) as flat string array
          // Ensure headings is an array and map to strings
          headings: Array.isArray(structuredData.headings)
            ? structuredData.headings
                .map((h) => (typeof h === 'object' && h?.id ? h.id : String(h)))
                .filter((h) => h.length > 0)
            : [],
          // Extract content strings as flat array, filtering empty
          // Ensure contents is an array and map to strings
          contents: Array.isArray(structuredData.contents)
            ? structuredData.contents
                .map((c) =>
                  typeof c === 'object' && c?.content
                    ? c.content.trim()
                    : String(c).trim(),
                )
                .filter((c) => c.length > 0)
            : [],
        }
      : { headings: [], contents: [] };

    results.push({
      id: page.url,
      page_id: page.url,
      title: page.data.title ?? 'Untitled',
      description: page.data.description,
      url: page.url,
      tag: page.slugs[0],
      structured,
      breadcrumbs: items.flatMap<string>((item, i) =>
        i > 0 && typeof item.name === 'string' ? item.name : [],
      ),
    });
  }

  return Response.json(results);
}
