import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { User } from '@supabase/supabase-js';

interface FormData {
    phoneNumber: string;
    country: string;
    orgName: string;
    orgCountry: string;
    orgCity: string;
    orgAddress: string;
    orgPostalCode: string;
    orgIndustry: string;
}

const NewOnboarding: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();

    const [formData, setFormData] = useState<FormData>({
        phoneNumber: '',
        country: '',
        orgName: '',
        orgCountry: '',
        orgCity: '',
        orgAddress: '',
        orgPostalCode: '',
        orgIndustry: '',
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!user) throw new Error("User not found");

            const { error } = await supabase.rpc('complete_onboarding', {
                p_merchant_id: user.id,
                p_phone_number: formData.phoneNumber,
                p_country: formData.country,
                p_org_name: formData.orgName,
                p_org_country: formData.orgCountry,
                p_org_city: formData.orgCity,
                p_org_address: formData.orgAddress,
                p_org_postal_code: formData.orgPostalCode,
                p_org_industry: formData.orgIndustry
            });

            if (error) throw error;

            toast({
                title: "Onboarding Complete",
                description: "Your account has been set up successfully.",
            });
            navigate('/portal');
        } catch (error) {
            console.error('Error during onboarding:', error);
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
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="phoneNumber">Phone Number</Label>
                            <Input
                                id="phoneNumber"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="country">Country</Label>
                            <Input
                                id="country"
                                name="country"
                                value={formData.country}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="orgName">Organization Name</Label>
                        <Input
                            id="orgName"
                            name="orgName"
                            value={formData.orgName}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="orgCountry">Organization Country</Label>
                            <Input
                                id="orgCountry"
                                name="orgCountry"
                                value={formData.orgCountry}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="orgCity">Organization City</Label>
                            <Input
                                id="orgCity"
                                name="orgCity"
                                value={formData.orgCity}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="orgAddress">Organization Address</Label>
                        <Input
                            id="orgAddress"
                            name="orgAddress"
                            value={formData.orgAddress}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="orgPostalCode">Postal Code</Label>
                            <Input
                                id="orgPostalCode"
                                name="orgPostalCode"
                                value={formData.orgPostalCode}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="orgIndustry">Industry</Label>
                            <Input
                                id="orgIndustry"
                                name="orgIndustry"
                                value={formData.orgIndustry}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Submitting...' : 'Complete Onboarding'}
                    </Button>
                </form>
            </Card>
        </div>
    );
};

export default NewOnboarding;