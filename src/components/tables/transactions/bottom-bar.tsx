import { InfoCircledIcon } from "@radix-ui/react-icons";
import { AnimatePresence, motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface BottomBarProps {
  count: number;
  show: boolean;
  totalAmount?: {
    amount: number;
    currency: string;
  }[];
}

export function BottomBar({ count, show, totalAmount }: BottomBarProps) {
  const multiCurrency = totalAmount && totalAmount.length > 1;
  const first = totalAmount && totalAmount[0];

  const amountPerCurrency =
    totalAmount &&
    totalAmount
      .map((total) =>
        new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: total.currency,
        }).format(total.amount)
      )
      .join(", ");

  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-2 left-0 right-0 flex h-12 justify-center pointer-events-none"
        animate={{ y: show ? 0 : 100 }}
        initial={{ y: 100 }}
      >
        <div className="pointer-events-auto flex h-12 items-center justify-between space-x-2 rounded-full border border-border bg-background/80 px-4 backdrop-blur-lg">
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger className="flex items-center space-x-2">
                <InfoCircledIcon className="text-muted-foreground" />
                <span className="text-sm">
                  {multiCurrency
                    ? "Multiple currencies"
                    : first &&
                    new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: first.currency,
                      maximumFractionDigits: 0,
                      minimumFractionDigits: 0,
                    }).format(first.amount)}
                </span>
              </TooltipTrigger>
              <TooltipContent sideOffset={30} className="px-3 py-1.5 text-xs">
                {multiCurrency
                  ? amountPerCurrency
                  : "Total amount for selected transactions"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <span className="text-sm text-muted-foreground">
            ({count} transactions)
          </span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
