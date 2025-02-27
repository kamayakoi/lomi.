import { Navigate } from 'react-router-dom';
import { useAuthStatus } from '@/lib/hooks/use-auth-status';
import AnimatedLogoLoader from '@/components/portal/loader';
import { config } from '@/utils/config';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isLoading, isAuthenticated, isOnboarded } = useAuthStatus();
    const isProduction = import.meta.env['BUN_ENV'] === 'production';

    if (isLoading) {
        return <AnimatedLogoLoader />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/sign-in" replace />;
    }

    if (!isOnboarded) {
        // In production, redirect to portal subdomain for onboarding
        if (isProduction) {
            window.location.href = `${config.portalUrl}/onboarding`;
            return null;
        }
        return <Navigate to="/onboarding" replace />;
    }

    return <>{children}</>;
}