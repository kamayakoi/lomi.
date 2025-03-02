import { createContext, useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import mixpanelService from '@/utils/mixpanel/mixpanel';

interface UserContextProps {
    user: User | null;
    session: Session | null;
}

const UserContext = createContext<UserContextProps>({ user: null, session: null });

const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);

    // Helper function to identify user in Mixpanel
    const identifyUserInMixpanel = (user: User) => {
        mixpanelService.identify(user.id, {
            $email: user.email,
            $name: user.user_metadata?.['full_name'] || user.email,
            $created: user.created_at,
            last_sign_in: new Date().toISOString(),
            user_role: user.app_metadata?.['role'] || 'user',
            auth_provider: user.app_metadata?.['provider'] || 'email',
        });

        // Track user login event
        mixpanelService.track('User Logged In', {
            user_id: user.id,
            email: user.email,
            auth_provider: user.app_metadata?.['provider'] || 'email',
        });
    };

    useEffect(() => {
        const setData = async () => {
            const { data } = await supabase.auth.getSession();
            setSession(data.session);
            setUser(data.session?.user ?? null);

            // Identify user in Mixpanel if logged in
            if (data.session?.user) {
                identifyUserInMixpanel(data.session.user);
            }
        };

        // Listen for auth state changes
        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);

            // Identify user in Mixpanel on auth state change
            if (session?.user) {
                identifyUserInMixpanel(session.user);
            } else {
                // Reset Mixpanel user on logout
                mixpanelService.reset();
            }
        });

        // Listen for merchant profile updates
        const handleProfileUpdate = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUser(user);
                // Update user properties in Mixpanel
                identifyUserInMixpanel(user);
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