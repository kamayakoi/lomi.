import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStatus } from '@/lib/hooks/use-auth-status';
import AnimatedLogoLoader from '@/components/portal/loader';

// Auth routes that should redirect to /portal if user is already authenticated
const authRoutes = ['/sign-in', '/sign-up', '/log-in', '/sign-in-test', '/forgot-password', '/otp', '/auth/reset-password'];

// Routes that require authentication
const protectedRoutes = ['/portal', '/onboarding'];

export function SessionCheck({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { isLoading, isAuthenticated } = useAuthStatus();
    const isPortalSubdomain = window.location.hostname.startsWith('portal.');

    useEffect(() => {
        if (!isLoading) {
            const currentPath = location.pathname;

            if (!isAuthenticated) {
                // Only redirect to sign-in if trying to access protected routes
                if (protectedRoutes.some(route => currentPath.startsWith(route))) {
                    const signInPath = isPortalSubdomain ? '/sign-in' : '/sign-in';
                    navigate(signInPath, { replace: true });
                }
            } else {
                if (authRoutes.includes(currentPath)) {
                    // If authenticated and on an auth route, redirect to appropriate location
                    const redirectPath = isPortalSubdomain ? '/' : '/portal';
                    navigate(redirectPath, { replace: true });
                }
            }
        }
    }, [isLoading, isAuthenticated, location, navigate, isPortalSubdomain]);

    if (isLoading) {
        return <AnimatedLogoLoader />;
    }

    return <>{children}</>;
}