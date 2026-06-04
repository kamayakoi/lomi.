/* @proprietary license */

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from 'fumadocs-ui/components/tabs.unstyled';
import { CodeBlock } from '@/components/ui/code-block';

export function Installation({ name }: { name: string }) {
  const registryUrl = `https://docs.lomi.africa/r/${name}.json`;
  const tabs = [
    { name: 'npx', value: 'npx' },
    { name: 'pnpm', value: 'pnpm' },
    { name: 'yarn', value: 'yarn' },
    { name: 'bun', value: 'bun' },
  ];

  return (
    <Tabs className="my-6" defaultValue="npx">
      <TabsList className="flex flex-col gap-3 text-sm items-start p-3 bg-fd-card text-fd-card-foreground rounded-sm border not-prose sm:flex-row">
        <div className="me-auto">
          <p className="font-medium">Install to your codebase</p>
          <p className="mt-1 text-fd-muted-foreground">
            Copy the component source with shadcn.
          </p>
        </div>
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="font-medium text-fd-muted-foreground transition-colors data-[state=active]:text-fd-primary"
          >
            {tab.name}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="npx">
        <CodeBlock
          code={`npx shadcn@latest add ${registryUrl}`}
          lang="bash"
        />
      </TabsContent>

      <TabsContent value="pnpm">
        <CodeBlock
          code={`pnpm dlx shadcn@latest add ${registryUrl}`}
          lang="bash"
        />
      </TabsContent>

      <TabsContent value="yarn">
        <CodeBlock
          code={`yarn dlx shadcn@latest add ${registryUrl}`}
          lang="bash"
        />
      </TabsContent>

      <TabsContent value="bun">
        <CodeBlock
          code={`bunx shadcn@latest add ${registryUrl}`}
          lang="bash"
        />
      </TabsContent>
    </Tabs>
  );
}
