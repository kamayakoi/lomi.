import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { supabase } from '@/utils/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/custom/button';
import { toast } from '@/components/ui/use-toast';

const Onboarding: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigate('/sign-in');
            } else {
                setUser(user);
                setLoading(false);
            }
        };
        checkUser();
    }, [navigate]);

    const handleOnboardingComplete = async () => {
        try {
            const { error } = await supabase.auth.updateUser({
                data: { onboarded: true }
            });

            if (error) throw error;

            toast({
                title: "Onboarding Complete",
                description: "Your account has been set up successfully.",
            });
            navigate('/portal');
        } catch (error) {
            console.error('Error updating user:', error);
            toast({
                title: "Error",
                description: "There was a problem completing your onboarding. Please try again.",
                variant: "destructive",
            });
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className='container grid h-svh flex-col items-center justify-center bg-primary-foreground lg:max-w-none lg:px-0'>
            <div className='mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[480px] lg:p-8'>
                <Card className='p-6'>
                    <h1 className='text-2xl font-semibold tracking-tight'>Complete Your Profile</h1>
                    <p>Welcome, {user.user_metadata.name || user.email}! Let's set up your account.</p>
                    {/* Add onboarding form or steps here */}
                    <Button onClick={handleOnboardingComplete} className="mt-4">Complete Onboarding</Button>
                </Card>
            </div>
        </div>
    );
};

export default Onboarding;