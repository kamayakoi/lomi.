import React, { forwardRef, useRef } from "react";

import { cn } from "../../lib/utils";
import { AnimatedBeam } from "../ui/animated-beam";

const Square = forwardRef<
    HTMLDivElement,
    { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
    return (
        <div
            ref={ref}
            className={cn(
                "z-10 flex size-12 items-center justify-center p-1 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)] border-[0.5px] border-white rounded",
                className,
            )}
        >
            {children}
        </div>
    );
});

Square.displayName = "Square";

const UserIconCircle = forwardRef<
    HTMLDivElement,
    { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
    return (
        <div
            ref={ref}
            className={cn(
                "z-10 size-12 border-[0.5px] bg-white p-1 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)] rounded-full flex items-center justify-center",
                className,
            )}
        >
            {children}
        </div>
    );
});

UserIconCircle.displayName = "UserIconCircle";

export function AnimatedBeamMultipleOutputDemo({
    className,
}: {
    className?: string;
}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const div1Ref = useRef<HTMLDivElement>(null);
    const div2Ref = useRef<HTMLDivElement>(null);
    const div3Ref = useRef<HTMLDivElement>(null);
    const div4Ref = useRef<HTMLDivElement>(null);
    const div5Ref = useRef<HTMLDivElement>(null);
    const div6Ref = useRef<HTMLDivElement>(null);
    const div7Ref = useRef<HTMLDivElement>(null);
    const div8Ref = useRef<HTMLDivElement>(null);
    const div9Ref = useRef<HTMLDivElement>(null);

    return (
        <div
            className={cn(
                "relative flex h-[500px] w-full items-center justify-center overflow-hidden p-10",
                className,
            )}
            ref={containerRef}
        >
            <div className="flex size-full max-w-lg flex-row items-stretch justify-between gap-10">
                <div className="flex flex-col justify-center gap-4">
                    <UserIconCircle ref={div7Ref}>
                        <Icons.user />
                    </UserIconCircle>
                    <UserIconCircle ref={div8Ref}>
                        <Icons.user />
                    </UserIconCircle>
                    <UserIconCircle ref={div9Ref}>
                        <Icons.user />
                    </UserIconCircle>
                </div>
                <div className="flex flex-col justify-center">
                    <Square ref={div6Ref} className="size-12">
                        <img src="/7.png" alt="lomi." className="object-cover w-full h-full" />
                    </Square>
                </div>
                <div className="flex flex-col justify-center gap-2">
                    <Square ref={div1Ref}>
                        <img src="/wave.png" alt="Wave" className="object-cover w-full h-full" />
                    </Square>
                    <Square ref={div2Ref}>
                        <img src="/orange.png" alt="Orange" className="object-cover w-full h-full" />
                    </Square>
                    <Square ref={div3Ref}>
                        <img src="/mtn.png" alt="MTN" className="object-cover w-full h-full" />
                    </Square>
                    <Square ref={div4Ref}>
                        <img src="/apple-pay.png" alt="Apple Pay" className="object-cover w-full h-full" />
                    </Square>
                    <Square ref={div5Ref}>
                        <img src="/ecobank2.png" alt="Ecobank" className="object-cover w-full h-full" />
                    </Square>
                </div>
            </div>

            {/* AnimatedBeams */}
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={div1Ref}
                toRef={div6Ref}
                duration={3}
            />
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={div2Ref}
                toRef={div6Ref}
                duration={3}
            />
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={div3Ref}
                toRef={div6Ref}
                duration={3}
            />
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={div4Ref}
                toRef={div6Ref}
                duration={3}
            />
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={div5Ref}
                toRef={div6Ref}
                duration={3}
            />
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={div6Ref}
                toRef={div7Ref}
                duration={3}
            />
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={div6Ref}
                toRef={div8Ref}
                duration={3}
            />
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={div6Ref}
                toRef={div9Ref}
                duration={3}
            />
        </div>
    );
}

const Icons = {
    user: () => (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#000000"
            strokeWidth="2"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    ),
};