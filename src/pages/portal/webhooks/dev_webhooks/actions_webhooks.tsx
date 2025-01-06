import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Webhook, webhookCategories } from './types'
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

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
      <SheetContent className="sm:max-w-2xl overflow-y-auto rounded-none">
        <Card className="border-0 shadow-none rounded-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold">Webhook Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <section>
                <div className="grid gap-4 text-sm border rounded-none p-4">
                  <div>{webhook.url || '-'}</div>
                  <div className="flex flex-wrap gap-1.5">
                    {webhook.authorized_events.map((event) => (
                      <Badge
                        key={event}
                        variant="secondary"
                        className={`rounded-none px-2 py-1 text-xs font-normal ${getEventCategoryColor(event)}`}
                      >
                        {event}
                      </Badge>
                    ))}
                  </div>
                  <div className={`inline-flex px-2 py-1 rounded-none text-xs font-normal w-fit ${webhook.is_active
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                    }`}>
                    {webhook.is_active ? 'Active' : 'Inactive'}
                  </div>
                  <div className="text-gray-500">Last triggered: {formatDate(webhook.last_triggered_at) || '-'}</div>
                  <div className="text-gray-500">Retry count: {webhook.retry_count || '0'}</div>
                </div>
              </section>
              <Separator />
              <section>
                <h3 className="text-lg font-semibold mb-2">Last Payload</h3>
                <pre className="text-sm overflow-x-auto p-4 bg-gray-50 dark:bg-gray-900 rounded-none">
                  {JSON.stringify(webhook.last_payload, null, 2) || '{}'}
                </pre>
              </section>
              <Separator />
              <section>
                <h3 className="text-lg font-semibold mb-2">Last Response</h3>
                <div className="grid gap-2 text-sm">
                  <div className="text-gray-500">Status: {webhook.last_response_status || '-'}</div>
                  <div className="text-gray-500">Response: {webhook.last_response_body || '-'}</div>
                </div>
              </section>
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