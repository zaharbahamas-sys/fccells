import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon?: React.ElementType;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  subtext?: string;
}

export function KPICard({ title, value, unit, icon: Icon, trend, className, subtext }: KPICardProps) {
  return (
    <div className={cn("bg-white rounded-xl p-6 shadow-sm border border-border/50", className)}>
      <div className="flex justify-between items-start mb-4">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
        {Icon && <Icon className="w-5 h-5 text-primary/80" />}
      </div>
      
      <div className="flex items-baseline">
        <h3 className="text-3xl font-bold font-mono tracking-tight text-foreground">
          {value}
        </h3>
        {unit && <span className="ml-1 text-sm font-medium text-muted-foreground">{unit}</span>}
      </div>

      {(trend || subtext) && (
        <div className="mt-2 flex items-center text-sm">
          {trend && (
            <span className={cn(
              "font-medium px-1.5 py-0.5 rounded mr-2",
              trend.isPositive ? "text-emerald-700 bg-emerald-50" : "text-rose-700 bg-rose-50"
            )}>
              {trend.isPositive ? "+" : ""}{trend.value}%
            </span>
          )}
          {subtext && <span className="text-muted-foreground/80 text-xs">{subtext}</span>}
        </div>
      )}
    </div>
  );
}
