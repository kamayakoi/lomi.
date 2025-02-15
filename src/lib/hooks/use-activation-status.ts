import { useActivationContext } from '@/lib/actions/activation-utils';

export function useActivationStatus() {
    const { isLoading, isActivated, error } = useActivationContext();
    return { isLoading, isActivated, error };
}
