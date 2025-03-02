import { ReactNode } from "react";
import { Helmet } from "react-helmet";
import { Footer } from "@/components/landing/Footer";
import GridSystem from "./grid-system";

interface BlogLayoutProps {
    children: ReactNode;
    title: string;
    description?: string;
}

export function BlogLayout({ children, title, description }: BlogLayoutProps) {
    return (
        <>
            <Helmet>
                <title>{title} | lomi.</title>
                {description && <meta name="description" content={description} />}
            </Helmet>

            <div className="overflow-hidden relative bg-background">
                {/* Grid system for visual enhancement */}
                <GridSystem />

                {/* Main content */}
                <main className="relative z-10 min-h-screen">
                    {children}
                </main>

                {/* Footer */}
                <Footer />
            </div>
        </>
    );
}
