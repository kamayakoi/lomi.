import { Button } from "@/components/ui/button";
import { UpdateIcon } from "@radix-ui/react-icons";
import { AnimatePresence, motion } from "framer-motion";

interface ExportBarProps {
  selected: number;
  onExport?: () => void;
  onDeselect?: () => void;
  isExporting?: boolean;
}

export function ExportBar({
  selected,
  onExport,
  onDeselect,
  isExporting = false,
}: ExportBarProps) {
  const isOpen = selected > 0;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-2 left-[50%] w-[400px] -ml-[200px]"
        animate={{ y: isOpen ? 0 : 100 }}
        initial={{ y: 100 }}
      >
        <div className="mx-2 md:mx-0 flex h-12 items-center justify-between rounded-full border border-border bg-background/80 px-4 backdrop-blur-lg">
          <span className="text-sm">{selected} selected</span>

          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={onDeselect}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Deselect all
            </button>
            <Button
              size="sm"
              onClick={onExport}
              disabled={isExporting}
              className="h-8 text-sm"
            >
              {isExporting ? (
                <UpdateIcon className="h-4 w-4 animate-spin" />
              ) : (
                `Export (${selected})`
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
