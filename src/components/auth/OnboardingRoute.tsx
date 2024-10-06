import { Navigate } from 'react-router-dom';
import { useAuthStatus } from '@/lib/hooks/useAuthStatus';

export function OnboardingRoute({ children }: { children: React.ReactNode }) {
    const { isLoading, isOnboarded } = useAuthStatus();

    if (isLoading) {
        return null;
    }

    if (isOnboarded) {
        return <Navigate to="/portal" replace />;
    }

    return <>{children}</>;
}