import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Webhook } from './types'
import { Separator } from "@/components/ui/separator"
import { ArrowDownToLine } from 'lucide-react'
import { useState, useEffect } from 'react'
import { fetchWebhookDetails, deleteWebhook } from './support_webhooks'

type WebhookActionsProps = {
    webhook: Webhook | null
    isOpen: boolean
    onClose: () => void
}

export default function WebhookActions({ webhook, isOpen, onClose }: WebhookActionsProps) {
    const [webhookDetails, setWebhookDetails] = useState<Webhook | null>(null)

    useEffect(() => {
        if (webhook?.webhook_id) {
            console.log('Selected webhook:', webhook)
            fetchWebhookDetails(webhook.webhook_id).then((data) => {
                console.log('Fetched webhook details:', data)
                setWebhookDetails(data)
            })
        }
    }, [webhook])

    if (!webhookDetails) return null

    const handleDelete = async () => {
        if (webhookDetails?.webhook_id) {
            await deleteWebhook(webhookDetails.webhook_id)
            onClose()
            // Refresh the webhooks list
        }
    }

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="sm:max-w-2xl overflow-y-auto">
                <Card className="border-0 shadow-none">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-2xl font-bold">Webhook Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4">
                            <section>
                                <h3 className="text-lg font-semibold mb-2">Webhook Information</h3>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div className="font-medium">URL:</div>
                                    <div>{webhookDetails.url || '-'}</div>
                                    <div className="font-medium">Event:</div>
                                    <div>{webhookDetails.event || '-'}</div>
                                    <div className="font-medium">Status:</div>
                                    <div>{webhookDetails.is_active ? 'Active' : 'Inactive'}</div>
                                    <div className="font-medium">Last Triggered:</div>
                                    <div>{formatDate(webhookDetails.last_triggered_at) || '-'}</div>
                                    <div className="font-medium">Retry Count:</div>
                                    <div>{webhookDetails.retry_count || '0'}</div>
                                </div>
                            </section>
                            <Separator />
                            <section>
                                <h3 className="text-lg font-semibold mb-2">Last Payload</h3>
                                <pre className="text-sm overflow-x-auto">
                                    {JSON.stringify(webhookDetails.last_payload, null, 2) || '{}'}
                                </pre>
                            </section>
                            <Separator />
                            <section>
                                <h3 className="text-lg font-semibold mb-2">Last Response</h3>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div className="font-medium">Status:</div>
                                    <div>{webhookDetails.last_response_status || '-'}</div>
                                    <div className="font-medium">Body:</div>
                                    <div>{webhookDetails.last_response_body || '-'}</div>
                                </div>
                            </section>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col sm:flex-row justify-between gap-2">
                        <Button variant="outline" className="w-full sm:w-auto">
                            <ArrowDownToLine className="mr-2 h-4 w-4" />
                            Download Details
                        </Button>
                        <Button variant="destructive" className="w-full sm:w-auto" onClick={handleDelete}>
                            Delete Webhook
                        </Button>
                    </CardFooter>
                </Card>
            </SheetContent>
        </Sheet>
    )
}

function formatDate(dateString: string | null): string {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}
