import { Navigate } from 'react-router-dom';
import { useActivationContext } from '@/lib/actions/Activation-utils';

export function ActivationRoute({ children }: { children: React.ReactNode }) {
    const { isActivated, error } = useActivationContext();

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (isActivated) {
        return <Navigate to="/portal" replace />;
    }

    return <>{children}</>;
}
