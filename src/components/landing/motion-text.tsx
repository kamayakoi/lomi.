import { motion, Variants, Transition } from "framer-motion";

interface MotionTextProps {
    text: string;
    variants: Variants;
    custom: boolean;
    transition: Transition;
    className?: string;
}

function MotionText({ text, variants, custom, transition, className }: MotionTextProps) {
    return (
        <motion.span
            className={`absolute text-zinc-800 dark:text-white font-semibold ${className ?? ''}`}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            custom={custom}
            transition={transition}
        >
            {text}
        </motion.span>
    );
}

export default MotionText; 