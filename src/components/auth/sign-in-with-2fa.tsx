import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from "@/components/ui/use-toast"
import { supabase } from '@/utils/supabase/client'
import Verify2FA from './verify-2fa'
import { useRouter } from 'next/navigation'
import { AuthError } from '@supabase/supabase-js'

interface SignInFormData {
    email: string;
    password: string;
}

export default function SignInWith2FA() {
    const router = useRouter();
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
            // 1. First attempt regular sign in
            const { error: authError } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password
            });

            if (authError) throw authError;

            // 2. Check if user has 2FA enabled and if verification is needed
            const { data: merchant, error: merchantError } = await supabase
                .from('merchants')
                .select('merchant_id, has_2fa')
                .eq('email', formData.email)
                .single();

            if (merchantError) throw merchantError;

            if (merchant.has_2fa) {
                // Check if 2FA verification is needed
                const { data: needs2FA, error: checkError } = await supabase.rpc(
                    'should_require_2fa',
                    { p_merchant_id: merchant.merchant_id }
                );

                if (checkError) throw checkError;

                if (needs2FA) {
                    // Show 2FA verification only if needed
                    setMerchantId(merchant.merchant_id);
                    setShow2FA(true);
                } else {
                    // 2FA not needed this time
                    handleLoginSuccess();
                }
            } else {
                // No 2FA enabled, proceed with login
                handleLoginSuccess();
            }
        } catch (error) {
            console.error('Sign in error:', error);
            toast({
                title: "Error",
                description: error instanceof AuthError ? error.message : "Failed to sign in",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoginSuccess = () => {
        toast({
            title: "Success",
            description: "Successfully signed in",
        });
        // Redirect to dashboard or home page
        router.push('/portal/dashboard');
    };

    const handle2FACancel = async () => {
        setShow2FA(false);
        // Sign out if they cancel 2FA
        await supabase.auth.signOut();
        setMerchantId(null);
    };

    return (
        <div className="w-full max-w-md space-y-6">
            <div className="space-y-2 text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground">
                    Enter your credentials to access your account
                </p>
            </div>

            <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="m@example.com"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="rounded-none"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
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
                    {isLoading ? 'Signing in...' : 'Sign in'}
                </Button>
            </form>

            {/* 2FA Verification Dialog */}
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