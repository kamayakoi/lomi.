import { CreditCardIcon, ReceiptIcon, Share2Icon } from "lucide-react";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { AnimatedBeamMultipleOutputDemo } from "./AnimatedBeamMultipleOutputs";
import { AnimatedListDemo } from "./AnimatedList";

const features = [
    {
        Icon: Share2Icon,
        name: "Integrations",
        description: "Supports 5+ integrations and counting.",
        href: "#",
        cta: "Learn more",
        className: "col-span-3 lg:col-span-2",
        background: (
            <AnimatedBeamMultipleOutputDemo className="absolute right-2 top-4 h-[300px] border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-105" />
        ),
    },
    {
        Icon: CreditCardIcon,
        name: "Checkout",
        description: "Streamline your customer checkout process with a flexible, customizable interface tailored to your business needs.",
        href: "/features/checkout",
        cta: "Set up your checkout",
        background: (
            <div className="absolute inset-0 overflow-hidden">
                <AnimatedListDemo />
            </div>
        ),
        className: "lg:row-start-1 lg:row-end-3 lg:col-start-1 lg:col-end-2",
    },
    {
        Icon: ReceiptIcon,
        name: "Payment Orchestration",
        description: "Manage all your payments, subscriptions, refunds, and payouts in one single place.",
        href: "/features/transactions",
        cta: "View demo dashboard",
        background: (
            <div className="absolute inset-0 overflow-hidden opacity-25">
                <img src="/portal.png" alt="Portal background" className="object-cover w-full h-5% -ml-1" />
            </div>
        ),
        className: "col-span-3 lg:col-span-2",
    },
];

export function BentoDemo() {
    return (
        <BentoGrid>
            {features.map((feature, idx) => (
                <BentoCard key={idx} {...feature} />
            ))}
        </BentoGrid>
    );
}
