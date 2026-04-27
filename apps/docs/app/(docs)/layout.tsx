/* @proprietary license */

import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions, linkItems, logo } from '@/lib/utils/layout.shared';
import { source } from '@/lib/utils/source';
import { getDocsLocale } from '@/lib/utils/docs-locale';
// import { LargeSearchToggle } from 'fumadocs-ui/components/layout/search-toggle';
import type { ReactNode } from 'react';
import type { LayoutTab } from 'fumadocs-ui/layouts/shared';
import type { Folder } from 'fumadocs-core/page-tree';
// import { Sparkles } from 'lucide-react';
// import { AISearchTrigger } from '@/components/ai';
// import { cn } from '@/lib/cn';
// import { buttonVariants } from '@/components/ui/button';
import 'katex/dist/katex.min.css';
import { TryItOpenApiPanel } from '@/components/docs/try-it-openapi-panel';

function getFirstPageUrl(node: Folder): string | undefined {
  if (node.index?.url) return node.index.url;

  for (const child of node.children) {
    if (child.type === 'page') return child.url;
    if (child.type === 'folder') {
      const nested = getFirstPageUrl(child);
      if (nested) return nested;
    }
  }

  return undefined;
}

export default async function Layout({ children }: { children: ReactNode }) {
  const locale = await getDocsLocale();
  const pageTree = source.getPageTree(locale);
  const base = baseOptions();
  const tabs: LayoutTab[] = pageTree.children.flatMap((node) => {
    if (node.type !== 'folder') return [];

    const url = getFirstPageUrl(node);
    if (!url) return [];

    const meta = source.getNodeMeta(node, locale);
    const color = meta
      ? `var(--${meta.path.split('/')[0]}-color, var(--color-fd-foreground))`
      : 'var(--color-fd-foreground)';

    return [
      {
        title: node.name,
        description: node.description,
        url,
        $folder: node,
        icon: node.icon ? (
          <div
            className="[&_svg]:size-full rounded-sm size-full text-(--tab-color) max-md:bg-(--tab-color)/10 max-md:border max-md:p-1.5"
            style={
              {
                '--tab-color': color,
              } as object
            }
          >
            {node.icon}
          </div>
        ) : undefined,
      },
    ];
  });

  return (
    <DocsLayout
      {...base}
      tree={pageTree}
      tabs={tabs}
      // just icon items
      links={linkItems?.filter((item) => item.type === 'icon') ?? []}
      searchToggle={
        {
          /*
        components: {
          lg: (
            <div className="flex gap-1.5 max-md:hidden">
              <LargeSearchToggle className="flex-1" />
            </div>
          ),
        },
        */
        }
      }
      nav={{
        ...base.nav,
        title: <>{logo}</>,
        // children: (
        //   <AISearchTrigger
        //     className={cn(
        //       buttonVariants({
        //         variant: 'secondary',
        //         size: 'sm',
        //         className:
        //           'absolute left-1/2 top-1/2 -translate-1/2 text-fd-muted-foreground rounded-sm gap-2 md:hidden',
        //       }),
        //     )}
        //   >
        //     <Sparkles className="size-4.5 fill-current" />
        //     Ask AI
        //   </AISearchTrigger>
        // ),
      }}
      sidebar={{}}
    >
      <TryItOpenApiPanel />
      {children}
    </DocsLayout>
  );
}
