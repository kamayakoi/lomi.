import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Info } from 'lucide-react'

interface SmartRetriesProps {
    retryPaymentEvery: number
    totalRetries: number
    onRetryPaymentEveryChange: (value: number) => void
    onTotalRetriesChange: (value: number) => void
}

export function SmartRetries({
    retryPaymentEvery,
    totalRetries,
    onRetryPaymentEveryChange,
    onTotalRetriesChange
}: SmartRetriesProps) {
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center">
                    Smart Retries
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon" className="ml-2">
                                <Info className="h-4 w-4" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                            <p className="text-sm">
                                Smart Retries allow you to set up a strategy for retrying failed payments.
                                Specify the number of days between retries and the total number of retry attempts.
                            </p>
                        </PopoverContent>
                    </Popover>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="retry_payment_every">Days between retries</Label>
                        <Slider
                            id="retry_payment_every"
                            min={0}
                            max={9}
                            step={1}
                            value={[retryPaymentEvery]}
                            onValueChange={(value) => onRetryPaymentEveryChange(value[0] || 0)}
                            className="rounded-none"
                        />
                        <div className="text-sm text-muted-foreground mt-1">
                            Retry every {retryPaymentEvery} day(s)
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="total_retries">Total number of retries</Label>
                        <Slider
                            id="total_retries"
                            min={0}
                            max={5}
                            step={1}
                            value={[totalRetries]}
                            onValueChange={(value) => onTotalRetriesChange(value[0] || 0)}
                            className="rounded-none"
                        />
                        <div className="text-sm text-muted-foreground mt-1">
                            {totalRetries} total retry attempts
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
