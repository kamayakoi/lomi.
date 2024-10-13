import React, { createContext, useEffect, useState } from 'react';
import { fetchUserAvatar } from '@/lib/actions/userAvatarActions';

interface UserAvatarContextValue {
    avatarUrl: string | null;
    isLoading: boolean;
    error: string | null;
    fetchUserAvatar: () => Promise<void>;
}

export const UserAvatarContext = createContext<UserAvatarContextValue | undefined>(undefined);

export const UserAvatarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchUserAvatar(setAvatarUrl, setIsLoading, setError);
    }, []);

    const contextValue: UserAvatarContextValue = {
        avatarUrl,
        isLoading,
        error,
        fetchUserAvatar: () => fetchUserAvatar(setAvatarUrl, setIsLoading, setError),
    };

    return <UserAvatarContext.Provider value={contextValue}>{children}</UserAvatarContext.Provider>;
};
