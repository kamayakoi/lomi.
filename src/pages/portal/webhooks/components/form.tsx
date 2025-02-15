import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { toast } from "@/lib/hooks/use-toast"
import { webhook_event, webhookCategories } from './types'
import { createWebhook } from './support'

interface CreateWebhookFormProps {
    onClose: () => void
    onSuccess: () => void
}

export function CreateWebhookForm({ onClose, onSuccess }: CreateWebhookFormProps) {
    const [url, setUrl] = useState("")
    const [selectedEvents, setSelectedEvents] = useState<webhook_event[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Get all possible events
    const allEvents = webhookCategories.flatMap(category =>
        category.events.map(event => event.id)
    )

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
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
            await createWebhook({
                url,
                authorized_events: selectedEvents,
            })
            toast({
                title: "Success",
                description: "Webhook created successfully",
            })
            onSuccess()
            onClose()
        } catch (error) {
            console.error('Error creating webhook:', error)
            toast({
                title: "Error",
                description: "Failed to create webhook",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const toggleEvent = (event: webhook_event) => {
        setSelectedEvents(prev =>
            prev.includes(event)
                ? prev.filter(e => e !== event)
                : [...prev, event]
        )
    }

    const toggleAllEvents = () => {
        const allSelected = allEvents.every(event => selectedEvents.includes(event))
        if (allSelected) {
            setSelectedEvents([])
        } else {
            setSelectedEvents(allEvents)
        }
    }

    const allSelected = allEvents.every(event => selectedEvents.includes(event))

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="url">Webhook URL</Label>
                <Input
                    id="url"
                    placeholder="https://example.com/webhook"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                />
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between mb-2">
                    <Label>Events</Label>
                    <Button
                        type="button"
                        variant="outline"
                        className="rounded-none border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 focus:ring-blue-500"
                        size="sm"
                        onClick={toggleAllEvents}
                    >
                        {allSelected ? 'Deselect All' : 'Select All'}
                    </Button>
                </div>
                <Accordion type="single" collapsible className="w-full">
                    {webhookCategories.map((category, index) => (
                        <AccordionItem value={`item-${index}`} key={index} className="cursor-pointer">
                            <AccordionTrigger className="w-full text-sm font-medium hover:no-underline">
                                <div className="flex items-center justify-between w-full">
                                    <span>{category.name}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {category.events.filter(event => selectedEvents.includes(event.id)).length}
                                        {' / '}
                                        {category.events.length} selected
                                    </span>
                                </div>
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
            </div>

            <div className="flex justify-end space-x-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-none bg-blue-600 hover:bg-blue-700 w-full sm:w-auto text-white"
                >
                    {isSubmitting ? 'Creating...' : 'Create'}
                </Button>
            </div>
        </form>
    )
}
