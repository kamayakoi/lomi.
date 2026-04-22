/* @proprietary license */

import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions, linkItems, logo } from '@/lib/utils/layout.shared';
import { source } from '@/lib/utils/source';
// import { LargeSearchToggle } from 'fumadocs-ui/components/layout/search-toggle';
import type { ReactNode } from 'react';
// import { Sparkles } from 'lucide-react';
// import { AISearchTrigger } from '@/components/ai';
// import { cn } from '@/lib/cn';
// import { buttonVariants } from '@/components/ui/button';
import 'katex/dist/katex.min.css';
import { TryItOpenApiPanel } from '@/components/docs/try-it-openapi-panel';

export default function Layout({ children }: { children: ReactNode }) {
  const base = baseOptions();

  return (
    <DocsLayout
      {...base}
      tree={source.pageTree}
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
      sidebar={{
        tabs: {
          transform(option, node) {
            const meta = source.getNodeMeta(node);
            if (!meta || !node.icon) return option;

            const color = `var(--${meta.path.split('/')[0]}-color, var(--color-fd-foreground))`;

            return {
              ...option,
              icon: (
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
              ),
            };
          },
        },
      }}
    >
      <TryItOpenApiPanel />
      {children}
    </DocsLayout>
  );
}
