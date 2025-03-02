import OrbitingCircles from "@/components/ui/orbiting-circles";
import * as Icons from "@/components/landing/Icons";

export function OrbitingCirclesDemo() {
    return (
        <div className="relative flex h-[400px] w-full flex-col items-center justify-center overflow-visible rounded-lg">
            <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300 bg-clip-text text-center text-6xl font-semibold leading-none text-transparent dark:from-white dark:to-black">
                Products
            </span>

            {/* Inner Circles */}
            <OrbitingCircles
                className="size-[80px] bg-transparent"
                duration={20}
                delay={20}
                radius={80}
            >
                <Icons.MtnLogo />
            </OrbitingCircles>
            <OrbitingCircles
                className="size-[80px] bg-transparent"
                duration={20}
                delay={10}
                radius={80}
            >
                <Icons.WaveLogo />
            </OrbitingCircles>

            {/* Outer Circles (reverse) */}
            <OrbitingCircles
                className="size-[80px] bg-transparent"
                radius={160}
                duration={20}
                reverse
            >
                <Icons.MastercardLogo />
            </OrbitingCircles>
            <OrbitingCircles
                className="size-[80px] bg-transparent"
                radius={160}
                duration={20}
                delay={20}
                reverse
            >
                <Icons.VisaLogo />
            </OrbitingCircles>
        </div>
    );
}