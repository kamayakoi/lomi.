import { useState, useEffect } from 'react'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Info } from 'lucide-react'
import { toast } from "@/components/ui/use-toast"
import { type CheckoutSettings } from '@/lib/types/checkoutsettings'

interface PaymentSettingsProps {
    settings: CheckoutSettings | null;
    onUpdate: (settings: Partial<CheckoutSettings>) => Promise<void>;
}

export function PaymentSettings({ settings, onUpdate }: PaymentSettingsProps) {
    const [defaultLanguage, setDefaultLanguage] = useState(settings?.default_language || 'en')
    const [displayCurrency, setDisplayCurrency] = useState(settings?.display_currency || 'XOF')
    const [paymentLinkDuration, setPaymentLinkDuration] = useState(settings?.payment_link_duration || 1)
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        if (settings) {
            setDefaultLanguage(settings.default_language)
            setDisplayCurrency(settings.display_currency)
            setPaymentLinkDuration(settings.payment_link_duration)
        }
    }, [settings])

    const handleSave = async () => {
        try {
            setIsSaving(true)
            await onUpdate({
                default_language: defaultLanguage,
                display_currency: displayCurrency,
                payment_link_duration: paymentLinkDuration
            })
            toast({
                title: "Success",
                description: "Payment settings updated successfully",
            })
        } catch (error) {
            console.error('Error saving payment settings:', error)
            toast({
                title: "Error",
                description: "Failed to update payment settings",
                variant: "destructive",
            })
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <ScrollArea className="h-[calc(100vh-12rem)] pr-4">
            <Card>
                <CardHeader>
                    <CardTitle>Payment Settings</CardTitle>
                    <CardDescription>Configure your default payment preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="defaultLanguage">Default Language</Label>
                            <Select value={defaultLanguage} onValueChange={setDefaultLanguage}>
                                <SelectTrigger id="defaultLanguage">
                                    <SelectValue placeholder="Select language" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="en">English</SelectItem>
                                    <SelectItem value="fr">French</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="displayCurrency">Display Currency</Label>
                            <Select value={displayCurrency} onValueChange={setDisplayCurrency}>
                                <SelectTrigger id="displayCurrency">
                                    <SelectValue placeholder="Select currency" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="XOF">XOF</SelectItem>
                                    <SelectItem value="USD" disabled>USD (Coming soon)</SelectItem>
                                    <SelectItem value="EUR" disabled>EUR (Coming soon)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                            <Label htmlFor="paymentLinkDuration">Default Payment Link Duration (days)</Label>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Info className="h-4 w-4 text-muted-foreground" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Set how long payment links remain active by default</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <Input
                            id="paymentLinkDuration"
                            type="number"
                            value={paymentLinkDuration}
                            onChange={(e) => setPaymentLinkDuration(Number(e.target.value))}
                            min={1}
                            max={30}
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button
                        onClick={handleSave}
                        className="ml-auto"
                        disabled={isSaving}
                    >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </CardFooter>
            </Card>
        </ScrollArea>
    )
}