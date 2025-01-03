import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Label } from "@/components/ui/label"
import { AlertCircle, Lock } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import ContentSection from '@/components/dashboard/content-section'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface WebhookCategory {
    name: string;
    events: string[];
}

const webhookCategories: WebhookCategory[] = [
    {
        name: "PAYOUT",
        events: ["Payout Links"]
    },
    {
        name: "PAYMENT REQUESTS",
        events: [
            "Payment Succeeded",
            "Payment Pending",
            "Payment Failed",
        ]
    },
    {
        name: "PAYMENT TOKENS",
        events: ["Payment Token Status"]
    },
    {
        name: "RECURRING",
        events: ["Recurring"]
    },
    {
        name: "PAYMENT SESSION",
        events: [
            "Payment Session Completed",
            "Payment Session Expired"
        ]
    },
    {
        name: "INVOICES",
        events: ["Invoice paid"]
    },
]

interface WebhookUrls {
    [category: string]: {
        [event: string]: string;
    };
}

export default function Webhooks() {
    const [autoRetry, setAutoRetry] = useState(false)
    const [webhookUrls, setWebhookUrls] = useState<WebhookUrls>({})
    const [showVerificationTokenModal, setShowVerificationTokenModal] = useState(false)
    const [verificationTokenPassword, setVerificationTokenPassword] = useState("")

    const handleUrlChange = (category: string, event: string, url: string) => {
        setWebhookUrls(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [event]: url
            }
        }))
    }

    const handleTestAndSave = (category: string, event: string) => {
        console.log(`Testing and saving webhook for ${category} - ${event}`)
        // Implement the actual test and save logic here
    }

    const handleVerificationTokenView = () => {
        // Implement the logic to verify the password and show the token
        console.log("Verifying password and showing token")
        setShowVerificationTokenModal(false)
        setVerificationTokenPassword("")
    }

    return (
        <ContentSection
            title="Webhooks"
            desc="Configure your webhook settings to receive real-time updates for various events."
        >
            {/* Wrap everything in a single div */}
            <div>
                <div className="space-y-6">
                    <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Important</AlertTitle>
                        <AlertDescription>
                            To learn how to add and manage your webhooks, visit our <a href="#" className="underline font-medium hover:text-primary">documentation page</a>.
                        </AlertDescription>
                    </Alert>

                    <Card>
                        <CardHeader>
                            <CardTitle>General settings</CardTitle>
                            <CardDescription>Configure global webhook settings</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="auto-retry"
                                    checked={autoRetry}
                                    onCheckedChange={setAutoRetry}
                                />
                                <Label htmlFor="auto-retry">Enable auto-retry for failed webhooks</Label>
                            </div>

                            <div className="space-y-2">
                                <Label>Webhook verification token</Label>
                                <Button onClick={() => setShowVerificationTokenModal(true)} variant="outline" className="w-full">
                                    <Lock className="h-4 w-4 mr-2" />
                                    View Webhook Verification Token
                                </Button>
                                <p className="text-sm text-muted-foreground">
                                    Sent with every webhook, use this token to validate that a webhook came from our servers
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Webhook Endpoints</CardTitle>
                            <CardDescription>Configure endpoints for different event categories</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Accordion type="single" collapsible className="w-full">
                                {webhookCategories.map((category, index) => (
                                    <AccordionItem value={`item-${index}`} key={index}>
                                        <AccordionTrigger className="hover:no-underline">
                                            {category.name}
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <div className="space-y-4">
                                                {category.events.map((event, eventIndex) => (
                                                    <div key={eventIndex} className="space-y-2">
                                                        <Label htmlFor={`${category.name}-${event}`}>{event}</Label>
                                                        <div className="flex space-x-2">
                                                            <Input
                                                                id={`${category.name}-${event}`}
                                                                placeholder="https://example.com"
                                                                value={webhookUrls[category.name]?.[event] || ""}
                                                                onChange={(e) => handleUrlChange(category.name, event, e.target.value)}
                                                                className="flex-grow"
                                                            />
                                                            <Button onClick={() => handleTestAndSave(category.name, event)} variant="secondary">
                                                                Test and save
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </CardContent>
                    </Card>
                </div>

                <Dialog open={showVerificationTokenModal} onOpenChange={setShowVerificationTokenModal}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>View Webhook Verification Token</DialogTitle>
                            <DialogDescription>
                                Enter your account password to view your webhook verification token
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="password" className="text-right">
                                    Password
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={verificationTokenPassword}
                                    onChange={(e) => setVerificationTokenPassword(e.target.value)}
                                    className="col-span-3"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleVerificationTokenView}>Confirm</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </ContentSection>
    )
}
