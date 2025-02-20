import * as React from "react"
import { Info, Lightbulb } from "lucide-react"
import { cn } from "@/lib/actions/utils"
import { Link } from "react-router-dom"

interface InfoBoxProps {
    children: React.ReactNode
    className?: string
    title?: string
    mini?: boolean
    link?: string
    variant?: 'blue' | 'green' | 'red' | 'tip'
    type?: 'info' | 'tip'
}

export default function InfoBox({
    children,
    className,
    title = "Important",
    mini,
    link,
    variant = 'blue',
    type = 'info'
}: InfoBoxProps) {
    const variantStyles = {
        blue: {
            box: "border-blue-200 bg-blue-50 dark:border-blue-200/30 dark:bg-blue-950/30",
            icon: "text-blue-600 dark:text-blue-400",
            text: "text-blue-700 dark:text-blue-300",
        },
        green: {
            box: "border-green-200 bg-green-50 dark:border-green-200/30 dark:bg-green-950/30",
            icon: "text-green-600 dark:text-green-400",
            text: "text-green-700 dark:text-green-300",
        },
        red: {
            box: "border-red-200 bg-red-50 dark:border-red-200/30 dark:bg-red-950/30",
            icon: "text-red-600 dark:text-red-400",
            text: "text-red-700 dark:text-red-300",
        },
        tip: {
            box: "border-green-200 bg-green-50 dark:border-green-200/30 dark:bg-green-950/30",
            icon: "text-green-600 dark:text-green-400",
            text: "text-green-700 dark:text-green-300",
        }
    } as const;

    // Ensure we use a valid variant
    const safeVariant = variant in variantStyles ? variant : 'blue';
    const Icon = type === 'tip' ? Lightbulb : Info;

    const content = (
        <div
            className={cn(
                "flex rounded-sm border",
                variantStyles[safeVariant].box,
                mini ? "items-center gap-3 p-3 mb-4" : "gap-3 p-4 my-4",
                className
            )}
        >
            {!mini ? (
                <>
                    <Icon className={cn("h-5 w-5 flex-shrink-0 mt-1", variantStyles[safeVariant].icon)} />
                    <div className="flex-1">
                        <h4 className={cn("font-semibold mb-2", variantStyles[safeVariant].icon)}>
                            {title}
                        </h4>
                        <div className={cn("text-[12px] leading-relaxed", variantStyles[safeVariant].text)}>
                            {children}
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <Icon className={cn("h-5 w-5 flex-shrink-0", variantStyles[safeVariant].icon)} />
                    <div className={cn("text-[10px]", variantStyles[safeVariant].text)}>
                        {children}
                        {link && (
                            <span className="border-b border-white/20 hover:border-white/40 ml-1">
                                {link}
                            </span>
                        )}
                    </div>
                </>
            )}
        </div>
    );

    if (link) {
        return (
            <Link to={link}>
                {content}
            </Link>
        );
    }

    return content;
} 