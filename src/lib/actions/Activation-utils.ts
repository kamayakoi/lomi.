import { createContext, useContext } from 'react';

export interface ActivationContextProps {
    isLoading: boolean;
    isActivated: boolean;
    error: string | null;
}

export const ActivationContext = createContext<ActivationContextProps>({
    isLoading: true,
    isActivated: false,
    error: null,
});

export const useActivationContext = () => useContext(ActivationContext);
