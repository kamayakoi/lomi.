import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

type ImportFunction = () => Promise<{
  default: React.ComponentType<object> | React.ComponentType<unknown>;
}>;

// Map of routes to their related routes that should be preloaded
const ROUTE_PRELOAD_MAP: Record<string, ImportFunction[]> = {
  '/': [
    () => import('@/pages/auth/sign-in'),
    () => import('@/pages/auth/sign-up'),
    () => import('@/pages/portal/Dashboard'),
  ],
  '/sign-in': [
    () => import('@/pages/auth/sign-up'),
    () => import('@/pages/auth/forgot-password'),
    () => import('@/pages/portal/Dashboard'),
  ],
  '/sign-up': [
    () => import('@/pages/auth/sign-in'),
    () => import('@/pages/auth/otp'),
  ],
  '/portal': [
    () => import('@/pages/portal/Dashboard'),
    () => import('@/pages/portal/settings'),
  ],
};

export function useRoutePreload(): void {
  const location = useLocation();

  useEffect(() => {
    const preloadFns = ROUTE_PRELOAD_MAP[location.pathname];
    if (!preloadFns) return;

    // Use requestIdleCallback for preloading to not block the main thread
    const handle = window.requestIdleCallback(() => {
      preloadFns.forEach(importFn => {
        // Preload the module but don't do anything with the result
        importFn().catch(() => {
          // Silently fail preloading - this isn't critical
        });
      });
    });

    return () => {
      window.cancelIdleCallback(handle);
    };
  }, [location.pathname]);
} 