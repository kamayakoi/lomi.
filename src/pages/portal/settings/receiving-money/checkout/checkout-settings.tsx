import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AppearanceSettings } from './appearance-settings'
import { PaymentSettings } from './payment-settings'
import { FeeSettings } from './fee-settings'
import { NotificationSettings } from './notification-settings'
import ContentSection from '@/components/dashboard/content-section'

export default function CheckoutSettings() {
    const [isAppearanceOpen, setIsAppearanceOpen] = useState(false)

    return (
        <div style={{
            overflowY: 'auto',
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
                title="Checkout Settings"
                desc="Configure the appearance, payment options, fees, and notifications for your checkout page."
            >
                <div className="space-y-2">
                    <div className="mb-2">
                    </div>
                    <Tabs defaultValue="payment">
                        <TabsList className="grid w-full grid-cols-3 mb-4">
                            <TabsTrigger value="payment">Payment</TabsTrigger>
                            <TabsTrigger value="fees">Fees</TabsTrigger>
                            <TabsTrigger value="notifications">Notifications</TabsTrigger>
                        </TabsList>
                        <TabsContent value="payment">
                            <PaymentSettings />
                        </TabsContent>
                        <TabsContent value="fees">
                            <FeeSettings />
                        </TabsContent>
                        <TabsContent value="notifications">
                            <NotificationSettings />
                        </TabsContent>
                    </Tabs>
                </div>
            </ContentSection>
            {isAppearanceOpen && (
                <div className="fixed inset-0 z-50">
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsAppearanceOpen(false)}></div>
                    <div className="absolute right-0 top-0 bottom-0 w-full max-w-2xl bg-background shadow-lg p-6 overflow-y-auto">
                        <AppearanceSettings onClose={() => setIsAppearanceOpen(false)} />
                    </div>
                </div>
            )}
        </div>
    )
}
