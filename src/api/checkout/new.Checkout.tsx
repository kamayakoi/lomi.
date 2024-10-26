import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useParams } from 'react-router-dom';
import { fetchDataForCheckout, fetchOrganizationDetails } from './support_checkout';
import { CheckoutData } from './CheckoutTypes';
import { useUser } from '@/lib/hooks/useUser';
import { supabase } from '@/utils/supabase/client';

export default function CheckoutPage() {
    const { linkId } = useParams<{ linkId?: string }>();
    const [organization, setOrganization] = useState<{ organizationId: string | null; logoUrl: string | null }>({ organizationId: null, logoUrl: null });
    const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
    const { user } = useUser();

    useEffect(() => {
        // Fetch organization details
        const fetchOrganization = async () => {
            if (user?.id) {
                const orgDetails = await fetchOrganizationDetails(user.id);
                setOrganization({ ...orgDetails, logoUrl: null });
            }
        };

        // Fetch checkout data based on the URL parameter
        const fetchData = async () => {
            if (linkId && organization.organizationId) {
                const data = await fetchDataForCheckout(linkId, organization.organizationId);
                console.log('Checkout Data:', data);
                setCheckoutData(data);

                // Download the organization logo using the relative path
                if (data?.paymentLink?.organizationLogoUrl) {
                    const logoPath = data.paymentLink.organizationLogoUrl;
                    const { data: logoData, error: logoError } = await supabase
                        .storage
                        .from('logos')
                        .download(logoPath);

                    if (logoError) {
                        console.error('Error downloading logo:', logoError);
                    } else {
                        const logoUrl = URL.createObjectURL(logoData);
                        setOrganization(prevOrg => ({ ...prevOrg, logoUrl }));
                    }
                }
            }
        };

        fetchOrganization();
        fetchData();
    }, [linkId, organization.organizationId, user?.id]);

    return (
        <div className="max-w-6xl mx-auto my-4 md:my-8 border border-gray-200 rounded-lg shadow-lg overflow-hidden">
            <div className="bg-white flex flex-col md:flex-row">
                {/* Left side - Product details */}
                <div className="w-full md:w-1/2 p-4 md:p-8 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center mb-4">
                            {organization.logoUrl && (
                                <img
                                    src={organization.logoUrl}
                                    alt="Organization Logo"
                                    width={80}
                                    height={80}
                                    className="rounded-md mr-4"
                                />
                            )}
                            <div>
                                {checkoutData?.merchantProduct && (
                                    <>
                                        <h2 className="text-lg font-semibold text-gray-900">{checkoutData.merchantProduct.name}</h2>
                                        <p className="text-gray-600">{checkoutData.merchantProduct.description}</p>
                                        <p className="text-gray-800 font-semibold mt-2">{checkoutData.merchantProduct.price} {checkoutData.merchantProduct.currencyCode}</p>
                                    </>
                                )}
                                {checkoutData?.subscriptionPlan && (
                                    <>
                                        <h2 className="text-lg font-semibold text-gray-900">{checkoutData.subscriptionPlan.name}</h2>
                                        <p className="text-gray-600">{checkoutData.subscriptionPlan.description}</p>
                                        <p className="text-gray-800 font-semibold mt-2">{checkoutData.subscriptionPlan.amount} {checkoutData.subscriptionPlan.currencyCode}</p>
                                        <p className="text-gray-600 mt-1">Billed {checkoutData.subscriptionPlan.billingFrequency}</p>
                                    </>
                                )}
                                {!checkoutData?.merchantProduct && !checkoutData?.subscriptionPlan && (
                                    <>
                                        <h2 className="text-lg font-semibold text-gray-900">{checkoutData?.paymentLink?.title}</h2>
                                        <p className="text-gray-600">{checkoutData?.paymentLink?.publicDescription}</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="border-t border-gray-200 pt-4 mb-4">
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-700">Subtotal</span>
                                <span className="text-gray-900">
                                    {checkoutData?.merchantProduct?.price || checkoutData?.subscriptionPlan?.amount || checkoutData?.paymentLink?.price} {checkoutData?.paymentLink?.currencyCode}
                                </span>
                            </div>
                            <div className="flex justify-between font-semibold">
                                <span className="text-gray-900">Total</span>
                                <span className="text-gray-900">
                                    {checkoutData?.merchantProduct?.price || checkoutData?.subscriptionPlan?.amount || checkoutData?.paymentLink?.price} {checkoutData?.paymentLink?.currencyCode}
                                </span>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 text-center">
                            By completing this purchase, you agree to our <a href="/terms" className="text-blue-600 hover:underline">Terms</a> and <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>.
                        </p>
                    </div>
                </div>

                {/* Right side - Checkout component */}
                <div className="w-full md:w-1/2 p-4 md:p-8">
                    <h2 className="text-2xl font-bold mb-6 text-gray-900">Checkout</h2>
                    {/* Add your checkout form and logic here */}
                    <Button className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 shadow-md">
                        Pay Now
                    </Button>
                </div>
            </div>
        </div>
    );
}
