import { cn } from '@/lib/actions/utils';
import { Button } from '@/components/ui/button';
import { ChevronLeft, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NavItem {
    id: string;
    label: string;
}

interface SideNavProps {
    items: NavItem[];
    activeSection: string;
    onSectionClick: (id: string) => void;
    showCloseButton?: boolean;
}

export default function SideNav({ items, activeSection, onSectionClick, showCloseButton = false }: SideNavProps) {
    const navigate = useNavigate();

    const handleClose = () => {
        if (typeof window !== 'undefined') {
            window.close();
        }
    };

    return (
        <div className="fixed left-0 bottom-25 hidden h-screen w-80 lg:block">
            <div className="flex h-full flex-col overflow-hidden">
                {/* Back or Close button */}
                <div className="absolute top-15 left-15">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-10 left-10 inline-flex items-center justify-center bg-gray-100 hover:bg-gray-200 dark:bg-black/50 text-gray-700 hover:text-gray-900 dark:text-sage-100 dark:hover:text-sage-200 dark:hover:bg-zinc-900 dark:border-zinc-800 border border-gray-200 h-10 w-10 rounded-none transition-colors"
                        onClick={showCloseButton ? handleClose : () => navigate(-1)}
                        aria-label={showCloseButton ? "Close page" : "Go back"}
                    >
                        {showCloseButton ? (
                            <X className="h-5 w-5" />
                        ) : (
                            <ChevronLeft className="h-5 w-5" />
                        )}
                    </Button>
                </div>

                {/* Top padding for header space */}
                <div className="h-24" />

                {/* Scrollable navigation */}
                <nav className="flex-1 space-y-2 overflow-y-hidden p-6 pl-8 pb-36"> {/* Added left padding and bottom padding for scrolling */}
                    {items.map((item) => (
                        <Button
                            key={item.id}
                            variant="ghost"
                            className={cn(
                                'w-full justify-start text-left font-normal',
                                activeSection === item.id
                                    ? 'bg-zinc-100 dark:bg-zinc-800 font-medium text-foreground'
                                    : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-muted-foreground hover:text-foreground'
                            )}
                            onClick={() => onSectionClick(item.id)}
                        >
                            {item.label}
                        </Button>
                    ))}
                </nav>
            </div>
        </div>
    );
} 