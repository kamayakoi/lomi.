import { Input } from "@/components/ui/input";
import { ChevronDown, Phone } from "lucide-react";
import React from "react";
import * as RPNInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";

interface PhoneNumberInputProps {
    value: string;
    onChange: (value: string | undefined) => void;
}

export default function PhoneNumberInput({ value, onChange }: PhoneNumberInputProps) {
    return (
        <div className="space-y-2">
            <RPNInput.default
                className="flex gap-[1px] border border-black/20"
                international
                flagComponent={FlagComponent}
                countrySelectComponent={CountrySelect}
                inputComponent={PhoneInput}
                placeholder="Enter phone number"
                value={value}
                onChange={onChange}
            />
        </div>
    );
}

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const PhoneInput = React.forwardRef<HTMLInputElement, InputProps>(
    ({ ...props }, ref) => {
        return (
            <Input
                className="border-l border-black/20 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
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
        <div className="relative inline-flex items-center self-stretch bg-background py-2 pe-2 ps-3 text-muted-foreground transition-colors hover:bg-accent/50 has-[:disabled]:pointer-events-none has-[:disabled]:opacity-50">
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
                <option key="default" value="">
                    Select a country
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
                <Phone size={16} aria-hidden="true" role="presentation" />
            )}
        </span>
    );
};
