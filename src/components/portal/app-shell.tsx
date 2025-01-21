import { Suspense, memo, useMemo } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './sidebar';
import { useMetaTags } from '@/lib/contexts/useMetaTags';
import { useSidebarData } from '@/lib/hooks/useSidebarData';
import { SidebarProvider } from '@/lib/contexts/sidebarContext';
import { UserAvatarProvider } from '@/lib/contexts/userAvatarContext';
import { NotificationsProvider } from '@/lib/contexts/notificationsContext';
import { ActivationProvider } from '@/lib/contexts/ActivationContext';
import { OrganizationProvider } from '@/lib/contexts/OrganizationContext';
import AnimatedLogoLoader from './loader';

const MemoizedSidebar = memo(Sidebar);

// Memoize the providers to prevent unnecessary re-renders
const ProviderComposer = memo(({ children }: { children: React.ReactNode }) => (
  <OrganizationProvider>
    <SidebarProvider>
      <ActivationProvider>
        <UserAvatarProvider>
          <NotificationsProvider>
            {children}
          </NotificationsProvider>
        </UserAvatarProvider>
      </ActivationProvider>
    </SidebarProvider>
  </OrganizationProvider>
));
ProviderComposer.displayName = 'ProviderComposer';

export default function AppShell() {
  const { sidebarData, isLoading } = useSidebarData();
  const userOrgName = sidebarData?.organization_name || 'lomi.africa';

  useMetaTags({
    title: `${userOrgName} | Business | lomi.`,
    description: `${userOrgName}'s payment portal powered by lomi.`,
    favicon: '/favicon.ico',
  });

  const mainContent = useMemo(() => (
    <div className="relative h-full overflow-hidden bg-background">
      {!isLoading && <MemoizedSidebar />}
      <main
        id="content"
        className="overflow-x-hidden pt-16 transition-[margin] md:overflow-y-hidden md:pt-0 md:ml-64 h-full"
      >
        <Suspense fallback={<AnimatedLogoLoader />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  ), [isLoading]);

  return (
    <ProviderComposer>
      {mainContent}
    </ProviderComposer>
  );
}
