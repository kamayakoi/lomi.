import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';

export function useActivationStatus() {
    const [isLoading, setIsLoading] = useState(true);
    const [isActivated, setIsActivated] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchActivationStatus = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const { data, error } = await supabase.rpc('check_activation_status', { p_merchant_id: user.id });

                    if (error) {
                        setError('Failed to fetch activation status');
                    } else {
                        setIsActivated(data);
                    }
                }
            } catch (error) {
                setError('Failed to fetch activation status');
            } finally {
                setIsLoading(false);
            }
        };

        fetchActivationStatus();
    }, []);

    return { isLoading, isActivated, error };
}
