export function Logo() {
    return (
        <div className="flex items-center gap-4">
            <div className="relative w-[50px] h-[50px] rounded-sm overflow-hidden bg-zinc-900">
                <img
                    src="/transparent.webp"
                    alt="Lomi Logo"
                    className="object-cover"
                    fetchPriority="high"
                />
            </div>
            <span className="text-white text-lg font-medium">lomi.</span>
        </div>
    )
} 