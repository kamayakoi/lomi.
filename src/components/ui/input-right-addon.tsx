import { Input } from "@/components/ui/input";

interface InputRightAddonProps {
    id: string;
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    type?: string;
}

export default function InputRightAddon({ id, value, onChange, placeholder, type }: InputRightAddonProps) {
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
            <span className="inline-flex items-center border border-l-0 border-input bg-muted px-3 text-sm text-muted-foreground">
                XOF
            </span>
        </div>
    );
}
