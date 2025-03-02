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
                        "h-10 w-[180px] px-2 text-sm font-medium justify-start border-r",
                        "focus-visible:z-10 focus-visible:ring-1 focus-visible:ring-primary",
                        date?.from
                            ? "bg-[#10B981] text-white hover:bg-[#10B981]/90 border-[#10B981]"
                            : "bg-card text-card-foreground hover:bg-muted/50"
                    )}
                >
                    <CalendarIcon className="ml-1 mr-1 h-4 w-4" />
                    {date?.from ? (
                        date.to ? (
                            <>
                                {format(date.from, 'dd/MM/yy')} - {format(date.to, 'dd/MM/yy')}
                            </>
                        ) : (
                            format(date.from, 'dd/MM/yy')
                        )
                    ) : (
                        <span>Pick a date</span>
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
                        "[&_.rdp-day_span]:rounded-sm",
                        "[&_.rdp-day_span]:transition-none",
                        "[&_.rdp-day]:rounded-sm",
                        "[&_.rdp-day]:transition-none",
                        "[&_.rdp-day]:border",
                        "[&_.rdp-day]:border-transparent",
                        "[&_.rdp-day]:hover:bg-muted",
                        "[&_.rdp-day_span]:hover:bg-transparent",
                        "[&_.rdp-day_span]:hover:text-foreground",
                        "[&_.rdp-day_span]:focus:bg-transparent",
                        "[&_.rdp-day_span]:focus:text-foreground",
                        "[&_.rdp-day_span]:data-[selected]:bg-[#10B981]",
                        "[&_.rdp-day_span]:data-[selected]:text-white",
                        "[&_.rdp-day]:data-[selected]:bg-[#10B981]",
                        "[&_.rdp-day]:data-[selected]:text-white",
                        "[&_.rdp-day]:data-[selected]:hover:bg-[#10B981]/90",
                        "[&_.rdp-day]:data-[selected]:hover:text-white",
                        "[&_.rdp-day]:data-[selected]:focus:bg-[#10B981]/90",
                        "[&_.rdp-day]:data-[selected]:focus:text-white"
                    )}
                />
            </PopoverContent>
        </Popover>
    )
}