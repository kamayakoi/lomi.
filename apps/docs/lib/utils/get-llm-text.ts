/* @proprietary license */

import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkMdx from 'remark-mdx';
import { remarkAutoTypeTable } from 'fumadocs-typescript';
import { remarkInclude } from 'fumadocs-mdx/config';
import { type Page } from '@/lib/utils/source';
import { remarkNpm } from 'fumadocs-core/mdx-plugins';
import fs from 'node:fs/promises';

const processor = remark()
  .use(remarkMdx)
  .use(remarkInclude)
  .use(remarkGfm)
  .use(remarkAutoTypeTable)
  .use(remarkNpm);

export async function getLLMText(page: Page) {
  if (!page.absolutePath) {
    throw new Error(`Page ${page.url} has no absolutePath`);
  }

  const processed = await processor.process({
    path: page.absolutePath,
    value: await fs.readFile(page.absolutePath),
  });

  const origin = getDocsSiteOrigin();

  return `# ${page.data.title}
Source: ${origin}${page.url}

${page.data.description ?? ''}

${processed.value}`;
}
