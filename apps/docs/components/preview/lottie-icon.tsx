/* @proprietary license */

import React, { useState, useRef, useEffect, memo, useMemo } from 'react';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import { useTheme } from '@/lib/hooks/use-theme';
import Spinner from '@/components/ui/spinner';
import type { LottieAnimationData } from '@/lib/utils/lottie-animations';

// Type definitions for Lottie layer structure
interface LottieLayer {
  nm: string;
  ef?: LottieEffect[];
}

interface LottieEffect {
  nm: string;
  ef?: LottieEffectControl[];
}

interface LottieEffectControl {
  nm: string;
  v?: {
    k: number[];
  };
}

interface LottieIconProps {
  animationData: string | object;
  size?: number;
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
  initialFrame?: number; // Frame to show initially for better static visibility
  isHovered?: boolean; // External hover control
  customColor?: [number, number, number]; // RGB values as decimals (0-1) - single color
  lightColor?: [number, number, number]; // RGB values as decimals (0-1) - for light mode
  darkColor?: [number, number, number]; // RGB values as decimals (0-1) - for dark mode
  ariaLabel?: string; // Accessible label for screen readers
}

const LottieIconComponent = ({
  animationData,
  size = 20, // Increased from 18 for bolder appearance
  className = '',
  loop = false,
  autoplay = false,
  initialFrame,
  isHovered: externalHovered,
  customColor,
  lightColor,
  darkColor,
  ariaLabel,
}: LottieIconProps): React.ReactElement => {
  const [internalHovered, setInternalHovered] = useState(false);
  const [animData, setAnimData] = useState<LottieAnimationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const { resolvedTheme, mounted } = useTheme();

  const isDark = resolvedTheme === 'dark';
  const color = useMemo(() => {
    // Priority: lightColor/darkColor > customColor > default colors
    if (lightColor && darkColor) {
      return isDark ? darkColor : lightColor;
    }
    if (customColor) return customColor;
    // Default to current text color - using pure white/black for maximum contrast
    return isDark
      ? ([1, 1, 1] as [number, number, number]) // Pure white in dark mode
      : ([0, 0, 0] as [number, number, number]); // Pure black in light mode
  }, [isDark, customColor, lightColor, darkColor]);

  // Use external hover state if provided, otherwise use internal state
  const isHovered =
    externalHovered !== undefined ? externalHovered : internalHovered;

  useEffect(() => {
    // Handle direct object data (our new preferred approach)
    if (typeof animationData === 'object' && animationData !== null) {
      let processedData = animationData as LottieAnimationData;

      // If color is provided, override the primary color in the control layer
      if (color && processedData.layers) {
        processedData = JSON.parse(JSON.stringify(processedData)); // Deep clone
        const layers = processedData.layers as LottieLayer[];
        const controlLayer = layers.find(
          (layer) => layer.nm === 'control' && layer.ef,
        );
        if (controlLayer?.ef) {
          const primaryEffect = controlLayer.ef.find(
            (effect) => effect.nm === 'primary',
          );
          if (primaryEffect?.ef) {
            const colorControl = primaryEffect.ef.find(
              (control) => control.nm === 'Color',
            );
            if (colorControl?.v?.k) {
              colorControl.v.k = [...color, 1]; // Add alpha channel
            }
          }
        }
      }

      setAnimData(processedData);
      setIsLoading(false);
      return;
    }

    // Handle string paths (legacy - should warn developers)
    if (typeof animationData === 'string') {
      console.warn(
        `Using path string "${animationData}" for Lottie animation is deprecated. Please use direct animation imports from @/lib/utils/lottie-animations instead.`,
      );
      setAnimData(null);
      setIsLoading(false);
    }
  }, [animationData, color]);

  // Set initial frame when animation loads
  useEffect(() => {
    if (lottieRef.current && animData && initialFrame !== undefined) {
      lottieRef.current.goToAndStop(initialFrame, true);
    }
  }, [animData, initialFrame]);

  // Handle animation based on hover state
  useEffect(() => {
    if (lottieRef.current && animData) {
      if (isHovered) {
        lottieRef.current.play();
      } else if (!loop) {
        if (initialFrame !== undefined) {
          lottieRef.current.goToAndStop(initialFrame, true);
        } else {
          lottieRef.current.stop();
        }
      }
    }
  }, [isHovered, animData, initialFrame, loop]);

  const handleMouseEnter = () => {
    if (externalHovered === undefined) {
      setInternalHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (externalHovered === undefined) {
      setInternalHovered(false);
    }
  };

  if (!mounted || isLoading || !animData) {
    return (
      <div
        className={`inline-flex items-center justify-center ${className}`}
        style={{ width: size, height: size }}
      >
        {isLoading ? (
          <Spinner />
        ) : (
          <div className="w-full h-full bg-muted-foreground/20 rounded-sm animate-pulse" />
        )}
      </div>
    );
  }

  return (
    <div
      role="button"
      tabIndex={0}
      className={`inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label={ariaLabel}
    >
      <Lottie
        lottieRef={lottieRef}
        animationData={animData}
        autoplay={autoplay}
        loop={loop}
        style={{
          width: size,
          height: size,
        }}
      />
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export const LottieIcon = memo(LottieIconComponent);

// Set displayName for proper component identification
LottieIcon.displayName = 'LottieIcon';
