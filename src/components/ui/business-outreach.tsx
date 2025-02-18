import { useState, useEffect } from "react"
import { useToast } from "@/lib/hooks/use-toast"
import { ToastTitle, ToastDescription } from "@/components/ui/toast"

export default function BusinessOutreach() {
    const [isVisible, setIsVisible] = useState(false)
    const { toast } = useToast()

    useEffect(() => {
        // Show the modal after 8 seconds
        const showTimeout = setTimeout(() => {
            setIsVisible(true)
        }, 5000)

        // Hide it after 1 minute of being shown
        const hideTimeout = setTimeout(() => {
            setIsVisible(false)
        }, 60000)

        return () => {
            clearTimeout(showTimeout)
            clearTimeout(hideTimeout)
        }
    }, [])

    const handleCopyEmail = async () => {
        try {
            await navigator.clipboard.writeText('hello@lomi.africa')
            toast({
                title: "Email copied!",
                description: "hello@lomi.africa has been copied to your clipboard.",
                duration: 3000,
                children: (
                    <div className="flex items-start gap-3">
                        <div className="flex-1">
                            <ToastTitle>Email copied!</ToastTitle>
                            <ToastDescription>hello@lomi.africa has been copied to your clipboard.</ToastDescription>
                        </div>
                    </div>
                )
            })
            setIsVisible(false)
        } catch (error) {
            toast({
                variant: "destructive",
                duration: 3000,
                children: (
                    <div className="flex items-start gap-3">
                        <div className="flex-1">
                            <ToastTitle>Failed to copy</ToastTitle>
                            <ToastDescription>Please copy the email manually: hello@lomi.africa</ToastDescription>
                        </div>
                    </div>
                )
            })
        }
    }

    if (!isVisible) return null

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <div className="w-[370px]">
                <div className="rounded-[6px] bg-black/90 px-5 py-4">
                    <p className="mb-3 text-gray-400 text-sm text-left">
                        Large or fast-growing business? Get dedicated pricing and support.
                    </p>
                    <div className="flex gap-4">
                        <button
                            onClick={handleCopyEmail}
                            className="text-white text-sm hover:text-gray-200 transition-colors"
                        >
                            Reach out to us
                        </button>
                        <button
                            onClick={() => setIsVisible(false)}
                            className="text-gray-500 ml-1 mt-0.5 text-xs hover:text-gray-400 transition-colors"
                        >
                            Dismiss
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
} 