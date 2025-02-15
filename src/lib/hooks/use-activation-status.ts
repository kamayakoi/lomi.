import { useActivationContext } from '@/lib/actions/Activation-utils';

export function useActivationStatus() {
    const { isLoading, isActivated, error } = useActivationContext();
    return { isLoading, isActivated, error };
}
