import { CreditCardIcon, ReceiptIcon, Share2Icon } from "lucide-react";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { AnimatedBeamMultipleOutputDemo } from "./AnimatedBeamMultipleOutputs";
import { AnimatedListDemo } from "./AnimatedList";

const features = [
    {
        Icon: Share2Icon,
        name: "Payment channels",
        description: "Supports 5+ providers and more than 10 payment methods and counting.",
        href: "/portal",
        cta: "Get started",
        className: "col-span-3 lg:col-span-2",
        background: (
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-white/20 dark:bg-gray-800/40"></div>
                <AnimatedBeamMultipleOutputDemo className="absolute right-2 top-4 h-[300px] border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_8%,#000_54%)] group-hover:scale-105" />
            </div>
        ),
    },
    {
        Icon: CreditCardIcon,
        name: "Checkout",
        description: "Streamline your customer checkout process with a flexible, customizable interface tailored to your business needs.",
        href: "/portal/payment-channels",
        cta: "Set up your checkout",
        background: (
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-white/20 dark:bg-gray-800/40"></div>
                <AnimatedListDemo className="opacity-90" />
            </div>
        ),
        content: (
            <div className="relative z-10 p-4 bg-white/90 dark:bg-gray-800/60 rounded-lg mt-8">
                <h3 className="text-lg font-semibold mb-2">Checkout</h3>
                <p className="text-sm">
                    Streamline your customer checkout process with a flexible, customizable interface tailored to your business needs.
                </p>
                <a href="/portal/payment-channels" className="text-blue-600 hover:underline mt-2 inline-block">
                    Set up your checkout
                </a>
            </div>
        ),
        className: "lg:row-start-1 lg:row-end-3 lg:col-start-1 lg:col-end-2",
    },
    {
        Icon: ReceiptIcon,
        name: "Orchestration",
        description: "Manage all your payments, subscriptions, payouts and more in one single place.",
        href: "/products",
        cta: "Learn more",
        background: (
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-white/20 dark:bg-gray-800/40"></div>
                <img src="/portal.png" alt="Portal background" className="object-cover w-full h-5% -ml-1 opacity-30" />
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
