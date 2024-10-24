import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Eraser } from "lucide-react"
import { supabase } from '@/utils/supabase/client'
import { useUser } from '@/lib/hooks/useUser'
import { motion, AnimatePresence } from 'framer-motion'

type Sentiment = 'very_positive' | 'positive' | 'negative' | 'very_negative' | 'null'

const emojis: { [key in Sentiment]: string } = {
    very_positive: '😀',
    positive: '🙂',
    negative: '🙁',
    very_negative: '😞',
    'null': ''
}

export default function FeedbackForm() {
    const { user } = useUser()
    const [isOpen, setIsOpen] = useState(false)
    const [feedback, setFeedback] = useState('')
    const [sentiment, setSentiment] = useState<Sentiment>('null')
    const formRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (formRef.current && !formRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const handleSubmit = async () => {
        if (!user?.id) return

        const { error } = await supabase.rpc('create_feedback', {
            p_merchant_id: user.id,
            p_sentiment: sentiment,
            p_message: feedback,
        })

        if (error) {
            console.error('Error submitting feedback:', error)
            return
        }

        setFeedback('')
        setSentiment('null')
        setIsOpen(false)
    }

    const handleClear = () => {
        setFeedback('')
        setSentiment('null')
    }

    return (
        <div className="relative" ref={formRef}>
            <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsOpen(!isOpen)}
                    className="border-gray-300 dark:border-gray-700"
                >
                    Feedback
                </Button>
            </motion.div>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.3 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.5 }}
                        transition={{ duration: 0.3, type: "spring", stiffness: 260, damping: 20 }}
                        className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#121317] rounded-md shadow-lg z-50"
                    >
                        <div className="p-4">
                            <Textarea
                                placeholder="Ideas on how to improve our products. Contact support for technical issues."
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                className="min-h-[100px] mb-4 text-sm placeholder:text-sm bg-white dark:bg-[#121317] text-gray-900 dark:text-gray-100"
                            />
                            <div className="flex items-center justify-between">
                                <div className="flex space-x-2">
                                    {(Object.keys(emojis) as Sentiment[]).filter(key => key !== 'null').map((key) => (
                                        <button
                                            key={key}
                                            onClick={() => setSentiment(key)}
                                            className={`text-lg p-1 rounded ${sentiment === key ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
                                        >
                                            {emojis[key]}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex space-x-2">
                                    <Button variant="outline" size="default" onClick={handleClear} title="Clear text" className="px-3">
                                        <Eraser className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        onClick={handleSubmit}
                                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
                                    >
                                        Submit
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 p-2 border-t border-gray-200 dark:border-gray-700">
                            Have a technical issue? Contact support via the form below or browse our docs.
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
