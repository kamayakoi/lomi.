import { useState } from 'react'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function PaymentSettings() {
    const [defaultLanguage, setDefaultLanguage] = useState('en')
    const [displayCurrency, setDisplayCurrency] = useState('USD')
    const [paymentLinkDuration, setPaymentLinkDuration] = useState(1)

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Payment Settings</h2>
            <div className="space-y-4">
                <div>
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
                <div>
                    <Label htmlFor="displayCurrency">Display Currency</Label>
                    <Select value={displayCurrency} onValueChange={setDisplayCurrency}>
                        <SelectTrigger id="displayCurrency">
                            <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="XOF">XOF</SelectItem>
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="EUR">EUR</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label htmlFor="paymentLinkDuration">Default Payment Link Duration (days)</Label>
                    <Input
                        id="paymentLinkDuration"
                        type="number"
                        value={paymentLinkDuration}
                        onChange={(e) => setPaymentLinkDuration(Number(e.target.value))}
                        min={1}
                    />
                </div>
            </div>
            <Button>Save Changes</Button>
        </div>
    )
}