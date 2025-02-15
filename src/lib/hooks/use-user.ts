import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';

export function useUser() {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error) {
                console.error('Error fetching user:', error);
            } else {
                setUser(user);
            }
            setIsLoading(false);
        };

        fetchUser();

        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN') {
                setUser(session?.user ?? null);
            } else if (event === 'SIGNED_OUT') {
                setUser(null);
            }
            setIsLoading(false);
        });

        return () => {
            authListener?.subscription.unsubscribe();
        };
    }, []);

    return { user, isLoading };
}