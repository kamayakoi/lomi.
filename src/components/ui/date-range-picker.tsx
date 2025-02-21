import { format } from 'date-fns'
import { DateRange } from 'react-day-picker'
import { Calendar as CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/actions/utils'

interface DateRangePickerProps {
    date: DateRange | undefined
    setDate: (date: DateRange | undefined) => void
}

export function DateRangePicker({ date, setDate }: DateRangePickerProps) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={'outline'}
                    size="sm"
                    className={cn(
                        "h-9 px-4 text-sm transition-all duration-200 min-w-[150px] justify-start",
                        date?.from && "bg-primary text-primary-foreground shadow-sm",
                        "hover:bg-muted/50 dark:hover:bg-muted",
                        "data-[state=open]:bg-muted/50 dark:data-[state=open]:bg-muted",
                        "active:scale-95"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (
                        date.to ? (
                            <>
                                {format(date.from, 'LLL dd, y')} -{' '}
                                {format(date.to, 'LLL dd, y')}
                            </>
                        ) : (
                            format(date.from, 'LLL dd, y')
                        )
                    ) : (
                        <span>Pick a date range</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                    className={cn(
                        "[&_.rdp-day_span]:rounded-none",
                        "[&_.rdp-day_span]:transition-none",
                        "[&_.rdp-day]:rounded-none",
                        "[&_.rdp-day]:transition-none",
                        "[&_.rdp-day]:border",
                        "[&_.rdp-day]:border-transparent",
                        "[&_.rdp-day]:hover:bg-muted",
                        "[&_.rdp-day_span]:hover:bg-transparent",
                        "[&_.rdp-day_span]:hover:text-foreground",
                        "[&_.rdp-day_span]:focus:bg-transparent",
                        "[&_.rdp-day_span]:focus:text-foreground",
                        "[&_.rdp-day_span]:data-[selected]:bg-primary",
                        "[&_.rdp-day_span]:data-[selected]:text-primary-foreground",
                        "[&_.rdp-day]:data-[selected]:bg-primary",
                        "[&_.rdp-day]:data-[selected]:text-primary-foreground",
                        "[&_.rdp-day]:data-[selected]:hover:bg-primary/90",
                        "[&_.rdp-day]:data-[selected]:hover:text-primary-foreground",
                        "[&_.rdp-day]:data-[selected]:focus:bg-primary/90",
                        "[&_.rdp-day]:data-[selected]:focus:text-primary-foreground"
                    )}
                />
            </PopoverContent>
        </Popover>
    )
}