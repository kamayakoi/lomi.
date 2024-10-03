import { Button } from "@/components/ui/button"

export default function Component() {
    return (
        <Button
            asChild
            variant="ghost"
            className="bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-900"
        >
            <a href="/status">
                <span className="mr-2 h-3 w-3 rounded-full bg-green-500 inline-block" />
                ALL SYSTEMS OPERATIONAL
            </a>
        </Button>
    )
}