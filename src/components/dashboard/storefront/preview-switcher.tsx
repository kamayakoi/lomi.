import { cn } from "@/lib/actions/utils"

interface PreviewSwitcherProps {
    activeView: string
    onChange: (view: string) => void
}

export function PreviewSwitcher({ activeView, onChange }: PreviewSwitcherProps) {
    const views = [
        { id: 'storefront', label: 'Storefront' },
        { id: 'checkout', label: 'Checkout' },
        { id: 'confirmation', label: 'Confirmation' },
        // { id: 'portal', label: 'Portal' },
    ]

    return (
        <div className="flex items-center justify-center mb-8 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <nav className="flex space-x-2 p-1 rounded-lg bg-muted">
                {views.map((view) => (
                    <button
                        key={view.id}
                        onClick={() => onChange(view.id)}
                        className={cn(
                            "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                            activeView === view.id
                                ? "bg-background text-foreground"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        {view.label}
                    </button>
                ))}
            </nav>
        </div>
    )
}

