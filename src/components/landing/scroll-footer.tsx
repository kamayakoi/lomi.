import { useEffect, useState } from "react";
import { cn } from "@/lib/actions/utils";
import { Footer } from "@/components/landing/footer.tsx";

export function ScrollFooter() {
    const [isVisible, setIsVisible] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const scrolled = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const maxScroll = documentHeight - windowHeight;

            // Calculate scroll progress (0 to 1)
            const progress = Math.min(scrolled / 100, 1);
            setScrollProgress(progress);

            // Show footer when scrolled to bottom or near bottom
            if (scrolled > maxScroll - windowHeight) {
                setIsVisible(true);
            } else if (scrolled < 20) {
                setIsVisible(true); // Also show at top
            } else {
                setIsVisible(false);
            }
        };

        // Initial check
        handleScroll();

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div
            className={cn(
                "transition-all duration-500 ease-in-out",
                isVisible ? "opacity-100" : "opacity-0"
            )}
            style={{
                opacity: isVisible ? 1 : Math.min(scrollProgress * 2, 1)
            }}
        >
            <Footer />
        </div>
    );
} 