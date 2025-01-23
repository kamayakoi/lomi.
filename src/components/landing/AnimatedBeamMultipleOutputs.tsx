import React, { forwardRef, useRef } from "react";

import { cn } from "@/lib/actions/utils";
import { AnimatedBeam } from "../ui/animated-beam";

const Square = forwardRef<
    HTMLDivElement,
    { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
    return (
        <div
            ref={ref}
            className={cn(
                "z-10 flex size-12 items-center justify-center p-1 border-2 border-transparent rounded-sm",
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
    const div10Ref = useRef<HTMLDivElement>(null);
    const div11Ref = useRef<HTMLDivElement>(null);
    const div12Ref = useRef<HTMLDivElement>(null);
    const div13Ref = useRef<HTMLDivElement>(null);
    const div14Ref = useRef<HTMLDivElement>(null);

    return (
        <div
            className={cn(
                "relative flex h-[600px] w-full items-center justify-center overflow-hidden p-10",
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
                    <Square ref={div6Ref} className="size-20 relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 rounded-lg" />
                        <img
                            src="/lomi-icon.webp"
                            alt="lomi."
                            className="relative z-10 object-contain w-14 h-14 transition-all duration-300 hover:scale-110"
                        />
                    </Square>
                </div>
                <div className="flex flex-col justify-center gap-1">
                    <Square ref={div1Ref} className="size-14">
                        <img src="/visa.webp" alt="Visa" className="object-cover w-full h-full rounded-sm" />
                    </Square>
                    <Square ref={div2Ref} className="size-14">
                        <img src="/mastercard.webp" alt="Mastercard" className="object-cover w-full h-full rounded-sm" />
                    </Square>
                    <Square ref={div3Ref} className="size-14">
                        <img src="/paypal.webp" alt="PayPal" className="object-cover w-full h-full rounded-sm" />
                    </Square>
                    <Square ref={div4Ref} className="size-14">
                        <img src="/orange.webp" alt="Orange Money" className="object-cover w-full h-full rounded-sm" />
                    </Square>
                    <Square ref={div5Ref} className="size-14">
                        <img src="/mtn.webp" alt="MTN" className="object-cover w-full h-full rounded-sm" />
                    </Square>
                    <Square ref={div10Ref} className="size-14">
                        <img src="/wave.webp" alt="Wave" className="object-cover w-full h-full rounded-sm" />
                    </Square>
                    <Square ref={div11Ref} className="size-14">
                        <img src="/airtel.webp" alt="Airtel" className="object-cover w-full h-full rounded-sm" />
                    </Square>
                    <Square ref={div12Ref} className="size-14">
                        <img src="/wizall.webp" alt="Wizall" className="object-cover w-full h-full rounded-sm" />
                    </Square>
                    <Square ref={div13Ref} className="size-14">
                        <img src="/moov.webp" alt="Moov" className="object-cover w-full h-full rounded-sm" />
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
                fromRef={div10Ref}
                toRef={div6Ref}
                duration={3}
            />
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={div11Ref}
                toRef={div6Ref}
                duration={3}
            />
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={div12Ref}
                toRef={div6Ref}
                duration={3}
            />
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={div13Ref}
                toRef={div6Ref}
                duration={3}
            />
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={div14Ref}
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
