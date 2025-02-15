import { cn } from "@/lib/actions/utils";
import { AnimatedList } from "@/components/ui/animated-list";
import { useTranslation } from 'react-i18next';

interface Item {
    name: string;
    description: string;
    icon: string;
    color: string;
    time: string;
    amount?: string;
}

const Notification = ({ name, description, icon, color, time, amount }: Item) => {
    return (
        <figure
            className={cn(
                "relative mx-auto min-h-fit w-full max-w-[400px] cursor-pointer overflow-hidden rounded-2xl p-4",
                // animation styles
                "transition-all duration-2000 ease-in-out hover:scale-[103%]",
                // light styles
                "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
                // dark styles
                "transform-gpu dark:bg-transparent dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
            )}
        >
            <div className="flex flex-row items-center gap-3">
                <div
                    className="flex size-10 items-center justify-center rounded-2xl"
                    style={{
                        backgroundColor: color,
                    }}
                >
                    <span className="text-lg">{icon}</span>
                </div>
                <div className="flex flex-1 flex-col overflow-hidden">
                    <figcaption className="flex flex-row items-center whitespace-pre text-lg font-medium dark:text-white">
                        <span className="truncate text-sm sm:text-lg">{name}</span>
                        <span className="mx-1">·</span>
                        <span className="text-xs text-gray-500 mt-1">{time}</span>
                    </figcaption>
                    <div className="flex items-center justify-between">
                        <p className="truncate text-sm font-normal dark:text-white/60">
                            {description}
                        </p>
                        {amount && (
                            <div className="ml-2 flex min-w-[100px] max-w-[120px] items-center justify-center rounded-lg bg-green-100 px-2 py-1 text-sm font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                                {amount}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </figure>
    );
};

export function AnimatedListDemo({ className }: { className?: string }) {
    const { t } = useTranslation();

    let notifications = [
        {
            name: t('animatedList.paymentReceived'),
            description: "ashantishoes.com",
            time: t('animatedList.minutesAgo', { minutes: 12 }),
            icon: "💸",
            color: "#00A0FF",
            amount: "33,000 XOF",
        },
        {
            name: t('animatedList.newMonthlySubscriber'),
            description: "The African Ledger",
            time: t('animatedList.minutesAgo', { minutes: 10 }),
            icon: "🎉",
            color: "#FFB800",
            amount: "7,500 XOF",
        },
        {
            name: t('animatedList.payoutProcessed'),
            description: "ashantishoes.com",
            time: t('animatedList.minutesAgo', { minutes: 42 }),
            icon: "🏦",
            color: "#A7F3D0",
            amount: "88,745 XOF",
        },
        {
            name: t('animatedList.paymentReceived'),
            description: "ashantishoes.com",
            time: t('animatedList.minutesAgo', { minutes: 5 }),
            icon: "💸",
            color: "#00A0FF",
            amount: "53,500 XOF",
        },
        {
            name: t('animatedList.payoutProcessed'),
            description: "The African Ledger",
            time: t('animatedList.minutesAgo', { minutes: 42 }),
            icon: "🏦",
            color: "#A7F3D0",
            amount: "250,000 XOF",
        },
    ];

    notifications = Array.from({ length: 10 }, () => notifications).flat();

    return (
        <div
            className={cn(
                "relative flex h-[500px] w-full flex-col p-6 overflow-hidden rounded-lg border bg-background md:shadow-xl",
                className,
            )}
        >
            <AnimatedList delay={9000}>
                {notifications.map((item, idx) => (
                    <Notification key={idx} {...item} />
                ))}
            </AnimatedList>
        </div>
    );
}
