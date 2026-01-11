import { Card } from "@/components/ui/card";
import { benchmarkData, getPositioning, distributionData } from "@/lib/data";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";
import { cn } from "@/lib/utils";

export function Benchmarking() {
  const chartData = benchmarkData.map((role) => {
    const pos = getPositioning(role.currentSalary, role.lowerQuartile, role.median, role.upperQuartile);
    return {
      name: role.role.length > 20 ? role.role.substring(0, 20) + "..." : role.role,
      fullName: role.role,
      current: role.currentSalary,
      lowerQuartile: role.lowerQuartile,
      median: role.median,
      upperQuartile: role.upperQuartile,
      position: pos.position,
      color: pos.color,
    };
  });

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
          Role Benchmarking Results
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Overview of all benchmarked roles with market positioning indicators.
        </p>
      </div>

      <Card className="p-6 bg-white border-0 shadow-md">
        <h3 className="font-display font-bold text-xl mb-2">Salary Comparison Overview</h3>
        <p className="text-sm text-muted-foreground mb-6">Current salary vs market quartiles</p>
        <div className="h-[420px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={true} vertical={false} />
              <XAxis
                type="number"
                tick={{ fontSize: 11 }}
                stroke="#94a3b8"
                tickFormatter={(v) => `£${(v / 1000).toFixed(0)}k`}
              />
              <YAxis
                dataKey="name"
                type="category"
                tick={{ fontSize: 11 }}
                stroke="#94a3b8"
                width={160}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "none",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
                formatter={(value: number, name: string) => [
                  `£${value.toLocaleString()}`,
                  name === "current" ? "Current" : name === "lowerQuartile" ? "Lower Quartile" : name === "median" ? "Median" : "Upper Quartile"
                ]}
                labelFormatter={(label) => chartData.find(d => d.name === label)?.fullName || label}
              />
              <Bar dataKey="lowerQuartile" name="Lower Quartile" fill="hsl(220, 15%, 80%)" radius={[0, 0, 0, 0]} barSize={12} />
              <Bar dataKey="median" name="Median" fill="hsl(220, 15%, 70%)" radius={[0, 0, 0, 0]} barSize={12} />
              <Bar dataKey="upperQuartile" name="Upper Quartile" fill="hsl(220, 15%, 60%)" radius={[0, 0, 0, 0]} barSize={12} />
              <Bar dataKey="current" name="Current Salary" radius={[0, 4, 4, 0]} barSize={12}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap gap-4 mt-6 justify-center border-t pt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-[hsl(220,15%,80%)]" />
            <span className="text-xs text-muted-foreground">Lower Quartile</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-[hsl(220,15%,70%)]" />
            <span className="text-xs text-muted-foreground">Median</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-[hsl(220,15%,60%)]" />
            <span className="text-xs text-muted-foreground">Upper Quartile</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-green-500" />
            <span className="text-xs text-muted-foreground">Current (At Median)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-accent" />
            <span className="text-xs text-muted-foreground">Current (Upper)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-amber-500" />
            <span className="text-xs text-muted-foreground">Current (Lower)</span>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 bg-white border-0 shadow-md lg:col-span-1">
          <h3 className="font-display font-bold text-xl mb-2">Position Distribution</h3>
          <p className="text-sm text-muted-foreground mb-4">How roles are distributed across quartiles</p>
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

        <Card className="p-6 bg-white border-0 shadow-md lg:col-span-2">
          <h3 className="font-display font-bold text-xl mb-4">Quick Reference Table</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 font-semibold">Role</th>
                  <th className="text-right py-3 px-2 font-semibold">Current</th>
                  <th className="text-right py-3 px-2 font-semibold">LQ</th>
                  <th className="text-right py-3 px-2 font-semibold">Median</th>
                  <th className="text-right py-3 px-2 font-semibold">UQ</th>
                  <th className="text-center py-3 px-2 font-semibold">Position</th>
                </tr>
              </thead>
              <tbody>
                {benchmarkData.map((role, i) => {
                  const pos = getPositioning(role.currentSalary, role.lowerQuartile, role.median, role.upperQuartile);
                  return (
                    <tr key={role.id} className={cn("border-b", i % 2 === 0 ? "bg-muted/30" : "")}>
                      <td className="py-2.5 px-2 font-medium">{role.role}</td>
                      <td className="py-2.5 px-2 text-right">£{role.currentSalary.toLocaleString()}</td>
                      <td className="py-2.5 px-2 text-right text-muted-foreground">£{role.lowerQuartile.toLocaleString()}</td>
                      <td className="py-2.5 px-2 text-right text-muted-foreground">£{role.median.toLocaleString()}</td>
                      <td className="py-2.5 px-2 text-right text-muted-foreground">£{role.upperQuartile.toLocaleString()}</td>
                      <td className="py-2.5 px-2">
                        <div className="flex justify-center">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded-full text-xs font-medium text-white",
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
    </div>
  );
}
