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
import { supabase } from '@/utils/supabase/client'

interface PaymentSettingsProps {
    settings: CheckoutSettings | null;
    onUpdate: (settings: Partial<CheckoutSettings>) => Promise<void>;
}

export function PaymentSettings({ settings, onUpdate }: PaymentSettingsProps) {
    const [defaultLanguage, setDefaultLanguage] = useState(settings?.default_language || 'en')
    const [displayCurrency, setDisplayCurrency] = useState(settings?.display_currency || 'XOF')
    const [paymentLinkDuration, setPaymentLinkDuration] = useState(settings?.payment_link_duration || 1)
    const [isSaving, setIsSaving] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                if (!settings?.organization_id) return

                setIsLoading(true)
                const { data, error } = await supabase
                    .rpc('fetch_organization_checkout_settings', {
                        p_organization_id: settings.organization_id
                    })

                if (error) throw error

                if (data && data[0]) {
                    setDefaultLanguage(data[0].default_language)
                    setDisplayCurrency(data[0].display_currency)
                    setPaymentLinkDuration(data[0].payment_link_duration)
                }
            } catch (error) {
                console.error('Error fetching payment settings:', error)
                toast({
                    title: "Error",
                    description: "Failed to load payment settings",
                    variant: "destructive",
                })
            } finally {
                setIsLoading(false)
            }
        }

        fetchSettings()
    }, [settings?.organization_id])

    const handleSave = async () => {
        if (!settings?.organization_id) {
            toast({
                title: "Error",
                description: "Organization ID is required",
                variant: "destructive",
            })
            return
        }

        setIsSaving(true)
        try {
            const { error } = await supabase.rpc('update_organization_checkout_settings', {
                p_organization_id: settings.organization_id,
                p_settings: {
                    default_language: defaultLanguage,
                    display_currency: displayCurrency,
                    payment_link_duration: paymentLinkDuration
                }
            })

            if (error) throw error

            await onUpdate({
                organization_id: settings.organization_id,
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
                description: error instanceof Error ? error.message : "Failed to update payment settings",
                variant: "destructive",
            })
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[200px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <ScrollArea className="h-[calc(100vh-12rem)] pr-4">
            <Card>
                <CardHeader>
                    <CardTitle>Payment settings</CardTitle>
                    <CardDescription>Configure your default payment preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="defaultLanguage">Default Language</Label>
                            <Select value={defaultLanguage} onValueChange={setDefaultLanguage}>
                                <SelectTrigger id="defaultLanguage" className="rounded-none">
                                    <SelectValue placeholder="Select language" />
                                </SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="en">English</SelectItem>
                                    <SelectItem value="fr">French</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="displayCurrency">Display Currency</Label>
                            <Select value={displayCurrency} onValueChange={setDisplayCurrency}>
                                <SelectTrigger id="displayCurrency" className="rounded-none">
                                    <SelectValue placeholder="Select currency" />
                                </SelectTrigger>
                                <SelectContent className="rounded-none">
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
                            value={paymentLinkDuration || ''}
                            onChange={(e) => {
                                const value = e.target.value === '' ? '' : parseInt(e.target.value);
                                if (value === '') {
                                    setPaymentLinkDuration(0);
                                } else if (!isNaN(value)) {
                                    if (value > 30) setPaymentLinkDuration(30);
                                    else if (value < 1) setPaymentLinkDuration(1);
                                    else setPaymentLinkDuration(value);
                                }
                            }}
                            onBlur={(e) => {
                                const value = parseInt(e.target.value);
                                if (isNaN(value) || value < 1) {
                                    setPaymentLinkDuration(1);
                                }
                            }}
                            className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            placeholder="Enter days (1-30)"
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button
                        onClick={handleSave}
                        className="ml-auto rounded-none"
                        disabled={isSaving}
                    >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </CardFooter>
            </Card>
        </ScrollArea>
    )
}