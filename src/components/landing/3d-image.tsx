'use client'

import { motion } from 'framer-motion'

interface ThreeDImageProps {
    src: string
    alt: string
    width: number
    height: number
    className?: string
}

export default function ThreeDImage({
    src,
    alt,
    width,
    height,
    className
}: ThreeDImageProps) {
    return (
        <motion.div
            className="relative w-fit group"
            initial={{
                opacity: 0,
                scale: 0.92,
                y: 20
            }}
            animate={{
                opacity: 1,
                scale: 1,
                y: 0
            }}
            transition={{
                duration: 0.7,
                ease: [0.23, 1, 0.32, 1],
                delay: 0.2
            }}
        >
            {/* 3D Transform wrapper with smoother animation */}
            <motion.div
                className="
                    transition-transform duration-700 ease-out
                    [transform:perspective(5000px)_rotateX(45deg)_rotateY(-15deg)_rotateZ(35deg)]
                    [transform-style:preserve-3d]
                    group-hover:[transform:perspective(5000px)_rotateX(40deg)_rotateY(-12deg)_rotateZ(32deg)]
                "
                initial={{
                    rotateX: 55,
                    rotateY: -25,
                    rotateZ: 45
                }}
                animate={{
                    rotateX: 45,
                    rotateY: -15,
                    rotateZ: 35
                }}
                transition={{
                    duration: 1,
                    ease: [0.23, 1, 0.32, 1],
                    delay: 0.3
                }}
            >
                {/* Image wrapper with enhanced shadow and 3D borders */}
                <div className="relative [transform-style:preserve-3d]">
                    {/* Glass effect overlay */}
                    <motion.div
                        className="absolute inset-0 bg-white/5 backdrop-blur-[1px] rounded-lg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                    />

                    {/* Main image face with improved quality */}
                    <motion.div
                        className="
                            relative
                            rounded-lg
                            overflow-hidden
                            [box-shadow:0px_50px_40px_-20px_rgba(0,0,0,0.2)]
                            dark:[box-shadow:0px_50px_40px_-20px_rgba(0,0,0,0.3)]
                            [backface-visibility:hidden]
                            before:absolute
                            before:inset-0
                            before:bg-gradient-to-b
                            before:from-black/5
                            before:to-transparent
                            before:z-10
                        "
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <img
                            src={src}
                            alt={alt}
                            width={width}
                            height={height}
                            className={`w-auto h-auto object-cover ${className}`}
                            style={{
                                imageRendering: 'crisp-edges',
                                WebkitFontSmoothing: 'antialiased',
                            }}
                        />
                    </motion.div>

                    {/* Enhanced right border face */}
                    <motion.div
                        className="
                            absolute top-0 right-0 w-[40px] h-full
                            bg-gradient-to-l from-[hsl(0,0%,8%)] to-[hsl(0,0%,12%)]
                            [transform:translateX(100%)_rotateY(90deg)_translateZ(-20px)]
                            origin-left [backface-visibility:hidden]
                            rounded-r-lg
                        "
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                    />

                    {/* Enhanced bottom border face */}
                    <motion.div
                        className="
                            absolute -bottom-[1px] left-0 w-full h-[40px]
                            bg-gradient-to-t from-[hsl(0,0%,8%)] to-[hsl(0,0%,12%)]
                            [transform:translateY(100%)_rotateX(-90deg)_translateZ(-20px)]
                            origin-top [backface-visibility:hidden]
                            rounded-b-lg
                        "
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                    />
                </div>
            </motion.div>
        </motion.div>
    )
}

