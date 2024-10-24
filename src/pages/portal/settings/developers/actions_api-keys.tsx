import { useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Trash2, ToggleLeft, ToggleRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export type ApiKey = {
    name: string;
    api_key: string;
    is_active: boolean;
    created_at: string;
}

type ApiKeyActionsProps = {
    apiKey: ApiKey | null
    isOpen: boolean
    onClose: () => void
    onDelete: (apiKey: string) => void
    onToggleStatus: (apiKey: string, isActive: boolean) => void
    buttonRef: React.RefObject<HTMLButtonElement>
}

export default function ApiKeyActions({ apiKey, isOpen, onClose, onDelete, onToggleStatus, buttonRef }: ApiKeyActionsProps) {
    const panelRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (panelRef.current && !panelRef.current.contains(event.target as Node) && !buttonRef.current?.contains(event.target as Node)) {
                onClose()
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [onClose, buttonRef])

    if (!apiKey) return null

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    ref={panelRef}
                    initial={{ opacity: 0, y: -10, scale: 0.3 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.5 }}
                    transition={{ duration: 0.3, type: "spring", stiffness: 260, damping: 20 }}
                    className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 bg-white dark:bg-[#121317] rounded-md shadow-lg z-50"
                >
                    <div className="p-4 space-y-2">
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => {
                                onToggleStatus(apiKey.api_key, apiKey.is_active)
                            }}
                        >
                            {apiKey.is_active ? (
                                <>
                                    <ToggleLeft className="mr-2 h-4 w-4" />
                                    Deactivate
                                </>
                            ) : (
                                <>
                                    <ToggleRight className="mr-2 h-4 w-4" />
                                    Activate
                                </>
                            )}
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => {
                                onDelete(apiKey.api_key)
                            }}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </Button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
