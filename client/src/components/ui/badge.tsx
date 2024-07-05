import * as React from "react";
import { cn } from "@/lib/utils";
import { badgeVariants, VariantProps } from "../../lib/badge-utils"; // Import from badge-utils

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge };