import { Card } from "@/components/ui/card";
import { marketData, getPositioning, distributionData } from "@/lib/data";
import {
  PieChart,
  Pie,
  ResponsiveContainer,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { cn } from "@/lib/utils";

export function Benchmarking() {
  const positionColors: Record<string, string> = {
    below: "bg-red-500",
    lower: "bg-amber-500",
    median: "bg-green-500",
    upper: "bg-accent",
    above: "bg-purple-500",
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="mb-12">
        <p className="text-sm font-medium text-accent uppercase tracking-wider mb-2">
          Salary Analysis
        </p>
        <h1 className="text-4xl lg:text-5xl font-display font-bold text-primary mb-4">
          Market Data Results
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Overview of all roles with market ranges.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-white border-0 shadow-md lg:col-span-1">
          <h3 className="font-display font-bold text-xl mb-2">Position Distribution</h3>
          <p className="text-sm text-muted-foreground mb-4">How roles are distributed across pay ranges</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData.filter(d => d.value > 0)}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
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
                <Legend
                  verticalAlign="bottom"
                  formatter={(value) => <span className="text-xs">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 bg-white border-0 shadow-md lg:col-span-3">
          <h3 className="font-display font-bold text-xl mb-6 text-center">Quick Reference Table</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm mx-auto">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left py-4 px-4 font-semibold">Role</th>
                  <th className="text-right py-4 px-4 font-semibold">Current</th>
                  <th className="text-right py-4 px-4 font-semibold">Lower Quartile</th>
                  <th className="text-right py-4 px-4 font-semibold">Median</th>
                  <th className="text-right py-4 px-4 font-semibold">Upper Quartile</th>
                  <th className="text-center py-4 px-4 font-semibold">Position</th>
                </tr>
              </thead>
              <tbody>
                {marketData.map((role, i) => {
                  const pos = getPositioning(role.currentSalary, role.lowerQuartile, role.median, role.upperQuartile);
                  return (
                    <tr 
                      key={role.id} 
                      className={cn(
                        "border-b transition-colors hover:bg-muted/20",
                        i % 2 === 0 ? "bg-white" : "bg-muted/10"
                      )}
                    >
                      <td className="py-4 px-4 font-medium">{role.role}</td>
                      <td className="py-4 px-4 text-right font-semibold text-primary">£{role.currentSalary.toLocaleString()}</td>
                      <td className="py-4 px-4 text-right text-muted-foreground">£{role.lowerQuartile.toLocaleString()}</td>
                      <td className="py-4 px-4 text-right text-muted-foreground">£{role.median.toLocaleString()}</td>
                      <td className="py-4 px-4 text-right text-muted-foreground">£{role.upperQuartile.toLocaleString()}</td>
                      <td className="py-4 px-4">
                        <div className="flex justify-center">
                          <span
                            className={cn(
                              "px-3 py-1 rounded-full text-xs font-medium text-white",
                              positionColors[pos.position]
                            )}
                          >
                            {pos.label}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <div className="flex flex-wrap gap-4 justify-center p-4 bg-white rounded-xl shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-sm text-muted-foreground">Below Market</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <span className="text-sm text-muted-foreground">Lower Quartile</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-sm text-muted-foreground">At Median</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-accent" />
          <span className="text-sm text-muted-foreground">Upper Quartile</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-500" />
          <span className="text-sm text-muted-foreground">Above Market</span>
        </div>
      </div>
    </div>
  );
}
