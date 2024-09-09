import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { User } from '@supabase/supabase-js';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const formSchema = z.object({
    phoneNumber: z.string().min(1, "Phone number is required"),
    country: z.string().min(1, "Country is required"),
    orgName: z.string().min(1, "Organization name is required"),
    orgCountry: z.string().min(1, "Organization country is required"),
    orgCity: z.string().min(1, "Organization city is required"),
    orgAddress: z.string().min(1, "Organization address is required"),
    orgPostalCode: z.string().min(1, "Postal code is required"),
    orgIndustry: z.string().min(1, "Industry is required"),
});

const NewOnboarding: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            phoneNumber: '',
            country: '',
            orgName: '',
            orgCountry: '',
            orgCity: '',
            orgAddress: '',
            orgPostalCode: '',
            orgIndustry: '',
        },
    });

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error || !session) {
                navigate('/sign-in');
                return;
            }
            setUser(session.user);
            setLoading(false);
        };
        checkUser();
    }, [navigate]);

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            setLoading(true);

            if (!user) {
                throw new Error("User not found");
            }

            // Call the complete_onboarding function
            const { error } = await supabase.rpc('complete_onboarding', {
                p_merchant_id: user.id,
                p_phone_number: data.phoneNumber,
                p_country: data.country,
                p_org_name: data.orgName,
                p_org_country: data.orgCountry,
                p_org_city: data.orgCity,
                p_org_address: data.orgAddress,
                p_org_postal_code: data.orgPostalCode,
                p_org_industry: data.orgIndustry
            });

            if (error) {
                throw error;
            }

            // Update the local session to reflect the onboarded status
            await supabase.auth.refreshSession();

            toast({
                title: "Onboarding Complete",
                description: "Your account has been set up successfully.",
            });
            navigate('/portal');
        } catch (error) {
            console.error('Error completing onboarding:', error);
            toast({
                title: "Error",
                description: "There was a problem completing your onboarding. Please try again.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Card className="p-6 max-w-lg mx-auto">
                <h1 className="text-2xl font-bold mb-6 text-center">Complete Your Profile</h1>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {Object.keys(form.getValues()).map((fieldName) => (
                        <div key={fieldName}>
                            <Label htmlFor={fieldName}>{fieldName.charAt(0).toUpperCase() + fieldName.slice(1).replace(/([A-Z])/g, ' $1')}</Label>
                            <Input
                                id={fieldName}
                                {...form.register(fieldName as keyof z.infer<typeof formSchema>)}
                                className="mt-1"
                            />
                            {form.formState.errors[fieldName as keyof z.infer<typeof formSchema>] && (
                                <p className="text-red-500 text-sm mt-1">
                                    {form.formState.errors[fieldName as keyof z.infer<typeof formSchema>]?.message}
                                </p>
                            )}
                        </div>
                    ))}
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Submitting...' : 'Complete Onboarding'}
                    </Button>
                </form>
            </Card>
        </div>
    );
};

export default NewOnboarding;