import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { supabase } from '@/utils/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/custom/button';
import { toast } from '@/components/ui/use-toast';
import { User } from '@supabase/supabase-js';

const Onboarding: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUser(user);
                const { data: profile } = await supabase
                    .from('users')
                    .select('onboarded')
                    .eq('user_id', user.id)
                    .single();

                if (profile && profile.onboarded) {
                    navigate('/portal');
                } else {
                    setLoading(false);
                }
            } else {
                // If no user, redirect to sign-in page
                navigate('/sign-in');
            }
        };
        checkUser();
    }, [navigate]);

    const handleOnboardingComplete = async () => {
        try {
            if (!user) throw new Error('No user found');

            const { error: updateError } = await supabase.auth.updateUser({
                data: { onboarded: true }
            });

            if (updateError) throw updateError;

            const { error: profileError } = await supabase
                .from('users')
                .update({ onboarded: true })
                .eq('user_id', user.id);

            if (profileError) throw profileError;

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

    if (!user) {
        return (
            <div className='container grid h-svh flex-col items-center justify-center bg-primary-foreground lg:max-w-none lg:px-0'>
                <Card className='p-6'>
                    <h1 className='text-2xl font-semibold tracking-tight'>Authentication Required</h1>
                    <p>Please sign in to complete your onboarding.</p>
                    <Button onClick={() => navigate('/sign-in')} className="mt-4">Sign In</Button>
                </Card>
            </div>
        );
    }

    return (
        <div className='container grid h-svh flex-col items-center justify-center bg-primary-foreground lg:max-w-none lg:px-0'>
            <div className='mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[480px] lg:p-8'>
                <Card className='p-6'>
                    <h1 className='text-2xl font-semibold tracking-tight'>Complete Your Profile</h1>
                    <p>Welcome, {user.user_metadata.name || user.email}! Let&apos;s set up your account.</p>
                    {/* Add onboarding form or steps here */}
                    <Button onClick={handleOnboardingComplete} className="mt-4">Complete Onboarding</Button>
                </Card>
            </div>
        </div>
    );
};

export default Onboarding;