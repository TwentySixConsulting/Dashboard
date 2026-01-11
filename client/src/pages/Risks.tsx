import { Card } from "@/components/ui/card";
import { benchmarkData, getPositioning } from "@/lib/data";
import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle2, TrendingUp, TrendingDown, Shield, Target } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

export function Risks() {
  const rolesByPosition = benchmarkData.reduce((acc, role) => {
    const pos = getPositioning(role.currentSalary, role.lowerQuartile, role.median, role.upperQuartile);
    if (!acc[pos.position]) acc[pos.position] = [];
    acc[pos.position].push({ ...role, positioning: pos });
    return acc;
  }, {} as Record<string, any[]>);

  const strengths = [...(rolesByPosition.median || []), ...(rolesByPosition.upper || [])];
  const risks = [...(rolesByPosition.below || []), ...(rolesByPosition.lower || [])];
  const above = rolesByPosition.above || [];

  const distributionData = [
    { name: "Below Median", value: risks.length, color: "hsl(35, 90%, 55%)" },
    { name: "At Median", value: (rolesByPosition.median || []).length, color: "hsl(160, 70%, 45%)" },
    { name: "Above Median", value: strengths.filter(r => r.positioning.position === "upper").length + above.length, color: "hsl(200, 85%, 55%)" },
  ];

  const alignedPercentage = Math.round(((rolesByPosition.median?.length || 0) / benchmarkData.length) * 100);
  const abovePercentage = Math.round((((rolesByPosition.upper?.length || 0) + above.length) / benchmarkData.length) * 100);
  const belowPercentage = Math.round((risks.length / benchmarkData.length) * 100);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="mb-12">
        <p className="text-sm font-medium text-accent uppercase tracking-wider mb-2">
          Pay Analysis
        </p>
        <h1 className="text-4xl lg:text-5xl font-display font-bold text-primary mb-4">
          Strengths & Risks Summary
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Strategic overview of your pay positioning with actionable insights.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-gradient-to-br from-green-600 to-green-500 text-white border-0 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle2 className="w-6 h-6" />
            <span className="font-semibold">Market Aligned</span>
          </div>
          <p className="text-5xl font-bold">{alignedPercentage}%</p>
          <p className="text-sm opacity-80 mt-2">{rolesByPosition.median?.length || 0} roles at median</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-accent to-blue-500 text-white border-0 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6" />
            <span className="font-semibold">Above Market</span>
          </div>
          <p className="text-5xl font-bold">{abovePercentage}%</p>
          <p className="text-sm opacity-80 mt-2">{(rolesByPosition.upper?.length || 0) + above.length} roles above median</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-amber-500 to-orange-500 text-white border-0 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <TrendingDown className="w-6 h-6" />
            <span className="font-semibold">Below Market</span>
          </div>
          <p className="text-5xl font-bold">{belowPercentage}%</p>
          <p className="text-sm opacity-80 mt-2">{risks.length} roles below median</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 bg-white border-0 shadow-md">
          <h3 className="font-display font-bold text-xl mb-4">Distribution Overview</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData.filter(d => d.value > 0)}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {distributionData.filter(d => d.value > 0).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "none",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  formatter={(value: number) => [`${value} roles`]}
                />
                <Legend verticalAlign="bottom" formatter={(value) => <span className="text-xs">{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 bg-white border-0 shadow-md lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-green-500" />
            <h3 className="font-display font-bold text-xl">Competitive Strengths</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">Roles competitively positioned in the market</p>
          <div className="space-y-3">
            {strengths.map((role) => (
              <div key={role.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium">{role.role}</p>
                  <p className="text-xs text-muted-foreground">{role.function}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">£{role.currentSalary.toLocaleString()}</p>
                  <span className={cn(
                    "text-xs px-2 py-0.5 rounded-full",
                    role.positioning.position === "median" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                  )}>
                    {role.positioning.label}
                  </span>
                </div>
              </div>
            ))}
            {above.map((role) => (
              <div key={role.id} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div>
                  <p className="font-medium">{role.role}</p>
                  <p className="text-xs text-muted-foreground">{role.function}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-purple-600">£{role.currentSalary.toLocaleString()}</p>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                    Above Market
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {risks.length > 0 && (
        <Card className="p-6 bg-white border-0 shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h3 className="font-display font-bold text-xl">Roles Requiring Attention</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">Positions below market median that may face recruitment or retention pressure</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {risks.map((role) => {
              const gap = role.median - role.currentSalary;
              return (
                <div key={role.id} className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold">{role.role}</p>
                      <p className="text-xs text-muted-foreground">{role.function}</p>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-200 text-amber-800">
                      {role.positioning.label}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground text-xs">Current</p>
                      <p className="font-semibold">£{role.currentSalary.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Market Median</p>
                      <p className="font-semibold">£{role.median.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-amber-200">
                    <p className="text-sm">
                      <span className="text-muted-foreground">Gap to median: </span>
                      <span className="font-semibold text-amber-700">£{gap.toLocaleString()}</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      <Card className="p-6 bg-white border-0 shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-accent" />
          <h3 className="font-display font-bold text-xl">Key Observations</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-2">Overall Position</h4>
            <p className="text-sm text-muted-foreground">
              Your organisation's pay positioning is generally competitive with {alignedPercentage + abovePercentage}% of roles at or above market median. This suggests a solid foundation for talent retention.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Recommended Actions</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Review roles below median as priority for next pay review</li>
              <li>• Consider total reward value for highly competitive roles</li>
              <li>• Monitor market movements in technical/specialist areas</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
