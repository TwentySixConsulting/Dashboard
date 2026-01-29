import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { marketData } from "@/lib/data";
import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle2, Download, PieChart, Target, Info } from "lucide-react";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import logoImage from "@/assets/twentysix-logo.png";

type PositionBand = "belowLQ" | "lqToMedian" | "medianToUQ" | "aboveUQ";

interface BandInfo {
  band: PositionBand;
  label: string;
  color: string;
}

const bandConfig: Record<PositionBand, BandInfo> = {
  belowLQ: { band: "belowLQ", label: "Below lower quartile", color: "#64748b" },
  lqToMedian: { band: "lqToMedian", label: "Lower quartile → median", color: "#6366f1" },
  medianToUQ: { band: "medianToUQ", label: "Median → upper quartile", color: "#06b6d4" },
  aboveUQ: { band: "aboveUQ", label: "Above upper quartile", color: "#14b8a6" },
};

function getPositionBand(actual: number, lq: number, median: number, uq: number): PositionBand {
  if (actual < lq) return "belowLQ";
  if (actual < median) return "lqToMedian";
  if (actual <= uq) return "medianToUQ";
  return "aboveUQ";
}

export function Risks() {
  const rolesWithBands = marketData.map((role) => ({
    ...role,
    band: getPositionBand(role.currentSalary, role.lowerQuartile, role.median, role.upperQuartile),
  }));

  const bandCounts = rolesWithBands.reduce((acc, role) => {
    acc[role.band] = (acc[role.band] || 0) + 1;
    return acc;
  }, {} as Record<PositionBand, number>);

  const totalRoles = marketData.length;

  const distributionData = (Object.keys(bandConfig) as PositionBand[]).map((band) => ({
    name: bandConfig[band].label,
    value: bandCounts[band] || 0,
    color: bandConfig[band].color,
    percentage: Math.round(((bandCounts[band] || 0) / totalRoles) * 100),
  }));

  const marketCoreCount = (bandCounts.lqToMedian || 0) + (bandCounts.medianToUQ || 0);
  const marketCorePercentage = Math.round((marketCoreCount / totalRoles) * 100);
  const outlierCount = (bandCounts.belowLQ || 0) + (bandCounts.aboveUQ || 0);

  const rolesByBand = {
    belowLQ: rolesWithBands.filter((r) => r.band === "belowLQ"),
    lqToMedian: rolesWithBands.filter((r) => r.band === "lqToMedian"),
    medianToUQ: rolesWithBands.filter((r) => r.band === "medianToUQ"),
    aboveUQ: rolesWithBands.filter((r) => r.band === "aboveUQ"),
  };

  const downloadCSV = () => {
    const headers = ["Role", "Function", "Current Salary", "Lower Quartile", "Median", "Upper Quartile", "Position Band"];
    const rows = rolesWithBands.map((role) => [
      role.role,
      role.function,
      role.currentSalary,
      role.lowerQuartile,
      role.median,
      role.upperQuartile,
      bandConfig[role.band].label,
    ]);

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "position_distribution_data.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-sm font-medium text-accent uppercase tracking-wider mb-2">
            Pay Analysis
          </p>
          <h1 className="text-4xl lg:text-5xl font-display font-bold text-primary mb-4">
            Position Distribution
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            How your roles are distributed across market pay ranges.
          </p>
        </div>
        <img src={logoImage} alt="TwentySix" className="h-10 w-auto hidden lg:block" style={{ opacity: 1 }} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {(Object.keys(bandConfig) as PositionBand[]).map((band) => (
          <Card
            key={band}
            className="p-5 text-white border-0 shadow-md"
            style={{ background: `linear-gradient(135deg, ${bandConfig[band].color} 0%, ${bandConfig[band].color}dd 100%)` }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <PieChart className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-bold">{bandCounts[band] || 0}</p>
            <p className="text-sm font-medium text-white/90 mt-1">{bandConfig[band].label}</p>
            <p className="text-xs text-white/60 mt-0.5">
              {Math.round(((bandCounts[band] || 0) / totalRoles) * 100)}% of roles
            </p>
          </Card>
        ))}
      </div>

      <Card className="p-6 bg-white border-0 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-accent" />
            <h3 className="font-display font-bold text-xl">Market Position Summary</h3>
          </div>
          <Button variant="outline" size="sm" onClick={downloadCSV} className="gap-2">
            <Download className="w-4 h-4" />
            Download CSV
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percentage }) => `${percentage}%`}
                  labelLine={false}
                >
                  {distributionData.map((entry, index) => (
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
                  formatter={(value: number, name: string) => [`${value} roles`, name]}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distributionData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={true} vertical={false} />
                <XAxis type="number" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fontSize: 11 }}
                  stroke="#94a3b8"
                  width={150}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "none",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  formatter={(value: number) => [`${value} roles`, "Count"]}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-slate-500 mt-0.5" />
            <div className="space-y-2">
              <p className="text-sm text-slate-700">
                <span className="font-semibold">{marketCorePercentage}%</span> of roles sit within the market core (between lower quartile and upper quartile).
              </p>
              <p className="text-sm text-slate-600">
                <span className="font-semibold">{outlierCount}</span> {outlierCount === 1 ? "role is" : "roles are"} positioned outside the market core (below LQ or above UQ).
              </p>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-white border-0 shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: bandConfig.medianToUQ.color }} />
            <h3 className="font-display font-bold text-xl">Median → Upper Quartile</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">Roles positioned between market median and upper quartile</p>
          {rolesByBand.medianToUQ.length > 0 ? (
            <div className="space-y-3">
              {rolesByBand.medianToUQ.map((role) => (
                <div key={role.id} className="flex items-center justify-between p-3 bg-cyan-50 rounded-lg">
                  <div>
                    <p className="font-medium">{role.role}</p>
                    <p className="text-xs text-muted-foreground">{role.function}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-cyan-700">£{role.currentSalary.toLocaleString()}</p>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-700">
                      {bandConfig.medianToUQ.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">No roles in this band</p>
          )}
        </Card>

        <Card className="p-6 bg-white border-0 shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: bandConfig.lqToMedian.color }} />
            <h3 className="font-display font-bold text-xl">Lower Quartile → Median</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">Roles positioned between lower quartile and market median</p>
          {rolesByBand.lqToMedian.length > 0 ? (
            <div className="space-y-3">
              {rolesByBand.lqToMedian.map((role) => (
                <div key={role.id} className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
                  <div>
                    <p className="font-medium">{role.role}</p>
                    <p className="text-xs text-muted-foreground">{role.function}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-indigo-700">£{role.currentSalary.toLocaleString()}</p>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                      {bandConfig.lqToMedian.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">No roles in this band</p>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-white border-0 shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: bandConfig.aboveUQ.color }} />
            <h3 className="font-display font-bold text-xl">Above Upper Quartile</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">Roles positioned above the market upper quartile</p>
          {rolesByBand.aboveUQ.length > 0 ? (
            <div className="space-y-3">
              {rolesByBand.aboveUQ.map((role) => {
                const diff = role.currentSalary - role.upperQuartile;
                return (
                  <div key={role.id} className="p-4 bg-teal-50 rounded-lg border border-teal-200">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold">{role.role}</p>
                        <p className="text-xs text-muted-foreground">{role.function}</p>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-teal-200 text-teal-800">
                        {bandConfig.aboveUQ.label}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground text-xs">Current</p>
                        <p className="font-semibold">£{role.currentSalary.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Upper Quartile</p>
                        <p className="font-semibold">£{role.upperQuartile.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Difference</p>
                        <p className="font-semibold text-teal-700">+£{diff.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">No roles in this band</p>
          )}
        </Card>

        <Card className="p-6 bg-white border-0 shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: bandConfig.belowLQ.color }} />
            <h3 className="font-display font-bold text-xl">Below Lower Quartile</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">Roles positioned below the market lower quartile</p>
          {rolesByBand.belowLQ.length > 0 ? (
            <div className="space-y-3">
              {rolesByBand.belowLQ.map((role) => {
                const gap = role.lowerQuartile - role.currentSalary;
                return (
                  <div key={role.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold">{role.role}</p>
                        <p className="text-xs text-muted-foreground">{role.function}</p>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 text-slate-800">
                        {bandConfig.belowLQ.label}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground text-xs">Current</p>
                        <p className="font-semibold">£{role.currentSalary.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Lower Quartile</p>
                        <p className="font-semibold">£{role.lowerQuartile.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Gap</p>
                        <p className="font-semibold text-slate-700">£{gap.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-50 rounded-lg">
              <CheckCircle2 className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p className="font-semibold text-slate-600">No roles below lower quartile</p>
              <p className="text-sm text-muted-foreground mt-1">All roles are at or above market lower quartile</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
