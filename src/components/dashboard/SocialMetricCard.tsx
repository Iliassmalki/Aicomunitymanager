import { cn } from "../../lib/utils";
import { Icon } from "lucide-react";

interface SocialMetricCardProps {
  platform: string;
  followers: string;
  icon: Icon;
  color: string;
  growth?: string;
  className?: string;
  label?: string;
}

export function SocialMetricCard({ 
  platform, 
  followers, 
  icon: Icon, 
  color,
  growth,
  className,
  label 
}: SocialMetricCardProps) {
  return (
    <div className={cn(
      "bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-border",
      className
    )}>
      <div className="flex items-center justify-between mb-4">
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center text-white",
          color
        )}>
          <Icon className="w-6 h-6" />
        </div>
        {growth && (
          <span className="text-xs text-metric-success font-medium bg-metric-success/10 px-2 py-1 rounded-full">
            {growth}
          </span>
        )}
      </div>
      
      <div className="space-y-1">
        <h3 className="text-2xl font-bold text-foreground">{followers}</h3>
        <p className="text-sm text-muted-foreground">{label || platform}</p>
      </div>
    </div>
  );
}