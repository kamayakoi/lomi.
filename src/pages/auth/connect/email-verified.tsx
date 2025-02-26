import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/utils/supabase/client';
import { Button } from '@/components/custom/button';
import { Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const EmailVerified = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'checking' | 'same-browser' | 'different-browser'>('checking');

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (session) {
                // User is logged in in this browser
                setStatus('same-browser');
                // Redirect to onboarding after a short delay
                setTimeout(() => {
                    navigate('/onboarding', { replace: true });
                }, 2000);
            } else {
                setStatus('different-browser');
            }
        };

        checkSession();
    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="w-full max-w-md mx-auto p-6">
                <div className="bg-card border rounded-lg shadow-lg p-8 text-center">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full mx-auto flex items-center justify-center mb-6">
                        <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>

                    <h2 className="text-2xl font-semibold tracking-tight mb-4">
                        {t('auth.email_verified.title')}
                    </h2>

                    {status === 'checking' && (
                        <p className="text-muted-foreground">
                            {t('auth.email_verified.checking')}
                        </p>
                    )}

                    {status === 'same-browser' && (
                        <p className="text-muted-foreground">
                            {t('auth.email_verified.redirecting_onboarding')}
                        </p>
                    )}

                    {status === 'different-browser' && (
                        <>
                            <p className="text-muted-foreground mb-6">
                                {t('auth.email_verified.different_browser')}
                            </p>
                            <div className="space-y-4">
                                <Button
                                    className="w-full"
                                    onClick={() => navigate('/sign-in', { replace: true })}
                                >
                                    {t('auth.email_verified.sign_in_button')}
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmailVerified; 