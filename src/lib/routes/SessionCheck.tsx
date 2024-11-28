import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStatus } from '@/lib/hooks/useAuthStatus';
import AnimatedLogoLoader from '@/components/dashboard/loader';

// Auth routes that should redirect to /portal if user is already authenticated
const authRoutes = ['/sign-in', '/sign-up', '/log-in', '/sign-in-test', '/forgot-password', '/otp', '/auth/reset-password'];

export function SessionCheck({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { isLoading, isAuthenticated } = useAuthStatus();

    useEffect(() => {
        if (!isLoading) {
            const currentPath = location.pathname;

            if (!isAuthenticated) {
                if (currentPath.startsWith('/portal') || currentPath.startsWith('/onboarding')) {
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