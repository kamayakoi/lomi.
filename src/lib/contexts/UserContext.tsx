import { createContext, useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface UserContextProps {
    user: User | null;
    session: Session | null;
}

const UserContext = createContext<UserContextProps>({ user: null, session: null });

const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);

    useEffect(() => {
        const setData = async () => {
            const { data } = await supabase.auth.getSession();
            setSession(data.session);
            setUser(data.session?.user ?? null);
        };

        const { data: authListener } = supabase.auth.onAuthStateChange(async (_, session) => {
            setSession(session);
            setUser(session?.user ?? null);
        });

        setData();

        return () => {
            authListener?.subscription.unsubscribe();
        };
    }, []);

    return <UserContext.Provider value={{ user, session }}>{children}</UserContext.Provider>;
};

export { UserContext, UserProvider };