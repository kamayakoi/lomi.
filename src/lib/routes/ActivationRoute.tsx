import { Navigate } from 'react-router-dom';
import { useActivationContext } from '@/lib/actions/Activation-utils';
import LoadingButton from '@/components/dashboard/loader';

export function ActivationRoute({ children }: { children: React.ReactNode }) {
    const { isLoading, isActivated, error } = useActivationContext();

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
