/* @proprietary license */

import React, { useRef, useEffect, useState, ComponentProps } from 'react';
import { useTheme } from '@/lib/hooks/use-theme';
import dynamic from 'next/dynamic';

const GrainGradient = dynamic(
    () => import('@paper-design/shaders-react').then((mod) => mod.GrainGradient),
    {
        ssr: false,
    },
);

const Dithering = dynamic(
    () => import('@paper-design/shaders-react').then((mod) => mod.Dithering),
    {
        ssr: false,
    },
);

function useIsVisible(ref: React.RefObject<HTMLDivElement | null>) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            { threshold: 0.1 }
        );

        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, [ref]);

    return isVisible;
}

type BackgroundVariant = 'hero' | 'masked' | 'gradient-only' | 'dithering-only';

interface AgnosticBackgroundProps {
    variant?: BackgroundVariant;
    className?: string;
}

export function ContentAdoptionBackground(
    props: ComponentProps<typeof GrainGradient>,
) {
    const { resolvedTheme } = useTheme();

    return (
        <GrainGradient
            colors={
                resolvedTheme === 'dark'
                    ? ['#0C4A6E', '#1E5A8A', '#2B77E6', '#4A9EF8', '#7DD3FC', '#E0F2FE00']
                    : ['#56A5F9', '#4A9EF8', '#3B82F6', '#60A5FA', '#7DD3FC', '#93C5FD', '#DBEAFE00']
            }
            speed={0}
            colorBack="#00000000"
            shape="sphere"
            {...props}
        />
    );
}

export function AgnosticBackground({ variant = 'masked', className }: AgnosticBackgroundProps) {
    const { resolvedTheme } = useTheme();
    const ref = useRef<HTMLDivElement>(null);
    const visible = useIsVisible(ref);

    const renderEffects = () => {
        switch (variant) {
            case 'hero':
                return (
                    <>
                        {/* Hero GrainGradient */}
                        <GrainGradient
                            className="hidden md:block absolute inset-x-0 -translate-x-1 top-[100px] h-[85vh] max-h-[850px] animate-fd-fade-in duration-800 border border-border/50 rounded-sm"
                            colors={
                                resolvedTheme === 'dark'
                                    ? ['#0C4A6E', '#1E5A8A', '#2B77E6', '#4A9EF8', '#7DD3FC', '#E0F2FE00']
                                    : ['#56A5F9', '#4A9EF8', '#3B82F6', '#60A5FA', '#7DD3FC', '#93C5FD', '#DBEAFE00']
                            }
                            colorBack="#00000000"
                            softness={1}
                            intensity={0.9}
                            noise={0.5}
                            speed={1}
                            shape="corners"
                            minPixelRatio={1}
                            maxPixelCount={1920 * 1080}
                        />

                        {/* Hero Dithering */}
                        <Dithering
                            width={720}
                            height={720}
                            colorBack="#00000000"
                            colorFront="#4A9EF8"
                            shape="sphere"
                            type="4x4"
                            scale={0.5}
                            size={3}
                            speed={0}
                            frame={5000 * 120}
                            className="hidden md:block absolute animate-fd-fade-in duration-400 max-lg:bottom-[-30%] max-lg:left-[-200px] lg:top-[-5%] lg:right-0"
                            minPixelRatio={1}
                        />
                    </>
                );

            case 'masked':
                return (
                    <Dithering
                        colorBack="#00000000"
                        colorFront="#56A5F9"
                        shape="warp"
                        type="4x4"
                        speed={visible ? 0.4 : 0}
                        className="size-full"
                        minPixelRatio={1}
                    />
                );

            case 'gradient-only':
                return (
                    <GrainGradient
                        className="absolute inset-0"
                        colors={
                            resolvedTheme === 'dark'
                                ? ['#0C4A6E', '#1E5A8A', '#2B77E6', '#4A9EF8', '#7DD3FC', '#E0F2FE00']
                                : ['#56A5F9', '#4A9EF8', '#3B82F6', '#60A5FA', '#7DD3FC', '#93C5FD', '#DBEAFE00']
                        }
                        colorBack="#00000000"
                        softness={1}
                        intensity={0.9}
                        noise={0.5}
                        speed={1}
                        shape="corners"
                        minPixelRatio={1}
                        maxPixelCount={1920 * 1080}
                    />
                );

            case 'dithering-only':
                return (
                    <Dithering
                        colorBack="#00000000"
                        colorFront="#60A5FA"
                        shape="sphere"
                        type="4x4"
                        scale={0.5}
                        size={3}
                        speed={0}
                        className="size-full"
                        minPixelRatio={1}
                    />
                );

            default:
                return null;
        }
    };

    return (
        <div
            ref={ref}
            className={`absolute inset-0 -z-1 ${variant === 'masked' ? 'mask-[linear-gradient(to_top,white_30%,transparent_calc(100%-120px))]' : ''
                } ${className || ''}`}
        >
            {renderEffects()}
        </div>
    );
}
