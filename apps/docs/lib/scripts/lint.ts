/* @proprietary license */

import { glob } from 'tinyglobby';
import { printErrors, scanURLs, validateFiles } from 'next-validate-link';
import { createGetUrl, getSlugs } from 'fumadocs-core/source';
import { TOCItemType } from 'fumadocs-core/toc';
import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { remarkInclude } from 'fumadocs-mdx/config';
import remarkMdx from 'remark-mdx';
import { visit } from 'unist-util-visit';
import { remark } from 'remark';
import { remarkHeading } from 'fumadocs-core/mdx-plugins';

async function readFromPath(file: string) {
  const content = await fs
    .readFile(path.resolve(file))
    .then((res) => res.toString());
  const parsed = matter(content);

  return {
    path: file,
    data: parsed.data,
    content: parsed.content,
  };
}

function remarkIncludeId() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (tree: any, file: { data: Record<string, unknown> }) => {
    (file.data.ids as string[]) ??= [];
    visit(tree, 'mdxJsxFlowElement', (element) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const elem = element as any;
      if (!elem.name || !elem.attributes) return;

      const attributes = elem.attributes;
      const idAttr = attributes.find(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (attr: any) => attr.type === 'mdxJsxAttribute' && attr.name === 'id',
      );

      if (idAttr) {
        (file.data.ids as string[]).push(String(idAttr.value));
      }
    });
  };
}

const processor = remark()
  .use(remarkMdx)
  .use(remarkInclude)
  .use(remarkIncludeId)
  .use(remarkHeading);

async function getHeadings(path: string, content: string) {
  const ids: string[] = [];
  const result = await processor.process({
    path,
    value: content,
  });

  if ('toc' in result.data)
    ids.push(
      ...(result.data.toc as TOCItemType[]).map((item) => item.url.slice(1)),
    );

  if ('ids' in result.data) ids.push(...(result.data.ids as string[]));

  return ids;
}

async function checkLinks() {
  const docsFiles = await Promise.all(
    await glob('content/docs/**/*.mdx').then((files) =>
      files.map(readFromPath),
    ),
  );

  const docs = docsFiles.map(async (file) => {
    const relativePath = path.relative('content/docs', file.path);

    return {
      value: getSlugs(relativePath),
      hashes: await getHeadings(file.path, file.content),
    };
  });

  const scanned = await scanURLs({
    populate: {
      '(docs)/[[...slug]]': await Promise.all(docs),
    },
  });

  console.log(
    `collected ${scanned.urls.size} URLs, ${scanned.fallbackUrls.length} fallbacks`,
  );

  const getUrl = createGetUrl('/');
  printErrors(
    await validateFiles(docsFiles, {
      scanned,

      pathToUrl(value) {
        const relativePath = path.relative('content/docs', value);
        return getUrl(getSlugs(relativePath));
      },
      whitelist: (url) => url.startsWith('/openapi/generated'),
    }),
    true,
  );
}

void checkLinks();
