import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { supabase } from '@/utils/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/custom/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { User } from '@supabase/supabase-js';

const Onboarding: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error) {
                console.error('Error getting session:', error);
                navigate('/sign-in');
                return;
            }

            if (session?.user) {
                setUser(session.user);
                setIsEmailVerified(session.user.email_confirmed_at !== null);
                const { data: profile, error: profileError } = await supabase
                    .from('users')
                    .select('onboarded, phone_number')
                    .eq('user_id', session.user.id)
                    .single();

                if (profileError) {
                    console.error('Error fetching user profile:', profileError);
                    setLoading(false);
                    return;
                }

                if (profile) {
                    if (profile.onboarded) {
                        navigate('/portal');
                    } else {
                        setPhoneNumber(profile.phone_number || '');
                        setLoading(false);
                    }
                } else {
                    console.error('User profile not found');
                    setLoading(false);
                }
            } else {
                navigate('/sign-in');
            }
        };
        checkUser();
    }, [navigate]);

    const handleResendVerification = async () => {
        try {
            const { error } = await supabase.auth.resend({
                type: 'signup',
                email: user?.email || '',
            });
            if (error) throw error;
            toast({
                title: "Verification Email Sent",
                description: "Please check your inbox for the verification link.",
            });
        } catch (error) {
            console.error('Error resending verification email:', error);
            toast({
                title: "Error",
                description: "There was a problem sending the verification email. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleOnboardingComplete = async () => {
        try {
            if (!user) throw new Error('No user found');

            const { error: profileError } = await supabase
                .from('users')
                .update({
                    onboarded: true,
                    phone_number: phoneNumber,
                    verified: true // Assuming email verification is complete at this point
                })
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
        return (
            <div className='container grid h-svh flex-col items-center justify-center bg-primary-foreground lg:max-w-none lg:px-0'>
                <Card className='p-6'>
                    <h1 className='text-2xl font-semibold tracking-tight'>Loading...</h1>
                    <p>Please wait while we set up your account.</p>
                </Card>
            </div>
        );
    }

    if (!isEmailVerified) {
        return (
            <div className='container grid h-svh flex-col items-center justify-center bg-primary-foreground lg:max-w-none lg:px-0'>
                <Card className='p-6'>
                    <h1 className='text-2xl font-semibold tracking-tight'>Email Verification Required</h1>
                    <p>Please verify your email to continue with onboarding.</p>
                    <Button onClick={handleResendVerification} className="mt-4">Resend Verification Email</Button>
                </Card>
            </div>
        );
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
                    <p>Welcome, {user.user_metadata.name || user.email}! Let&apos;s finish setting up your account.</p>
                    <Input
                        type="tel"
                        placeholder="Phone Number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="mt-4"
                    />
                    <Button onClick={handleOnboardingComplete} className="mt-4 w-full">Complete Onboarding</Button>
                </Card>
            </div>
        </div>
    );
};

export default Onboarding;