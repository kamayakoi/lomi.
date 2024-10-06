import { Navigate } from 'react-router-dom';
import { useActivationStatus } from '@/lib/hooks/useActivationStatus';
import LoadingButton from '@/components/dashboard/loader';

export function ActivationRoute({ children }: { children: React.ReactNode }) {
    const { isLoading, isActivated, error } = useActivationStatus();

    if (isLoading) {
        return <LoadingButton />;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (isActivated) {
        return <Navigate to="/portal" replace />;
    }

    return <>{children}</>;
}