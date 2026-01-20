import { Card } from "@/components/ui/card";
import { marketData, getPositioning } from "@/lib/data";
import { cn } from "@/lib/utils";
import { MapPin, Briefcase, TrendingUp, TrendingDown, Minus, Info } from "lucide-react";

function SalaryRangeIndicator({ 
  current, 
  lq, 
  median, 
  uq 
}: { 
  current: number; 
  lq: number; 
  median: number; 
  uq: number;
}) {
  const min = Math.min(lq * 0.9, current * 0.95);
  const max = Math.max(uq * 1.1, current * 1.05);
  const range = max - min;
  
  const lqPos = ((lq - min) / range) * 100;
  const medianPos = ((median - min) / range) * 100;
  const uqPos = ((uq - min) / range) * 100;
  const currentPos = ((current - min) / range) * 100;
  
  const pos = getPositioning(current, lq, median, uq);

  return (
    <div className="mt-4">
      <div className="relative h-8 mb-2">
        <div className="absolute top-3 left-0 right-0 h-2 bg-gradient-to-r from-amber-200 via-green-200 to-blue-200 rounded-full" />
        
        <div 
          className="absolute top-2.5 w-0.5 h-3 bg-gray-400"
          style={{ left: `${lqPos}%` }}
        />
        <div 
          className="absolute top-2.5 w-0.5 h-3 bg-gray-600"
          style={{ left: `${medianPos}%` }}
        />
        <div 
          className="absolute top-2.5 w-0.5 h-3 bg-gray-400"
          style={{ left: `${uqPos}%` }}
        />
        
        <div 
          className="absolute top-0 w-4 h-4 rounded-full border-2 border-white shadow-lg transition-all"
          style={{ 
            left: `calc(${currentPos}% - 8px)`,
            backgroundColor: pos.color 
          }}
        />
      </div>
      
      <div className="relative text-xs text-muted-foreground h-4">
        <span className="absolute" style={{ left: `calc(${lqPos}% - 10px)` }}>LQ</span>
        <span className="absolute" style={{ left: `calc(${medianPos}% - 10px)` }}>Med</span>
        <span className="absolute" style={{ left: `calc(${uqPos}% - 10px)` }}>UQ</span>
      </div>
    </div>
  );
}

export function RoleDetails() {
  const positionColors: Record<string, string> = {
    below: "bg-red-500",
    lower: "bg-amber-500",
    median: "bg-green-500",
    upper: "bg-accent",
    above: "bg-purple-500",
  };

  const positionIcons: Record<string, React.ReactNode> = {
    below: <TrendingDown className="w-4 h-4" />,
    lower: <TrendingDown className="w-4 h-4" />,
    median: <Minus className="w-4 h-4" />,
    upper: <TrendingUp className="w-4 h-4" />,
    above: <TrendingUp className="w-4 h-4" />,
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="mb-12">
        <p className="text-sm font-medium text-accent uppercase tracking-wider mb-2">
          Individual Role Analysis
        </p>
        <h1 className="text-4xl lg:text-5xl font-display font-bold text-primary mb-4">
          Role Details
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Detailed breakdown of each role with market positioning context from our salary survey data.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {marketData.map((role, index) => {
          const pos = getPositioning(role.currentSalary, role.lowerQuartile, role.median, role.upperQuartile);
          const diff = role.currentSalary - role.median;
          const diffPercent = ((diff / role.median) * 100).toFixed(1);
          
          return (
            <Card 
              key={role.id} 
              className={cn(
                "p-6 bg-white border-0 shadow-md hover:shadow-lg transition-all duration-300 opacity-0 animate-slide-up",
                `stagger-${(index % 5) + 1}`
              )}
              data-testid={`role-card-${role.id}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-display font-bold text-lg">{role.role}</h3>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Briefcase className="w-3 h-3" />
                      {role.function}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {role.location}
                    </span>
                  </div>
                </div>
                <span
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium text-white flex items-center gap-1",
                    positionColors[pos.position]
                  )}
                >
                  {positionIcons[pos.position]}
                  {pos.label}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-3 mb-4">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Lower Q</p>
                  <p className="font-semibold text-sm">£{role.lowerQuartile.toLocaleString()}</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Median</p>
                  <p className="font-semibold text-sm">£{role.median.toLocaleString()}</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Upper Q</p>
                  <p className="font-semibold text-sm">£{role.upperQuartile.toLocaleString()}</p>
                </div>
                <div className="text-center p-3 bg-primary/10 rounded-lg border border-primary/20">
                  <p className="text-xs text-primary mb-1">Current</p>
                  <p className="font-bold text-sm text-primary">£{role.currentSalary.toLocaleString()}</p>
                </div>
              </div>

              <SalaryRangeIndicator 
                current={role.currentSalary}
                lq={role.lowerQuartile}
                median={role.median}
                uq={role.upperQuartile}
              />

              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Variance from Median</span>
                  <span className={cn(
                    "font-semibold",
                    diff > 0 ? "text-green-600" : diff < 0 ? "text-red-500" : "text-muted-foreground"
                  )}>
                    {diff > 0 ? "+" : ""}£{diff.toLocaleString()} ({diff > 0 ? "+" : ""}{diffPercent}%)
                  </span>
                </div>
                {role.notes && (
                  <div className="mt-3 p-3 bg-accent/10 rounded-lg flex gap-2">
                    <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground">{role.notes}</p>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
