import { cn } from '@/lib/actions/utils'
import { IconCode, IconPhone } from '@tabler/icons-react'

interface SidebarActionButtonProps {
    variant: 'developers' | 'book-call'
    onClick?: () => void
}

export function SidebarActionButton({ variant, onClick }: SidebarActionButtonProps) {
    const getIcon = () => {
        switch (variant) {
            case 'developers':
                return <IconCode size={16} className="text-emerald-500" />
            case 'book-call':
                return <IconPhone size={16} className="text-orange-500" />
        }
    }

    const getLabel = () => {
        switch (variant) {
            case 'developers':
                return 'Documentation'
            case 'book-call':
                return 'Talk to us'
        }
    }

    return (
        <button
            onClick={onClick}
            className={cn(
                'group flex h-7 w-full items-center gap-2 rounded-sm px-3',
                'text-[13px] font-medium text-[hsl(var(--sidebar-foreground))]/90',
                'transition-all duration-200 hover:bg-[hsl(var(--sidebar-accent))]/10',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--sidebar-ring))]'
            )}
        >
            <div className="scale-[0.85]">{getIcon()}</div>
            <span className="truncate">{getLabel()}</span>
        </button>
    )
} 