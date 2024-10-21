import { useState } from 'react'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Info } from 'lucide-react'

export function PaymentSettings() {
    const [defaultLanguage, setDefaultLanguage] = useState('en')
    const [displayCurrency, setDisplayCurrency] = useState('XOF')
    const [paymentLinkDuration, setPaymentLinkDuration] = useState(1)

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
                    <Button className="ml-auto">Save Changes</Button>
                </CardFooter>
            </Card>
        </ScrollArea>
    )
}