import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "../../lib/utils";

interface EngagementCardProps {
  title: string;
  value: string;
  trend: number;
  color: "purple" | "orange";
  className?: string;
}

export function EngagementCard({ 
  title, 
  value, 
  trend, 
  color,
  className 
}: EngagementCardProps) {
  const isPositive = trend > 0;
  const bgColor = color === "purple" ? "bg-dashboard-purple" : "bg-dashboard-orange";
  const shadowColor = color === "purple" ? "shadow-purple" : "shadow-orange";

  return (
    <div className={cn(
      "rounded-2xl p-6 text-white relative overflow-hidden transition-all duration-300 hover:scale-105",
      bgColor,
      shadowColor,
      className
    )}>
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path 
            d="M0,20 Q25,10 50,20 T100,20 L100,100 L0,100 Z" 
            fill="currentColor"
          />
        </svg>
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium opacity-90">{title}</h3>
          <div className="flex items-center gap-1">
            {isPositive ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span className="text-xs font-medium">{Math.abs(trend)}%</span>
          </div>
        </div>

        <div className="text-3xl font-bold mb-2">{value}</div>
        
        {/* Mini trend line */}
        <div className="w-full h-8 mt-4">
          <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
            <path 
              d="M0,25 Q15,20 30,22 T60,18 T100,15" 
              stroke="currentColor" 
              strokeWidth="2" 
              fill="none"
              className="opacity-60"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}