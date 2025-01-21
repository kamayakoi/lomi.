import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

interface InputRightAddonProps {
    id: string;
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    type?: string;
    currency?: string;
    onCurrencyChange?: (currency: string) => void;
}

const CURRENCIES = [
    { code: 'XOF', name: 'CFA franc' },
    { code: 'USD', name: 'US Dollar' },
    { code: 'EUR', name: 'Euro' }
];

export default function InputRightAddon({
    id,
    value,
    onChange,
    placeholder,
    type,
    currency = 'XOF',
    onCurrencyChange
}: InputRightAddonProps) {
    return (
        <div className="flex shadow-sm">
            <Input
                id={id}
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                className="rounded-none"
                placeholder={placeholder}
                type={type}
            />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        className="border border-l-0 border-input bg-muted px-3 text-sm text-muted-foreground rounded-none hover:bg-muted/80 focus:ring-0"
                    >
                        {currency}
                        <ChevronDown className="ml-1 h-3 w-3" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                    {CURRENCIES.map((curr) => (
                        <DropdownMenuItem
                            key={curr.code}
                            onClick={() => onCurrencyChange?.(curr.code)}
                            className="justify-between"
                        >
                            <span>{curr.code}</span>
                            <span className="text-muted-foreground text-xs">{curr.name}</span>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
