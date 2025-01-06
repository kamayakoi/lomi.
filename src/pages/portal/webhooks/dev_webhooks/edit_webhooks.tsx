import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { Webhook, webhook_event, webhookCategories } from './types'
import { updateWebhook, deleteWebhook, testWebhook } from './support_webhooks'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface WebhookActionsProps {
    webhook: Webhook | null
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

export default function WebhookActions({ webhook, isOpen, onClose, onSuccess }: WebhookActionsProps) {
    const [url, setUrl] = useState(webhook?.url || "")
    const [selectedEvents, setSelectedEvents] = useState<webhook_event[]>(webhook?.authorized_events || [])
    const [isActive, setIsActive] = useState(webhook?.is_active || false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Reset form when webhook changes
    useEffect(() => {
        if (webhook) {
            setUrl(webhook.url)
            setSelectedEvents(webhook.authorized_events)
            setIsActive(webhook.is_active)
        }
    }, [webhook])

    const handleSave = async () => {
        if (!webhook) return
        if (!url) {
            toast({
                title: "Error",
                description: "Please enter a webhook URL",
                variant: "destructive",
            })
            return
        }
        if (selectedEvents.length === 0) {
            toast({
                title: "Error",
                description: "Please select at least one event",
                variant: "destructive",
            })
            return
        }

        setIsSubmitting(true)
        try {
            await updateWebhook(webhook.webhook_id, {
                url,
                authorized_events: selectedEvents,
                is_active: isActive,
            })
            toast({
                title: "Success",
                description: "Webhook updated successfully",
            })
            onSuccess()
            onClose()
        } catch (error) {
            console.error('Error updating webhook:', error)
            toast({
                title: "Error",
                description: "Failed to update webhook",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async () => {
        if (!webhook) return
        setIsSubmitting(true)
        try {
            await deleteWebhook(webhook.webhook_id)
            setShowDeleteDialog(false)
            onSuccess()
            onClose()
            toast({
                title: "Success",
                description: "Webhook deleted successfully",
            })
        } catch (error) {
            console.error('Error deleting webhook:', error)
            toast({
                title: "Error",
                description: "Failed to delete webhook",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleTest = async () => {
        if (!webhook) return
        try {
            await testWebhook(webhook.webhook_id)
            toast({
                title: "Success",
                description: "Test webhook sent successfully",
            })
        } catch (error) {
            console.error('Error testing webhook:', error)
            toast({
                title: "Error",
                description: "Failed to send test webhook",
                variant: "destructive",
            })
        }
    }

    const toggleEvent = (event: webhook_event) => {
        setSelectedEvents(prev =>
            prev.includes(event)
                ? prev.filter(e => e !== event)
                : [...prev, event]
        )
    }

    if (!webhook) return null

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-[600px] p-0 rounded-none overflow-hidden">
                    <DialogHeader className="p-6 pb-0">
                        <DialogTitle>Webhook details</DialogTitle>
                    </DialogHeader>
                    <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-hide">
                        <Card className="rounded-none border-none shadow-none">
                            <CardHeader className="p-0">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-base font-medium">URL</CardTitle>
                                        <CardDescription>The endpoint that will receive webhook events</CardDescription>
                                    </div>
                                    <Button
                                        type="button"
                                        variant={isActive ? 'outline' : 'outline'}
                                        onClick={() => setIsActive(!isActive)}
                                        className={`rounded-none h-8 px-3 text-xs ${isActive
                                            ? 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 border-green-200'
                                            : 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 border-red-200'
                                            }`}
                                    >
                                        {isActive ? 'Active' : 'Inactive'}
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0 pt-4">
                                <Input
                                    id="url"
                                    placeholder="https://example.com/webhook"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    className="rounded-none"
                                />
                            </CardContent>
                        </Card>

                        <Separator />

                        <Card className="rounded-none border-none shadow-none">
                            <CardHeader className="p-0">
                                <CardTitle className="text-base font-medium">Events</CardTitle>
                                <CardDescription>Select the events you want to receive</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0 pt-4">
                                <Accordion type="single" collapsible className="w-full">
                                    {webhookCategories.map((category, index) => (
                                        <AccordionItem value={`item-${index}`} key={index}>
                                            <AccordionTrigger className="text-sm font-medium">
                                                {category.name}
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <div className="space-y-2">
                                                    {category.events.map((event) => (
                                                        <div key={event.id} className="flex items-center space-x-2">
                                                            <Checkbox
                                                                id={event.id}
                                                                checked={selectedEvents.includes(event.id)}
                                                                onCheckedChange={() => toggleEvent(event.id)}
                                                            />
                                                            <Label
                                                                htmlFor={event.id}
                                                                className="text-sm font-normal cursor-pointer"
                                                            >
                                                                {event.label}
                                                            </Label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </CardContent>
                        </Card>

                        <div className="flex flex-col sm:flex-row sm:justify-between space-y-4 sm:space-y-0 pt-6">
                            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowDeleteDialog(true)}
                                    className="rounded-none text-red-600 hover:text-red-700 w-full sm:w-auto"
                                >
                                    Delete
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleTest}
                                    className="rounded-none w-full sm:w-auto"
                                >
                                    Send test
                                </Button>
                            </div>
                            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onClose}
                                    className="rounded-none w-full sm:w-auto"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="button"
                                    onClick={handleSave}
                                    disabled={isSubmitting}
                                    className="rounded-none bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                                >
                                    {isSubmitting ? 'Saving...' : 'Save'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent className="rounded-none">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete webhook</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this webhook? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                        <AlertDialogCancel className="rounded-none w-full sm:w-auto mt-0">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={isSubmitting}
                            className="rounded-none bg-red-600 hover:bg-red-700 w-full sm:w-auto"
                        >
                            {isSubmitting ? 'Deleting...' : 'Delete webhook'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
