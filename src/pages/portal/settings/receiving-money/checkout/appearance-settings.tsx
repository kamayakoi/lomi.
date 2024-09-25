import React, { useState } from 'react'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { X } from "lucide-react"

interface AppearanceSettingsProps {
    onClose: () => void;
}

export function AppearanceSettings({ onClose }: AppearanceSettingsProps) {
    const [primaryColor, setPrimaryColor] = useState('#000000')
    const [logo, setLogo] = useState('')
    const [buttonText, setButtonText] = useState('Pay Now')
    const [showPaymentLinkExpiry, setShowPaymentLinkExpiry] = useState(false)

    const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setLogo(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const CheckoutPreview = ({ isMobile = false }) => (
        <Card className={isMobile ? "w-64 mx-auto" : "w-full"}>
            <CardContent className="p-4">
                {logo && <img src={logo} alt="Logo" className="h-8 mb-4" />}
                <div className="space-y-4">
                    <div className="bg-gray-200 h-8 w-full rounded"></div>
                    <div className="bg-gray-200 h-8 w-full rounded"></div>
                    <Button className="w-full" style={{ backgroundColor: primaryColor, color: 'white' }}>
                        {buttonText}
                    </Button>
                    {showPaymentLinkExpiry && (
                        <div className="text-sm text-gray-500">This payment link will expire in 24 hours</div>
                    )}
                </div>
            </CardContent>
        </Card>
    )

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Customize Appearance</h2>
                <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="h-4 w-4" />
                </Button>
            </div>
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="primaryColor">Primary Color</Label>
                        <Input
                            id="primaryColor"
                            type="color"
                            value={primaryColor}
                            onChange={(e) => setPrimaryColor(e.target.value)}
                        />
                    </div>
                    <div>
                        <Label htmlFor="logo">Logo</Label>
                        <Input id="logo" type="file" onChange={handleLogoUpload} accept="image/*" />
                    </div>
                    <div>
                        <Label htmlFor="buttonText">Button Text</Label>
                        <Input
                            id="buttonText"
                            value={buttonText}
                            onChange={(e) => setButtonText(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="showPaymentLinkExpiry"
                            checked={showPaymentLinkExpiry}
                            onCheckedChange={setShowPaymentLinkExpiry}
                        />
                        <Label htmlFor="showPaymentLinkExpiry">Show Payment Link Expiry</Label>
                    </div>
                </div>
                <div>
                    <Tabs defaultValue="desktop">
                        <TabsList>
                            <TabsTrigger value="desktop">Desktop</TabsTrigger>
                            <TabsTrigger value="mobile">Mobile</TabsTrigger>
                        </TabsList>
                        <TabsContent value="desktop">
                            <CheckoutPreview />
                        </TabsContent>
                        <TabsContent value="mobile">
                            <CheckoutPreview isMobile />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
            <div className="flex justify-end space-x-4">
                <Button variant="outline" onClick={onClose}>Cancel</Button>
                <Button onClick={onClose}>Save Changes</Button>
            </div>
        </div>
    )
}

export default AppearanceSettings