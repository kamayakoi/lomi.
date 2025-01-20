import { cn } from '@/lib/actions/utils';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NavItem {
    id: string;
    label: string;
}

interface SideNavProps {
    items: NavItem[];
    activeSection: string;
    onSectionClick: (id: string) => void;
}

export default function SideNav({ items, activeSection, onSectionClick }: SideNavProps) {
    const navigate = useNavigate();

    return (
        <div className="fixed left-0 bottom-25 hidden h-screen w-80 lg:block">
            <div className="flex h-full flex-col overflow-hidden">
                {/* Back button */}
                <div className="absolute top-10 left-10">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(-1)}
                    >
                        <ChevronLeft className="h-6 w-6" />
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