import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AppearanceSettings } from './appearance-settings'
import { PaymentSettings } from './payment-settings'
import { FeeSettings } from './fee-settings'
import { CustomerDetailsSettings } from './customer-details-settings'
import { NotificationSettings } from './notification-settings'

export default function CheckoutSettings() {
    const [isAppearanceOpen, setIsAppearanceOpen] = useState(false)

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Checkout Settings</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Customize Your Checkout Experience</CardTitle>
                    <CardDescription>
                        Configure the appearance, payment options, fees, and notifications for your checkout page.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="mb-6">
                        <Card className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold">Customize Appearance</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Customize the default appearance of your checkout page.
                                    </p>
                                </div>
                                <Button onClick={() => setIsAppearanceOpen(true)}>Customize Appearance</Button>
                            </div>
                            <div className="bg-muted p-4 rounded-lg">
                                <img src="/placeholder.svg?height=200&width=400" alt="Checkout Preview" className="w-full h-auto" />
                            </div>
                        </Card>
                    </div>
                    <Tabs defaultValue="payment">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="payment">Payment</TabsTrigger>
                            <TabsTrigger value="fees">Fees</TabsTrigger>
                            <TabsTrigger value="customerDetails">Customer Details</TabsTrigger>
                            <TabsTrigger value="notifications">Notifications</TabsTrigger>
                        </TabsList>
                        <TabsContent value="payment">
                            <PaymentSettings />
                        </TabsContent>
                        <TabsContent value="fees">
                            <FeeSettings />
                        </TabsContent>
                        <TabsContent value="customerDetails">
                            <CustomerDetailsSettings />
                        </TabsContent>
                        <TabsContent value="notifications">
                            <NotificationSettings />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
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