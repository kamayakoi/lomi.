import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStatus } from '@/lib/hooks/use-auth-status';
import AnimatedLogoLoader from '@/components/portal/loader';

// Auth routes that should redirect to /portal if user is already authenticated
const authRoutes = ['/sign-in', '/sign-up', '/log-in', '/sign-in-test', '/forgot-password', '/otp', '/auth/reset-password'];

// Protected routes that require authentication
const protectedRoutes = ['/portal', '/onboarding', '/activation'];

export function SessionCheck({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { isLoading, isAuthenticated } = useAuthStatus();

    useEffect(() => {
        if (!isLoading) {
            const currentPath = location.pathname;

            if (!isAuthenticated) {
                // Only redirect to sign-in if trying to access a protected route
                const isProtectedRoute = protectedRoutes.some(route => currentPath.startsWith(route));
                if (isProtectedRoute) {
                    navigate('/sign-in', { replace: true });
                }
            } else {
                if (authRoutes.includes(currentPath)) {
                    navigate('/portal', { replace: true });
                }
            }
        }
    }, [isLoading, isAuthenticated, location, navigate]);

    if (isLoading) {
        return <AnimatedLogoLoader />;
    }

    return <>{children}</>;
}