import { cn } from "@/lib/actions/utils";
import React, { ReactNode, useEffect, useState } from "react";
import { useTheme } from "@/lib/hooks/useTheme";

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children: ReactNode;
  showRadialGradient?: boolean;
}

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const baseClasses = cn(
    "relative flex flex-col items-center justify-center bg-transparent transition-all duration-300",
    className
  );

  const gradientClasses = cn(
    "pointer-events-none absolute -inset-[10px]",
    theme === 'light'
      ? "bg-gradient-to-br from-indigo-500/30 via-purple-500/30 to-pink-500/30"
      : "bg-gradient-to-br from-indigo-500/20 via-violet-500/20 to-purple-500/20",
    "blur-[80px]",
    showRadialGradient &&
    "[mask-image:radial-gradient(ellipse_at_top_right,black_40%,transparent_80%)]"
  );

  if (!mounted) {
    return (
      <div className={baseClasses} {...props}>
        <div className="absolute inset-0 overflow-hidden">
          <div className={cn(
            "pointer-events-none absolute -inset-[10px]",
            "bg-gradient-to-br from-indigo-500/20 via-violet-500/20 to-purple-500/20",
            "blur-[80px]",
            showRadialGradient &&
            "[mask-image:radial-gradient(ellipse_at_top_right,black_40%,transparent_80%)]"
          )} />
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className={baseClasses} {...props}>
      <div className="absolute inset-0 overflow-hidden">
        <div className={gradientClasses} />
      </div>
      {children}
    </div>
  );
};
