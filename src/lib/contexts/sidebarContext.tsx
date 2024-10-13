import React, { createContext, useEffect, useState } from 'react';
import { fetchSidebarData } from '../actions/sidebarActions';
import { SidebarData } from '@/lib/types/sidebarTypes';

interface SidebarContextValue {
    sidebarData: SidebarData;
    isLoading: boolean;
    error: string | null;
    fetchSidebarData: () => Promise<void>;
}

export const SidebarContext = createContext<SidebarContextValue | undefined>(undefined);

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [sidebarData, setSidebarData] = useState<SidebarData>({
        organizationName: null,
        organizationLogo: null,
        merchantName: null,
        merchantRole: null,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchSidebarData(setSidebarData, setIsLoading, setError);
    }, []);

    const contextValue: SidebarContextValue = {
        sidebarData,
        isLoading,
        error,
        fetchSidebarData: () => fetchSidebarData(setSidebarData, setIsLoading, setError),
    };

    return <SidebarContext.Provider value={contextValue}>{children}</SidebarContext.Provider>;
};
