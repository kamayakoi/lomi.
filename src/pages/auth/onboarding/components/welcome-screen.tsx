'use client'

import { useState, useEffect } from 'react'
import Confetti from 'react-confetti'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/actions/utils'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'
import { OnboardingLanguageSwitcher } from '@/components/design/OnboardingLanguageSwitcher'

interface WelcomeScreenProps {
    onGetStarted: () => void;
}

export default function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
    const { t, i18n } = useTranslation()
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })
    const [showConfetti, setShowConfetti] = useState(false)
    const [mounted, setMounted] = useState(false)

    // Initialize language
    useEffect(() => {
        const savedLanguage = localStorage.getItem('language');
        if (savedLanguage && i18n.language !== savedLanguage) {
            i18n.changeLanguage(savedLanguage).then(() => {
                setMounted(true);
            });
        } else {
            setMounted(true);
        }
    }, [i18n]);

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight })
        }

        handleResize()
        window.addEventListener('resize', handleResize)
        const timer = setTimeout(() => setShowConfetti(true), 500)

        return () => {
            window.removeEventListener('resize', handleResize)
            clearTimeout(timer)
        }
    }, [])

    // Don't render until language is initialized
    if (!mounted) {
        return null;
    }

    return (
        <div className="min-h-screen bg-background dark:bg-background flex items-center justify-center p-4">
            {showConfetti && (
                <Confetti
                    width={windowSize.width}
                    height={windowSize.height}
                    recycle={false}
                    numberOfPieces={200}
                />
            )}
            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className={cn(
                    "shadow-lg p-10 w-[520px] rounded-none border dark:border-gray-800",
                    "bg-white dark:bg-background",
                    "flex flex-col items-center justify-between"
                )}
            >
                <div className="absolute top-4 right-4">
                    <OnboardingLanguageSwitcher />
                </div>
                <div className="flex-1 flex flex-col items-center justify-center">
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                    >
                        <Sparkles className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                    </motion.div>
                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.7 }}
                        className={cn(
                            "text-3xl font-bold mb-4",
                            "text-gray-900 dark:text-white"
                        )}
                    >
                        {t('onboarding.welcome_screen.title')}
                    </motion.h1>
                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.9 }}
                        className={cn(
                            "text-lg mb-8 text-center",
                            "text-gray-600 dark:text-gray-300"
                        )}
                    >
                        {t('onboarding.welcome_screen.description.line1')}
                        <br />
                        {t('onboarding.welcome_screen.description.line2')}
                    </motion.p>
                </div>
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1.1 }}
                >
                    <Button
                        onClick={onGetStarted}
                        className="w-[200px] h-12 rounded-none bg-black hover:bg-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 text-white font-semibold text-base transition-all duration-300 ease-in-out hover:shadow-lg"
                    >
                        {t('onboarding.welcome_screen.get_started')}
                    </Button>
                </motion.div>
            </motion.div>
        </div>
    )
}
