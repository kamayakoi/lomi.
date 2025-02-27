import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStatus } from '@/lib/hooks/use-auth-status';
import AnimatedLogoLoader from '@/components/portal/loader';
import { config } from '@/utils/config';

// Auth routes that should redirect to /portal if user is already authenticated
const authRoutes = ['/sign-in', '/sign-up', '/log-in', '/sign-in-test', '/forgot-password', '/otp', '/auth/reset-password'];

// Portal routes that require authentication
const portalRoutes = ['/portal', '/onboarding'];

export function SessionCheck({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { isLoading, isAuthenticated } = useAuthStatus();
    const isProduction = import.meta.env['BUN_ENV'] === 'production';

    useEffect(() => {
        if (!isLoading) {
            const currentPath = location.pathname;

            if (!isAuthenticated) {
                // If not authenticated and trying to access portal routes, redirect to sign in
                if (portalRoutes.some(route => currentPath.startsWith(route))) {
                    navigate('/sign-in', { replace: true });
                }
            } else {
                // If authenticated and on auth routes, redirect to portal
                if (authRoutes.includes(currentPath)) {
                    if (isProduction) {
                        window.location.href = `${config.portalUrl}/`;
                        return;
                    }
                    navigate('/portal', { replace: true });
                }

                // If authenticated and accessing portal routes directly
                if (currentPath.startsWith('/portal')) {
                    if (isProduction) {
                        // Remove /portal prefix and redirect to portal subdomain
                        const path = currentPath.replace('/portal', '');
                        window.location.href = `${config.portalUrl}${path || '/'}`;
                        return;
                    }
                }
            }
        }
    }, [isLoading, isAuthenticated, location, navigate, isProduction]);

    if (isLoading) {
        return <AnimatedLogoLoader />;
    }

    return <>{children}</>;
}