import { Loader2 } from "lucide-react";

export default function LoadingButton() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="flex items-center gap-2 text-gray-700 dark:text-white">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Loading</span>
            </div>
        </div>
    )
}