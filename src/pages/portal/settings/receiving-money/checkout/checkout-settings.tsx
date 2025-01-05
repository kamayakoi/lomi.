import { useState, useEffect, useCallback } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PaymentSettings } from './payment-settings'
import { FeeSettings } from './fee-settings'
import { NotificationSettings } from './notification-settings'
import ContentSection from '@/components/dashboard/content-section'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { supabase } from '@/utils/supabase/client'
import { useSidebarData } from '@/lib/hooks/useSidebarData'
import { withActivationCheck } from '@/components/custom/withActivationCheck'
import { AlertCircle } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import { type CheckoutSettings } from '@/lib/types/checkoutsettings'

function CheckoutSettingsPage() {
    const [activeTab, setActiveTab] = useState('payment')
    const [settings, setSettings] = useState<CheckoutSettings | null>(null)
    const [error, setError] = useState<string | null>(null)
    const { sidebarData } = useSidebarData()

    const fetchCheckoutSettings = useCallback(async () => {
        try {
            const orgId = sidebarData?.organization_id;
            if (!orgId || typeof orgId !== 'string') {
                throw new Error('Organization ID is required');
            }

            console.log('Fetching settings with org ID:', orgId);
            const { data, error } = await supabase
                .rpc('fetch_organization_checkout_settings', {
                    p_organization_id: orgId
                })

            if (error) throw error

            if (data) {
                console.log('Received settings:', data);
                setSettings({
                    ...data,
                    organization_id: orgId
                })
            }
        } catch (err) {
            console.error('Error fetching checkout settings:', err)
            setError('Failed to load checkout settings. Please try again later.')
        }
    }, [sidebarData?.organization_id])

    useEffect(() => {
        if (sidebarData?.organization_id) {
            fetchCheckoutSettings()
        }
    }, [sidebarData?.organization_id, fetchCheckoutSettings])

    const handleSettingsUpdate = async (updatedSettings: Partial<CheckoutSettings>) => {
        try {
            const orgId = sidebarData?.organization_id;
            if (!orgId || typeof orgId !== 'string') {
                throw new Error('Organization ID is required');
            }

            console.log('Updating settings:', updatedSettings);
            console.log('Current organization ID:', orgId);

            const { error } = await supabase
                .rpc('update_organization_checkout_settings', {
                    p_organization_id: orgId,
                    p_settings: updatedSettings
                })

            if (error) throw error

            setSettings(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    ...updatedSettings,
                    organization_id: orgId
                };
            });
        } catch (err) {
            console.error('Error updating checkout settings:', err)
            throw err
        }
    }

    return (
        <div style={{
            overflowY: 'auto',
            overflowX: 'hidden',
            maxHeight: '100vh',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
        }}>
            <style>{`
                div::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
            <ContentSection
                title="Checkout"
                desc="Configure options, fees, and notifications for your customers checkout experience."
            >
                {error ? (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                ) : (
                    <div className="space-y-4">
                        <Tabs
                            value={activeTab}
                            onValueChange={setActiveTab}
                            className="w-full"
                        >
                            <div className="space-y-4">
                                <TabsList className="rounded-none">
                                    <TabsTrigger value="payment" className="rounded-none">Payment</TabsTrigger>
                                    <TabsTrigger value="fees" className="rounded-none">Fees</TabsTrigger>
                                    <TabsTrigger value="notifications" className="rounded-none">Notifications</TabsTrigger>
                                </TabsList>

                                <TabsContent value="payment">
                                    <Card className="rounded-none">
                                        <CardContent className="p-4">
                                            <PaymentSettings
                                                settings={settings}
                                                onUpdate={handleSettingsUpdate}
                                            />
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="fees">
                                    <Card className="rounded-none">
                                        <CardContent className="p-4">
                                            <FeeSettings
                                                settings={settings}
                                                onUpdate={handleSettingsUpdate}
                                            />
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="notifications">
                                    <Card className="rounded-none">
                                        <CardContent className="p-4">
                                            <NotificationSettings />
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </div>
                        </Tabs>
                    </div>
                )}
            </ContentSection>
        </div>
    )
}

const CheckoutSettingsWithActivationCheck = withActivationCheck(CheckoutSettingsPage)
export default CheckoutSettingsWithActivationCheck