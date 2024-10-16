import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './sidebar';
import { useMetaTags } from '@/lib/contexts/useMetaTags';
import Loader from '@/components/dashboard/loader';
import { useSidebarData } from '@/lib/hooks/useSidebarData';
import { SidebarProvider } from '@/lib/contexts/sidebarContext';
import { UserAvatarProvider } from '@/lib/contexts/userAvatarContext';
import { NotificationsProvider } from '@/lib/contexts/notificationsContext';
import { ActivationProvider } from '@/lib/contexts/ActivationContext';

export default function AppShell() {
  const { sidebarData, isLoading } = useSidebarData();
  const userOrgName = sidebarData?.organization_name || 'lomi.africa';

  useMetaTags({
    title: `${userOrgName} | Business | lomi.`,
    description: `${userOrgName}'s payment portal powered by lomi.`,
    favicon: '/portal-favicon.ico',
  });

  const MemoizedSidebar = React.memo(Sidebar);
  if (isLoading) {
    return <Loader />;
  }

  return (
    <SidebarProvider>
      <ActivationProvider>
        <UserAvatarProvider>
          <NotificationsProvider>
            <div className="relative h-full overflow-hidden bg-background">
              <MemoizedSidebar />
              <main
                id="content"
                className="overflow-x-hidden pt-16 transition-[margin] md:overflow-y-hidden md:pt-0 md:ml-64 h-full"
              >
                <React.Suspense fallback={<Loader />}>
                  <Outlet />
                </React.Suspense>
              </main>
            </div>
          </NotificationsProvider>
        </UserAvatarProvider>
      </ActivationProvider>
    </SidebarProvider>
  );
}
