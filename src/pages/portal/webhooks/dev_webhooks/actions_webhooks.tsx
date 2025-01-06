import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Webhook, webhookCategories } from './types'
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

type WebhookViewProps = {
  webhook: Webhook | null
  isOpen: boolean
  onClose: () => void
}

function getEventCategoryColor(eventId: string): string {
  for (const category of webhookCategories) {
    if (category.events.some(e => e.id === eventId)) {
      switch (category.name) {
        case 'PAYMENTS':
          return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
        case 'SUBSCRIPTIONS':
          return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
        case 'PAYMENT SESSIONS':
          return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300';
        case 'PAYOUTS':
          return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
        case 'INVOICES':
          return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300';
        default:
          return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      }
    }
  }
  return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
}

export default function WebhookView({ webhook, isOpen, onClose }: WebhookViewProps) {
  if (!webhook) return null

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-2xl w-full p-0 overflow-y-auto rounded-none">
        <Card className="border-0 shadow-none rounded-none h-full">
          <CardHeader className="sticky top-0 z-10 bg-background border-b px-4 py-3 flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-medium">Webhook details</CardTitle>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground md:hidden">
              <X className="h-4 w-4" />
            </button>
          </CardHeader>
          <CardContent className="p-4 space-y-4 overflow-auto">
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className={`
                  inline-flex px-2 py-1 rounded-none text-xs font-normal
                  ${webhook.is_active
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                  }`}
                >
                  {webhook.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div>
                <span className="text-muted-foreground text-xs">Endpoint URL</span>
                <code className="mt-1 block break-all bg-gray-50 dark:bg-gray-900 p-2 text-xs rounded-none">
                  {webhook.url || '-'}
                </code>
              </div>

              <div>
                <span className="text-muted-foreground text-xs">Events</span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {webhook.authorized_events.map((event) => (
                    <Badge
                      key={event}
                      variant="secondary"
                      className={`rounded-none px-2 py-0.5 text-xs font-normal ${getEventCategoryColor(event)}`}
                    >
                      {event}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Last Triggered</span>
                <span>{formatDate(webhook.last_triggered_at)}</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Retry Count</span>
                <span>{webhook.retry_count || '0'}</span>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Last Payload</h3>
              <div className="overflow-x-auto">
                <pre className="text-xs p-2 bg-gray-50 dark:bg-gray-900 rounded-none whitespace-pre-wrap">
                  {JSON.stringify(webhook.last_payload, null, 2) || '{}'}
                </pre>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Last Response</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Status</span>
                  <span>{webhook.last_response_status || '-'}</span>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs">Response Body</span>
                  <div className="mt-1 bg-gray-50 dark:bg-gray-900 p-2 rounded-none">
                    <p className="text-xs break-all">
                      {webhook.last_response_body || '-'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
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