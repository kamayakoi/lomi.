import { useActivationStatus } from '@/lib/hooks/use-activation-status';
import NoAccessPanel from '@/components/custom/no-access-panel';
import Loader from '@/components/portal/loader'

export function withActivationCheck<P extends object>(WrappedComponent: React.ComponentType<P>) {
    return function WithActivationCheck(props: P) {
        const { isLoading, isActivated, error } = useActivationStatus();

        if (isLoading) {
            return <Loader />;
        }

        if (error) {
            return <div>Error: {error}</div>;
        }

        if (!isActivated) {
            return <NoAccessPanel />;
        }

        return <WrappedComponent {...props} />;
    };
}