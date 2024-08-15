import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { supabase } from '@/utils/supabase/client';
import { useNavigate } from 'react-router-dom';

const Onboarding: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigate('/sign-in');
            } else {
                setLoading(false);
            }
        };
        checkUser();
    }, [navigate]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className='container grid h-svh flex-col items-center justify-center bg-primary-foreground lg:max-w-none lg:px-0'>
            <div className='mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[480px] lg:p-8'>
                <Card className='p-6'>
                    <h1 className='text-2xl font-semibold tracking-tight'>Complete Your Profile</h1>
                    <p>Welcome! Let's set up your account.</p>
                    {/* Add onboarding form or steps here */}
                </Card>
            </div>
        </div>
    );
};

export default Onboarding;