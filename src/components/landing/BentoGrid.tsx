import { GlobeIcon } from "@radix-ui/react-icons";
import { BentoCard, BentoGrid } from "../ui/bento-grid";
import { CreditCardIcon } from "lucide-react";

const features = [
    {
        Icon: CreditCardIcon,
        name: "Unified Checkout",
        description: "Seamless integration of various payment methods through a single interface.",
        href: "/features/checkout",
        cta: "Learn more",
        background: <img src="/images/checkout-bg.webp" alt="Checkout background" className="absolute -right-20 -top-20 opacity-60" />,
        className: "lg:row-start-1 lg:row-end-3 lg:col-start-1 lg:col-end-2",
    },
    {
        Icon: GlobeIcon,
        name: "Global Reach",
        description: "Expand your business globally with support for international payments.",
        href: "/features/global",
        cta: "Learn more",
        background: <img src="/images/global-bg.webp" alt="Global background" className="absolute -right-20 -top-20 opacity-60" />,
        className: "lg:row-start-3 lg:row-end-4 lg:col-start-2 lg:col-end-3",
    },
    {
        Icon: GlobeIcon,
        name: "Global Reach",
        description: "Expand your business globally with support for international payments.",
        href: "/features/global",
        cta: "Learn more",
        background: <img src="/images/global-bg.webp" alt="Global background" className="absolute -right-20 -top-20 opacity-60" />,
        className: "lg:row-start-3 lg:row-end-4 lg:col-start-2 lg:col-end-3",
    },
    {
        Icon: GlobeIcon,
        name: "Global Reach",
        description: "Expand your business globally with support for international payments.",
        href: "/features/global",
        cta: "Learn more",
        background: <img src="/images/global-bg.webp" alt="Global background" className="absolute -right-20 -top-20 opacity-60" />,
        className: "lg:row-start-3 lg:row-end-4 lg:col-start-2 lg:col-end-3",
    },

];

export const BentoDemo = () => {
    return (
        <BentoGrid className="lg:grid-rows-2 w-full max-w-4xl">
            {features.map((feature) => (
                <BentoCard key={feature.name} {...feature} className="p-6 text-lg" />
            ))}
        </BentoGrid>
    );
};