import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Eraser } from "lucide-react"
import { supabase } from '@/utils/supabase/client'
import { useUser } from '@/lib/hooks/useUser'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'

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
    const { t } = useTranslation()

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
            <Button
                variant="outline"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
                className="border-gray-300 dark:border-gray-700 rounded-none"
            >
                {t('portal.feedback_form.button')}
            </Button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute md:right-0 right-[-220px] mt-[15px] w-80 bg-white dark:bg-[#121317] shadow-lg z-50"
                    >
                        <div className="p-4">
                            <Textarea
                                placeholder={t('portal.feedback_form.placeholder')}
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                className="min-h-[100px] mb-4 text-sm placeholder:text-sm bg-white dark:bg-[#121317] text-gray-900 dark:text-gray-100 rounded-none"
                            />
                            <div className="flex items-center justify-between">
                                <div className="flex space-x-2">
                                    {(Object.keys(emojis) as Sentiment[]).filter(key => key !== 'null').map((key) => (
                                        <button
                                            key={key}
                                            onClick={() => setSentiment(key)}
                                            className={`text-lg p-1 ${sentiment === key ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
                                        >
                                            {emojis[key]}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex space-x-2">
                                    <Button variant="outline" size="default" onClick={handleClear} title={t('portal.feedback_form.clear')} className="px-3 rounded-none">
                                        <Eraser className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        onClick={handleSubmit}
                                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 rounded-none"
                                    >
                                        {t('portal.feedback_form.submit')}
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 p-2 border-t border-gray-200 dark:border-gray-700">
                            {t('portal.feedback_form.footer')}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
