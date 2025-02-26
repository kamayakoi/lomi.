import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStatus } from '@/lib/hooks/use-auth-status';
import AnimatedLogoLoader from '@/components/portal/loader';

// Auth routes that should redirect to /portal if user is already authenticated
const authRoutes = ['/sign-in', '/sign-up', '/log-in', '/sign-in-test', '/forgot-password', '/otp', '/auth/reset-password'];

// Routes that require authentication
const protectedRoutes = ['/onboarding'];

export function SessionCheck({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { isLoading, isAuthenticated } = useAuthStatus();

    useEffect(() => {
        if (!isLoading) {
            const currentPath = location.pathname;

            if (!isAuthenticated) {
                // Only redirect to sign-in if trying to access protected routes
                if (protectedRoutes.some(route => currentPath.startsWith(route))) {
                    navigate('/sign-in', { replace: true });
                }
            } else {
                if (authRoutes.includes(currentPath)) {
                    // If authenticated and on an auth route, redirect to home
                    navigate('/', { replace: true });
                }
            }
        }
    }, [isLoading, isAuthenticated, location, navigate]);

    if (isLoading) {
        return <AnimatedLogoLoader />;
    }

    return <>{children}</>;
}