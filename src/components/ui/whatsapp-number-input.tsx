import { Input } from "@/components/ui/input";
import { ChevronDown } from "lucide-react";
import React from "react";
import * as RPNInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import { WhatsappIcon } from "@/components/icons/WhatsappIcon";

interface WhatsAppNumberInputProps {
    value: string;
    onChange: (value: string | undefined) => void;
}

export default function WhatsAppNumberInput({ value, onChange }: WhatsAppNumberInputProps) {
    return (
        <div className="space-y-2">
            <div className="shadow-sm shadow-black/[.04]">
                <RPNInput.default
                    className="flex rounded-none"
                    international
                    flagComponent={FlagComponent}
                    countrySelectComponent={CountrySelect}
                    inputComponent={PhoneInput}
                    placeholder="WhatsApp number**"
                    value={value}
                    onChange={onChange}
                />
            </div>
        </div>
    );
}

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const PhoneInput = React.forwardRef<HTMLInputElement, InputProps>(
    ({ ...props }, ref) => {
        return (
            <Input
                className="border-l border-input shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none"
                ref={ref}
                {...props}
            />
        );
    },
);

PhoneInput.displayName = "PhoneInput";

type CountrySelectProps = {
    disabled?: boolean;
    value: RPNInput.Country;
    onChange: (value: RPNInput.Country) => void;
    options: { label: string; value: RPNInput.Country }[];
};

const CountrySelect = ({ disabled, value, onChange, options }: CountrySelectProps) => {
    const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        onChange(event.target.value as RPNInput.Country);
    };

    return (
        <div className="relative inline-flex items-center self-stretch bg-transparent py-2 pe-2 ps-3 text-foreground transition-colors border-y border-l border-input">
            <div className="inline-flex items-center gap-1" aria-hidden="true">
                <FlagComponent country={value} countryName={value} aria-hidden="true" />
                <span className="text-muted-foreground/80">
                    <ChevronDown size={16} strokeWidth={2} aria-hidden="true" />
                </span>
            </div>
            <select
                disabled={disabled}
                value={value || ""}
                onChange={handleSelect}
                className="absolute inset-0 text-sm opacity-0"
                aria-label="Select country"
            >
                <option key="default" value="" className="text-muted-foreground">
                    Country**
                </option>
                {options
                    .filter((x) => x.value)
                    .map((option) => (
                        <option key={option.value || "empty"} value={option.value}>
                            {option.label} {option.value && `+${RPNInput.getCountryCallingCode(option.value)}`}
                        </option>
                    ))}
            </select>
        </div>
    );
};

const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
    const Flag = flags[country];

    return (
        <span className="w-5 overflow-hidden rounded-sm">
            {Flag ? (
                <Flag title={countryName} />
            ) : (
                <WhatsappIcon className="w-5 h-5" />
            )}
        </span>
    );
}; 