import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PaymentSettings } from './payment-settings'
import { FeeSettings } from './fee-settings'
import { NotificationSettings } from './notification-settings'
import ContentSection from '@/components/dashboard/content-section'
import { ScrollArea } from "@/components/ui/scroll-area"

export default function CheckoutSettings() {
    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-6">
            <ContentSection
                title="Checkout"
                desc="Configure the appearance, payment options, fees, and notifications for your customers checkout experience."
            >
                <Tabs defaultValue="payment" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 lg:w-[400px] mb-6">
                        <TabsTrigger value="payment">Payment</TabsTrigger>
                        <TabsTrigger value="fees">Fees</TabsTrigger>
                        <TabsTrigger value="notifications">Notifications</TabsTrigger>
                    </TabsList>
                    <ScrollArea className="h-[calc(100vh-16rem)]" style={{ overflowX: 'hidden' }}>
                        <TabsContent value="payment">
                            <PaymentSettings />
                        </TabsContent>
                        <TabsContent value="fees">
                            <FeeSettings />
                        </TabsContent>
                        <TabsContent value="notifications">
                            <NotificationSettings />
                        </TabsContent>
                    </ScrollArea>
                </Tabs>
            </ContentSection>
        </div>
    )
}