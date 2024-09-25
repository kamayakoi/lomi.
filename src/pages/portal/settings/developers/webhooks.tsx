import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Label } from "@/components/ui/label"
import { AlertCircle, ChevronDown, ChevronUp, Lock } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface WebhookCategory {
    name: string;
    events: string[];
}

const webhookCategories: WebhookCategory[] = [
    {
        name: "FIXED VIRTUAL ACCOUNTS",
        events: ["FVA paid", "FVA created"]
    },
    {
        name: "DISBURSEMENT",
        events: ["Batch disbursement sent", "Payouts v2"]
    },
    {
        name: "PAYOUT",
        events: ["Payout Links v2"]
    },
    {
        name: "REPORT",
        events: ["Balance and Transactions report"]
    },
    {
        name: "PAYMENT REQUESTS V2",
        events: [
            "Payment Succeeded",
            "Payment Awaiting Capture",
            "Payment Pending",
            "Payment Failed",
            "Captured Succeeded",
            "Captured Failed"
        ]
    },
    {
        name: "UNIFIED REFUNDS (BETA)",
        events: [
            "Refund request succeeded",
            "Refund request failed"
        ]
    },
    {
        name: "PAYMENT METHODS V2",
        events: ["Payment method"]
    },
    {
        name: "PAYMENT REQUESTS V3",
        events: [
            "Payment Status",
            "Payment Request Status"
        ]
    },
    {
        name: "PAYMENT TOKENS V1",
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
    {
        name: "NOTIFICATIONS",
        events: [
            "Account created",
            "Account updated",
            "Account suspension"
        ]
    }
]

const examplePayload = `{
  "updated": "2017-02-15T11:01:52.896Z",
  "created": "2017-02-15T11:01:52.896Z",
  "payment_id": "1487156512722",
  "callback_virtual_account_id": "58a434ba39cc9e4a230d5a2b",
  "owner_id": "5824128aa6f9f9b648be9d76",
  "external_id": "fixed-va-1487156410",
  "account_number": "1001470126",
  "bank_code": "MANDIRI",
  "amount": 80000,
  "transaction_timestamp": "2017-02-15T11:01:52.722Z",
  "merchant_code": "88464",
  "id": "58a435201b6ce2a355f46070"
}`

interface WebhookUrls {
    [category: string]: {
        [event: string]: string;
    };
}

interface ExpandedWebhooks {
    [category: string]: {
        [event: string]: boolean;
    };
}

export default function Webhooks() {
    const [autoRetry, setAutoRetry] = useState(false)
    const [webhookUrls, setWebhookUrls] = useState<WebhookUrls>({})
    const [expandedWebhooks, setExpandedWebhooks] = useState<ExpandedWebhooks>({})
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

    const toggleWebhookExpansion = (category: string, event: string) => {
        setExpandedWebhooks(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [event]: !prev[category]?.[event]
            }
        }))
    }

    const handleVerificationTokenView = () => {
        // Implement the logic to verify the password and show the token
        console.log("Verifying password and showing token")
        setShowVerificationTokenModal(false)
        setVerificationTokenPassword("")
    }

    return (
        <div className="container mx-auto p-6 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Webhooks</CardTitle>
                    <CardDescription>
                        Configure your webhook settings to receive real-time updates for various events.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Important</AlertTitle>
                        <AlertDescription>
                            To learn how to add and manage your webhooks, visit our <a href="#" className="underline">documentation page</a>.
                        </AlertDescription>
                    </Alert>

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
                        <Button onClick={() => setShowVerificationTokenModal(true)} className="w-full">
                            <Lock className="h-4 w-4 mr-2" />
                            View Webhook Verification Token
                        </Button>
                        <p className="text-sm text-muted-foreground">
                            Sent with every webhook, use this token to validate that a webhook came from our servers
                        </p>
                    </div>

                    <Accordion type="single" collapsible className="w-full">
                        {webhookCategories.map((category, index) => (
                            <AccordionItem value={`item-${index}`} key={index}>
                                <AccordionTrigger>{category.name}</AccordionTrigger>
                                <AccordionContent>
                                    {category.events.map((event, eventIndex) => (
                                        <div key={eventIndex} className="mb-4 last:mb-0">
                                            <Label htmlFor={`${category.name}-${event}`}>{event}</Label>
                                            <div className="flex space-x-2 mt-1">
                                                <Input
                                                    id={`${category.name}-${event}`}
                                                    placeholder="https://example.com"
                                                    value={webhookUrls[category.name]?.[event] || ""}
                                                    onChange={(e) => handleUrlChange(category.name, event, e.target.value)}
                                                    className="flex-grow"
                                                />
                                                <Button onClick={() => handleTestAndSave(category.name, event)}>
                                                    Test and save
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => toggleWebhookExpansion(category.name, event)}
                                                >
                                                    {expandedWebhooks[category.name]?.[event] ? (
                                                        <ChevronUp className="h-4 w-4" />
                                                    ) : (
                                                        <ChevronDown className="h-4 w-4" />
                                                    )}
                                                </Button>
                                            </div>
                                            {expandedWebhooks[category.name]?.[event] && (
                                                <div className="mt-2 p-2 bg-muted rounded-md">
                                                    <p className="text-sm font-medium mb-1">Example webhook payload:</p>
                                                    <pre className="text-xs overflow-x-auto">{examplePayload}</pre>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </CardContent>
            </Card>

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
    )
}