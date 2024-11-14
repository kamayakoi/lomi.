import { CreditCardIcon, ReceiptIcon, Share2Icon } from "lucide-react";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { AnimatedBeamMultipleOutputDemo } from "./AnimatedBeamMultipleOutputs";
import { AnimatedListDemo } from "./AnimatedList";
import { useTranslation } from 'react-i18next';

export function BentoDemo() {
    const { t } = useTranslation();

    const features = [
        {
            Icon: Share2Icon,
            name: t('bentoGrid.paymentChannels'),
            description: t('bentoGrid.paymentChannelsDescription'),
            href: "/portal",
            cta: t('bentoGrid.getStarted'),
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
            name: t('bentoGrid.checkout'),
            description: t('bentoGrid.checkoutDescription'),
            href: "/portal/payment-channels",
            cta: t('bentoGrid.setUpYourCheckout'),
            background: (
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute inset-0 bg-white/20 dark:bg-gray-800/40"></div>
                    <AnimatedListDemo className="opacity-90" />
                </div>
            ),
            className: "lg:row-start-1 lg:row-end-3 lg:col-start-1 lg:col-end-2",
        },
        {
            Icon: ReceiptIcon,
            name: t('bentoGrid.orchestration'),
            description: t('bentoGrid.orchestrationDescription'),
            href: "/products",
            cta: t('bentoGrid.learnMore'),
            background: (
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute inset-0 bg-white/20 dark:bg-gray-800/40"></div>
                    <img
                        src="/portal.webp"
                        alt="Portal background"
                        className="object-cover w-full h-5% -ml-1 opacity-30"
                        width="1280"
                        height="720"
                    />
                </div>
            ),
            className: "col-span-3 lg:col-span-2",
        },
    ];

    return (
        <BentoGrid>
            {features.map((feature, idx) => (
                <BentoCard
                    key={idx}
                    Icon={feature.Icon}
                    name={feature.name}
                    description={feature.description}
                    href={feature.href}
                    cta={feature.cta}
                    className={feature.className}
                    background={feature.background}
                />
            ))}
        </BentoGrid>
    );
}
