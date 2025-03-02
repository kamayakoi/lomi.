import { Input } from "@/components/ui/input";

export default function Input14() {
    return (
        <div className="space-y-2">
            <div className="flex rounded-lg shadow-sm shadow-black/[.04]">
                <span className="-z-10 inline-flex items-center rounded-l-lg border border-input bg-background px-3 text-sm text-muted-foreground">
                    https://
                </span>
                <Input
                    id="input-14"
                    className="-ml-px rounded-l-none shadow-none"
                    placeholder="example.com"
                    type="text"
                />
            </div>
        </div>
    );
}
