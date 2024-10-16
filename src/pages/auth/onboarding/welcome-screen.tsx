'use client'

import { useState, useEffect } from 'react'
import Confetti from 'react-confetti'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/actions/utils'

interface WelcomeScreenProps {
    onGetStarted: () => void;
}

export default function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })
    const [showConfetti, setShowConfetti] = useState(false)

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

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
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
                    "rounded-xl shadow-lg p-10 max-w-[520px] w-full text-center", // Increased padding and max-width
                    "bg-white dark:bg-gray-800"
                )}
            >
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
                    Welcome to lomi. !
                </motion.h1>
                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.9 }}
                    className={cn(
                        "text-lg mb-8",
                        "text-gray-600 dark:text-gray-300"
                    )}
                >
                    We&apos;re very excited to have you on board.
                    <br />
                    Let&apos;s make it effortless for your customers to pay you!
                </motion.p>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                        "text-white font-semibold py-3 px-6 rounded-md w-full transition duration-300",
                        "bg-gray-900 hover:bg-gray-800",
                        "dark:bg-blue-600 dark:hover:bg-blue-700"
                    )}
                    onClick={onGetStarted}
                >
                    Get Started
                </motion.button>
            </motion.div>
        </div>
    )
}
