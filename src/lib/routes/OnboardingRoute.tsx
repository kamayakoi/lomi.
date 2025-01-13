import { Navigate } from 'react-router-dom';
import { useAuthStatus } from '@/lib/hooks/useAuthStatus';
import AnimatedLogoLoader from '@/components/portal/loader';

export function OnboardingRoute({ children }: { children: React.ReactNode }) {
    const { isLoading, isAuthenticated, isOnboarded } = useAuthStatus();

    if (isLoading) {
        return <AnimatedLogoLoader />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/sign-in" replace />;
    }

    if (isOnboarded) {
        return <Navigate to="/portal" replace />;
    }

    return <>{children}</>;
}