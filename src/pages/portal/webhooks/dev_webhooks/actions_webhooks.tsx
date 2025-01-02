import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Webhook } from './types'
import { Separator } from "@/components/ui/separator"
import { useState, useEffect } from 'react'
import { fetchWebhookDetails, deleteWebhook } from './support_webhooks'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type WebhookActionsProps = {
    webhook: Webhook | null
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

export default function WebhookActions({ webhook, isOpen, onClose, onSuccess }: WebhookActionsProps) {
    const [webhookDetails, setWebhookDetails] = useState<Webhook | null>(null)
    const [showDeleteAlert, setShowDeleteAlert] = useState(false)

    useEffect(() => {
        if (webhook?.webhook_id) {
            fetchWebhookDetails(webhook.webhook_id).then((data) => {
                setWebhookDetails(data)
            })
        }
    }, [webhook])

    if (!webhookDetails) return null

    const handleDelete = async () => {
        if (webhookDetails?.webhook_id) {
            await deleteWebhook(webhookDetails.webhook_id)
            onSuccess()
            onClose()
        }
    }

    return (
        <>
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent className="sm:max-w-2xl overflow-y-auto rounded-none">
                    <Card className="border-0 shadow-none rounded-none">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-2xl font-bold">Webhook Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4">
                                <section>
                                    <h3 className="text-lg font-semibold mb-2">Webhook Information</h3>
                                    <div className="grid grid-cols-2 gap-2 text-sm border rounded-none p-4">
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
                        <CardFooter className="flex justify-end">
                            <Button
                                variant="destructive"
                                className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white rounded-none"
                                onClick={() => setShowDeleteAlert(true)}
                            >
                                Delete Webhook
                            </Button>
                        </CardFooter>
                    </Card>
                </SheetContent>
            </Sheet>

            <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
                <AlertDialogContent className="rounded-none">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to delete this webhook?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the webhook
                            and all its associated data.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-none">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-500 hover:bg-red-600 rounded-none"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

function formatDate(dateString: string | null): string {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}
