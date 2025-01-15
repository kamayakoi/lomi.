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

        // Listen for auth state changes
        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
        });

        // Listen for merchant profile updates
        const handleProfileUpdate = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUser(user);
            }
        };

        window.addEventListener('merchant-profile-updated', handleProfileUpdate);

        setData();

        return () => {
            authListener?.subscription.unsubscribe();
            window.removeEventListener('merchant-profile-updated', handleProfileUpdate);
        };
    }, []);

    return <UserContext.Provider value={{ user, session }}>{children}</UserContext.Provider>;
};

export { UserContext, UserProvider };