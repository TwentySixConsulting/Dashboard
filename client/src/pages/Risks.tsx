import { Card } from "@/components/ui/card";
import { marketData, getPositioning } from "@/lib/data";
import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle2, TrendingUp, TrendingDown, Shield, Target } from "lucide-react";
import logoImage from "@/assets/twentysix-logo.png";

export function Risks() {
  const rolesByPosition = marketData.reduce((acc, role) => {
    const pos = getPositioning(role.currentSalary, role.lowerQuartile, role.median, role.upperQuartile);
    if (!acc[pos.position]) acc[pos.position] = [];
    acc[pos.position].push({ ...role, positioning: pos });
    return acc;
  }, {} as Record<string, any[]>);

  const atOrAboveMedian = [
    ...(rolesByPosition.median || []), 
    ...(rolesByPosition.upperMid || []),
    ...(rolesByPosition.upper || []),
    ...(rolesByPosition.above || [])
  ];
  
  const belowMedian = [
    ...(rolesByPosition.below || []), 
    ...(rolesByPosition.lower || []),
    ...(rolesByPosition.lowerMid || [])
  ];

  const alignedCount = (rolesByPosition.median?.length || 0);
  const aboveCount = (rolesByPosition.upperMid?.length || 0) + (rolesByPosition.upper?.length || 0) + (rolesByPosition.above?.length || 0);
  const belowCount = belowMedian.length;

  const alignedPercentage = Math.round((alignedCount / marketData.length) * 100);
  const abovePercentage = Math.round((aboveCount / marketData.length) * 100);
  const belowPercentage = Math.round((belowCount / marketData.length) * 100);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-sm font-medium text-accent uppercase tracking-wider mb-2">
            Pay Analysis
          </p>
          <h1 className="text-4xl lg:text-5xl font-display font-bold text-primary mb-4">
            Your Strengths & Risks
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Strategic overview of your pay positioning with actionable insights.
          </p>
        </div>
        <img src={logoImage} alt="TwentySix" className="h-10 w-auto hidden lg:block" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-gradient-to-br from-green-600 to-green-500 text-white border-0 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle2 className="w-6 h-6" />
            <span className="font-semibold">At Market Median</span>
          </div>
          <p className="text-5xl font-bold">{alignedPercentage}%</p>
          <p className="text-sm opacity-80 mt-2">{alignedCount} roles at median</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-accent to-blue-500 text-white border-0 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6" />
            <span className="font-semibold">Above Market Median</span>
          </div>
          <p className="text-5xl font-bold">{abovePercentage}%</p>
          <p className="text-sm opacity-80 mt-2">{aboveCount} roles above median</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-amber-500 to-orange-500 text-white border-0 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <TrendingDown className="w-6 h-6" />
            <span className="font-semibold">Below Market Median</span>
          </div>
          <p className="text-5xl font-bold">{belowPercentage}%</p>
          <p className="text-sm opacity-80 mt-2">{belowCount} roles below median</p>
        </Card>
      </div>

      <Card className="p-6 bg-white border-0 shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-accent" />
          <h3 className="font-display font-bold text-xl">Key Observations</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-2">Overall Position</h4>
            <p className="text-sm text-muted-foreground">
              Your organisation's pay positioning is generally competitive with {alignedPercentage + abovePercentage}% of roles at or above market median. This suggests a solid foundation for talent retention. "Above market" means your current salary exceeds the upper quartile, while "below market" indicates it falls short of the lower quartile.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">What This Means</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>Above median:</strong> Strong retention position, may attract talent</li>
              <li>• <strong>At median:</strong> Competitive with market, standard positioning</li>
              <li>• <strong>Below median:</strong> May face recruitment/retention challenges</li>
            </ul>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-white border-0 shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-green-500" />
            <h3 className="font-display font-bold text-xl">Competitive Strengths</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">Roles at or above market median</p>
          <div className="space-y-3">
            {atOrAboveMedian.map((role) => (
              <div key={role.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium">{role.role}</p>
                  <p className="text-xs text-muted-foreground">{role.function}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">£{role.currentSalary.toLocaleString()}</p>
                  <span className={cn(
                    "text-xs px-2 py-0.5 rounded-full",
                    role.positioning.position === "median" ? "bg-green-100 text-green-700" : 
                    role.positioning.position === "above" ? "bg-purple-100 text-purple-700" :
                    "bg-blue-100 text-blue-700"
                  )}>
                    {role.positioning.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 bg-white border-0 shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h3 className="font-display font-bold text-xl">Roles Requiring Attention</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">Positions below market median</p>
          {belowMedian.length > 0 ? (
            <div className="space-y-3">
              {belowMedian.map((role) => {
                const gap = role.median - role.currentSalary;
                return (
                  <div key={role.id} className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold">{role.role}</p>
                        <p className="text-xs text-muted-foreground">{role.function}</p>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-200 text-amber-800">
                        {role.positioning.label}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground text-xs">Current</p>
                        <p className="font-semibold">£{role.currentSalary.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Median</p>
                        <p className="font-semibold">£{role.median.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Gap</p>
                        <p className="font-semibold text-amber-700">£{gap.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center bg-green-50 rounded-lg">
              <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <p className="font-semibold text-green-700">All roles are at or above market median</p>
              <p className="text-sm text-muted-foreground mt-1">No immediate attention required</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
