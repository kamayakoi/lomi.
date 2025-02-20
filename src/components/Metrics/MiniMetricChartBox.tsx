import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatCompactNumber } from "@/lib/actions/utils";

interface MiniMetricChartBoxProps {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function MiniMetricChartBox({
  title,
  value,
  prefix = "",
  suffix = "",
  className,
}: MiniMetricChartBoxProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <span className="text-sm text-muted-foreground">{title}</span>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {prefix}
          {formatCompactNumber(value)}
          {suffix}
        </div>
      </CardContent>
    </Card>
  );
}
