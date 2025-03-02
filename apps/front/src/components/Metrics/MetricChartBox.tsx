import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/actions/utils";
import { formatCompactNumber } from "@/lib/actions/utils";

interface MetricChartBoxProps {
  title: string;
  value: number;
  change?: number;
  isLoading?: boolean;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export function MetricChartBox({
  title,
  value,
  change,
  isLoading,
  className,
  prefix = "",
  suffix = "",
}: MetricChartBoxProps) {
  if (isLoading) {
    return (
      <Card className={cn("", className)}>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-4 w-24" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-8 w-36" />
            <Skeleton className="h-4 w-24" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const formattedValue = formatCompactNumber(value);
  const isPositiveChange = change && change > 0;

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-2xl font-bold">
            {prefix}
            {formattedValue}
            {suffix}
          </div>
          {change !== undefined && (
            <p
              className={cn(
                "text-xs",
                isPositiveChange ? "text-green-600" : "text-red-600"
              )}
            >
              {isPositiveChange ? "+" : ""}
              {change.toFixed(2)}% from last period
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
