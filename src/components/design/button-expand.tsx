import { ArrowRight, LucideIcon, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ButtonExpandProps {
    text: string;
    icon?: LucideIcon;
    bgColor?: string;
    textColor?: string;
    hoverBgColor?: string;
    hoverTextColor?: string;
    onClick?: () => void;
}

function ButtonExpand({
    text,
    icon: Icon = ArrowRight,
    bgColor = "bg-green-50 dark:bg-green-900/30",
    textColor = "text-green-700 dark:text-green-300",
    hoverBgColor = "hover:bg-green-100 dark:hover:bg-green-900/40",
    hoverTextColor = "hover:text-green-800 dark:hover:text-green-200",
    onClick
}: ButtonExpandProps) {
    return (
        <Button
            variant="expandIcon"
            Icon={() => <Icon className="h-4 w-4" />}
            iconPlacement="right"
            className={`text-sm sm:text-base font-medium ${textColor} ${hoverTextColor} ${bgColor} ${hoverBgColor} shadow-lg transition-all duration-300 h-11 sm:h-10 px-4 sm:px-4`}
            onClick={onClick}
        >
            {text}
        </Button>
    )
}

// Pre-configured button for Connect action
function ButtonExpandIconRight() {
    return (
        <ButtonExpand
            text="Connect"
            onClick={() => window.location.href = '/sign-in'}
        />
    )
}

// Pre-configured button for Talk to us action
function ButtonExpandTalkToUs() {
    return (
        <ButtonExpand
            text="Talk to us"
            icon={Phone}
            bgColor="bg-blue-50 dark:bg-blue-900/30"
            textColor="text-blue-700 dark:text-blue-300"
            hoverBgColor="hover:bg-blue-100 dark:hover:bg-blue-900/40"
            hoverTextColor="hover:text-blue-800 dark:hover:text-blue-200"
            onClick={() => window.open('https://cal.com/babacar-diop-umkvq2/30min', '_blank')}
        />
    )
}

export {
    ButtonExpand,
    ButtonExpandIconRight,
    ButtonExpandTalkToUs
} 