import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from "@/lib/hooks/use-toast"
import { supabase } from '@/utils/supabase/client'
import Verify2FA from './verify-2fa'
import { AuthError } from '@supabase/supabase-js'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

interface SignInFormData {
    email: string;
    password: string;
}

export default function SignInWith2FA() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [formData, setFormData] = useState<SignInFormData>({
        email: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [show2FA, setShow2FA] = useState(false);
    const [merchantId, setMerchantId] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const { error: authError } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password
            });

            if (authError) throw authError;

            const { data: merchant, error: merchantError } = await supabase
                .from('merchants')
                .select('merchant_id, has_2fa')
                .eq('email', formData.email)
                .single();

            if (merchantError) throw merchantError;

            if (merchant.has_2fa) {
                const { data: needs2FA, error: checkError } = await supabase.rpc(
                    'should_require_2fa',
                    { p_merchant_id: merchant.merchant_id }
                );

                if (checkError) throw checkError;

                if (needs2FA) {
                    setMerchantId(merchant.merchant_id);
                    setShow2FA(true);
                } else {
                    handleLoginSuccess();
                }
            } else {
                handleLoginSuccess();
            }
        } catch (error) {
            console.error('Sign in error:', error);
            toast({
                title: "Error",
                description: error instanceof AuthError ? error.message : t('auth.2fa.error.unexpected'),
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoginSuccess = () => {
        toast({
            title: "Success",
            description: t('auth.2fa.success'),
        });
        navigate('/portal/dashboard');
    };

    const handle2FACancel = async () => {
        setShow2FA(false);
        await supabase.auth.signOut();
        setMerchantId(null);
    };

    return (
        <div className="w-full max-w-md space-y-6">
            <div className="space-y-2 text-center">
                <h1 className="text-2xl font-bold">{t('auth.2fa.sign_in.title')}</h1>
                <p className="text-muted-foreground">
                    {t('auth.2fa.sign_in.subtitle')}
                </p>
            </div>

            <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">{t('auth.2fa.sign_in.email_label')}</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder={t('auth.2fa.sign_in.email_placeholder')}
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="rounded-none"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">{t('auth.2fa.sign_in.password_label')}</Label>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        required
                        value={formData.password}
                        onChange={handleInputChange}
                        className="rounded-none"
                    />
                </div>

                <Button
                    type="submit"
                    className="w-full rounded-none"
                    disabled={isLoading}
                >
                    {isLoading ? t('auth.2fa.sign_in.signing_in') : t('auth.2fa.sign_in.sign_in_button')}
                </Button>
            </form>

            {show2FA && merchantId && (
                <Verify2FA
                    merchantId={merchantId}
                    onSuccess={handleLoginSuccess}
                    onCancel={handle2FACancel}
                />
            )}
        </div>
    );
} 