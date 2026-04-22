/* @proprietary license */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { type ComponentProps, type FC, type ReactNode, type JSX } from 'react';
import * as Twoslash from 'fumadocs-twoslash/ui';
import { Callout } from 'fumadocs-ui/components/callout';
import { TypeTable } from 'fumadocs-ui/components/type-table';
import * as Preview from '@/components/preview';
import { createMetadata, getDocsSiteOrigin } from '@/lib/utils/metadata';
import { source } from '@/lib/utils/source';
import { Wrapper } from '@/components/preview/wrapper';
import { Mermaid } from '@/components/preview/mermaid';
import { getMDXComponents } from '@/mdx-components';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import Link from 'fumadocs-core/link';
import { AutoTypeTable } from 'fumadocs-typescript/ui';
import { createGenerator } from 'fumadocs-typescript';
import { getPageTreePeers } from 'fumadocs-core/page-tree';
import { Card, Cards } from 'fumadocs-ui/components/card';
import { LLMCopyButton, ViewOptions } from '@/components/preview/page-actions';
import * as path from 'node:path';
import { Banner } from 'fumadocs-ui/components/banner';
import { Installation } from '@/components/preview/installation';
import { Customisation } from '@/components/preview/customisation';
import { DocsPage } from 'fumadocs-ui/page';

const DEFAULT_DOC_SLUG = ['core', 'introduction', 'what-is-lomi'] as const;

function effectiveSlug(slug: string[] | undefined): string[] {
  if (slug && slug.length > 0) return slug;
  return [...DEFAULT_DOC_SLUG];
}

function PreviewRenderer({ preview }: { preview: string }): ReactNode {
  if (preview && preview in Preview) {
    const Comp = Preview[preview as keyof typeof Preview];
    return <Comp />;
  }

  return null;
}

const generator = createGenerator();

export const revalidate = false;

export default async function Page({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const resolvedParams = await params;
  const slug = effectiveSlug(resolvedParams.slug);
  const page = source.getPage(slug);

  if (!page) notFound();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pageData = page.data as any;

  const preview = pageData.preview as string | undefined;
  const Mdx = pageData.body;
  const toc = pageData.toc;
  const lastModified = pageData.lastModified;

  return (
    <DocsPage
      toc={toc}
      lastUpdate={lastModified ? new Date(lastModified) : undefined}
      tableOfContent={{
        style: 'clerk',
      }}
    >
      <h1 className="text-[1.75em] font-semibold">{page.data.title}</h1>
      <p className="text-lg text-fd-muted-foreground">
        {page.data.description}
      </p>
      <div className="flex flex-row gap-2 items-center border-b -translate-y-4 pt-3 pb-6 justify-end">
        <LLMCopyButton markdownUrl={`${page.url}.mdx`} />
        <ViewOptions
          markdownUrl={`${page.url}.mdx`}
          githubUrl={`https://github.com/lomiafrica/lomi./tree/main/apps/docs/content/docs/${page.path}`}
        />
      </div>
      <div className="prose flex-1 text-fd-foreground/80">
        {preview ? <PreviewRenderer preview={preview} /> : null}
        <Mdx
          components={getMDXComponents({
            ...Twoslash,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            a: ({ href, ...props }: any): JSX.Element => {
              const found = source.getPageByHref(href ?? '', {
                dir: path.dirname(page.path),
              });

              if (!found) return <Link href={href} {...props} />;

              return (
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Link
                      href={
                        found.hash
                          ? `${found.page.url}#${found.hash}`
                          : found.page.url
                      }
                      {...props}
                    />
                  </HoverCardTrigger>
                  <HoverCardContent className="text-sm">
                    <p className="font-medium">{found.page.data.title}</p>
                    <p className="text-fd-muted-foreground">
                      {found.page.data.description}
                    </p>
                  </HoverCardContent>
                </HoverCard>
              );
            },
            Banner,
            Mermaid,
            TypeTable,
            AutoTypeTable: (props) => (
              <AutoTypeTable generator={generator} {...props} />
            ),
            Wrapper,
            blockquote: Callout as unknown as FC<ComponentProps<'blockquote'>>,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            DocsCategory: ({ url }: any): JSX.Element => {
              return <DocsCategory url={url ?? page.url} />;
            },
            Installation,
            Customisation,
          })}
        />
        {pageData.index ? <DocsCategory url={page.url} /> : null}
      </div>
    </DocsPage>
  );
}

function DocsCategory({ url }: { url: string }) {
  const peers = getPageTreePeers(source.pageTree, url);
  const peersArray = Array.isArray(peers) ? peers : [];

  return (
    <Cards>
      {peersArray.map((peer) => (
        <Card key={peer.url} title={peer.name} href={peer.url}>
          {peer.description}
        </Card>
      ))}
    </Cards>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = effectiveSlug(resolvedParams.slug);
  const page = source.getPage(slug);
  if (!page) notFound();

  const description =
    page.data.description ?? 'The library for building documentation sites';

  const origin = getDocsSiteOrigin();
  const ogPath = [...page.slugs, 'image.png'].join('/');
  const image = {
    url: `${origin}/og/${ogPath}`,
    width: 1200,
    height: 630,
  };

  const canonicalPath = page.url.startsWith('/') ? page.url : `/${page.url}`;
  const canonical = `${origin}${canonicalPath}`;

  return createMetadata({
    title: page.data.title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      url: canonicalPath,
      images: [image],
    },
    twitter: {
      images: [image],
    },
  });
}

export function generateStaticParams() {
  const params = source.generateParams();
  const list = (Array.isArray(params) ? params : []) as { slug?: string[] }[];
  const withoutEmpty = list.filter((p) => (p.slug?.length ?? 0) > 0);
  return [{ slug: [] }, ...withoutEmpty];
}
