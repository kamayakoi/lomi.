import { motion } from 'framer-motion'

export default function LoadingButton() {
  const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i: number) => {
      const delay = 1 + i * 0.5
      return {
        pathLength: 1,
        opacity: 1,
        transition: {
          pathLength: { delay, type: "spring", duration: 1.5, bounce: 0 },
          opacity: { delay, duration: 0.01 }
        }
      }
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
      <motion.svg
        width="100"
        height="100"
        viewBox="0 0 100 100"
        initial="hidden"
        animate="visible"
        style={{ transform: "rotate(270deg)" }}
      >
        <motion.path
          d="M10 10 L90 10 L90 30 L30 30 L30 90 L10 90 Z"
          fill="none"
          stroke="#FF0000"
          strokeWidth="4"
          variants={draw}
          custom={0}
        />
        <motion.path
          d="M30 30 L90 30 L90 50 L50 50 L50 90 L30 90 Z"
          fill="none"
          stroke="#FF0000"
          strokeWidth="4"
          variants={draw}
          custom={1}
        />
        <motion.path
          d="M50 50 L90 50 L90 70 L70 70 L70 90 L50 90 Z"
          fill="none"
          stroke="#FF0000"
          strokeWidth="4"
          variants={draw}
          custom={2}
        />
      </motion.svg>
      <motion.span
        className="ml-4 text-xl font-bold text-gray-800 dark:text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 2.5 }}
      >
        Loading...
      </motion.span>
    </div>
  )
}