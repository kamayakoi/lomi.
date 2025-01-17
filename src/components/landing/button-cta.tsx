"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/actions/utils"
import { Check, Terminal } from 'lucide-react'

interface ButtonCtaProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline'
}

export function ButtonCta({ className, ...props }: ButtonCtaProps) {
  const [copied, setCopied] = React.useState(false)
  const [isHovered, setIsHovered] = React.useState(false)

  const handleClick = () => {
    navigator.clipboard.writeText("npm install lomi.cli")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      className={cn(
        "group relative flex items-center justify-center h-11 sm:h-10 w-fit px-4 sm:px-4 overflow-hidden rounded-none border border-zinc-200 bg-orange-50 text-orange-700 transition-all duration-300 hover:pl-10 hover:bg-orange-100 dark:border-zinc-800 dark:bg-orange-900/30 dark:text-orange-300 dark:hover:bg-orange-900/40 dark:hover:text-orange-200 shadow-lg backdrop-blur-sm focus:outline-none focus-visible:outline-none",
        className
      )}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      <motion.div
        className="absolute left-3 flex items-center"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: !copied && isHovered ? 1 : 0, x: !copied && isHovered ? 0 : -20 }}
        transition={{ duration: 0.4 }}
      >
        <Terminal className="h-4 w-4" />
      </motion.div>

      <motion.div
        className="relative flex items-center justify-center gap-1"
        initial={{ opacity: 1 }}
        animate={{ opacity: copied ? 0 : 1 }}
      >
        <span className="text-sm sm:text-base font-medium">
          npm install lomi.cli
        </span>
      </motion.div>

      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: copied ? 1 : 0, scale: copied ? 1 : 0.5 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          initial={{ rotate: -180, opacity: 0 }}
          animate={{ rotate: copied ? 0 : -180, opacity: copied ? 1 : 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <Check className="w-5 h-5 text-orange-500 dark:text-orange-300" />
        </motion.div>
      </motion.div>
    </button>
  )
}

