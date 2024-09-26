import { createContext, useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';

interface UserContextProps {
    user: User | null;
}

export const UserContext = createContext<UserContextProps>({ user: null });

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };

        fetchUser();
    }, []);

    return <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>;
};