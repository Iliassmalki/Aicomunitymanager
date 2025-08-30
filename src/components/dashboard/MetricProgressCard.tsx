import { Progress } from "../../components/ui/progress";
import { cn } from "../../lib/utils";

interface MetricProgressCardProps {
  label: string;
  value: number;
  maxValue: number;
  color: string;
  className?: string;
}

export function MetricProgressCard({ 
  label, 
  value, 
  maxValue, 
  color,
  className 
}: MetricProgressCardProps) {
  const percentage = (value / maxValue) * 100;

  return (
    <div className={cn(
      "flex items-center justify-between py-4",
      className
    )}>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">{label}</span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-foreground">{value.toLocaleString()}</span>
            <span className="text-xs text-muted-foreground">/{maxValue.toLocaleString()}</span>
          </div>
        </div>
        <Progress 
          value={percentage} 
          className="h-2"
        />
      </div>
    </div>
  );
}