import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

export function CtaButton({ children }: { children: React.ReactNode }) {
  return (
    <Link to="https://app.midday.ai">
      <Button
        className="mt-12 h-11 space-x-2 items-center py-2"
        variant="outline"
      >
        <span>{children}</span>
        <ArrowUpRight />
      </Button>
    </Link>
  );
}
