import { DateField, DateInput, DateSegment, DateValue } from "react-aria-components";
import { cn } from "@/lib/actions/utils";

interface DateFieldInputProps {
    value: DateValue | null;
    onChange: (value: DateValue | null) => void;
    className?: string;
}

export default function DateFieldInput({ value, onChange, className }: DateFieldInputProps) {
    return (
        <DateField value={value} onChange={onChange}>
            <DateInput
                className={cn(
                    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground",
                    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    "dark:bg-[#121317] dark:text-white dark:border-gray-700",
                    className
                )}
            >
                {(segment) => (
                    <DateSegment
                        segment={segment}
                        className={cn(
                            "inline-block p-0.5 text-foreground outline-none",
                            "data-[focused]:bg-transparent data-[focused]:text-foreground",
                            "data-[placeholder]:text-muted-foreground",
                            "data-[type=literal]:text-muted-foreground",
                            "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
                            "dark:text-white dark:data-[focused]:text-white dark:data-[placeholder]:text-gray-400"
                        )}
                    />
                )}
            </DateInput>
        </DateField>
    );
}
