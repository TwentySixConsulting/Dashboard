import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { marketData } from "@/lib/data";
import { Download, BarChart3, Layers, Users } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  ReferenceLine,
  BarChart,
  Bar,
  Cell,
  Legend,
} from "recharts";
import { toPng } from "html-to-image";
import logoImage from "@/assets/twentysix-logo.png";

const functionColors: Record<string, string> = {
  Technical: "#6366f1",
  HR: "#06b6d4",
  Governance: "#14b8a6",
  Operations: "#f59e0b",
  Finance: "#8b5cf6",
  IT: "#ec4899",
  Comms: "#10b981",
};

const levelLabels: Record<number, string> = {
  1: "Head / Director",
  2: "Senior Manager",
  3: "Manager",
  4: "Senior Professional",
  5: "Professional",
  6: "Officer / Coordinator",
};

type ViewMode = "roles" | "summary";

export function MarketComparison() {
  const [viewMode, setViewMode] = useState<ViewMode>("roles");
  const functionChartRef = useRef<HTMLDivElement>(null!);
  const levelChartRef = useRef<HTMLDivElement>(null!);

  const functions = Array.from(new Set(marketData.map((r) => r.function))).sort();
  const levels = Array.from(new Set(marketData.map((r) => r.jobLevel))).sort((a, b) => a - b);

  const dataByFunction = functions.flatMap((fn) => {
    const rolesInFunction = marketData
      .filter((r) => r.function === fn)
      .sort((a, b) => a.median - b.median);
    return rolesInFunction.map((role, idx) => ({
      ...role,
      groupLabel: fn,
      indexInGroup: idx,
      isFirstInGroup: idx === 0,
      delta: role.currentSalary - role.median,
      deltaPercent: Math.round(((role.currentSalary - role.median) / role.median) * 100),
    }));
  });

  const dataByLevel = levels.flatMap((lvl) => {
    const rolesInLevel = marketData
      .filter((r) => r.jobLevel === lvl)
      .sort((a, b) => a.median - b.median);
    return rolesInLevel.map((role, idx) => ({
      ...role,
      groupLabel: levelLabels[lvl] || `Level ${lvl}`,
      levelNum: lvl,
      indexInGroup: idx,
      isFirstInGroup: idx === 0,
      delta: role.currentSalary - role.median,
      deltaPercent: Math.round(((role.currentSalary - role.median) / role.median) * 100),
    }));
  });

  const summaryByFunction = functions.map((fn) => {
    const rolesInFunction = marketData.filter((r) => r.function === fn);
    const avgActual = Math.round(rolesInFunction.reduce((sum, r) => sum + r.currentSalary, 0) / rolesInFunction.length);
    const avgMedian = Math.round(rolesInFunction.reduce((sum, r) => sum + r.median, 0) / rolesInFunction.length);
    return {
      group: fn,
      avgActual,
      avgMedian,
      delta: avgActual - avgMedian,
      deltaPercent: Math.round(((avgActual - avgMedian) / avgMedian) * 100),
      count: rolesInFunction.length,
    };
  });

  const summaryByLevel = levels.map((lvl) => {
    const rolesInLevel = marketData.filter((r) => r.jobLevel === lvl);
    const avgActual = Math.round(rolesInLevel.reduce((sum, r) => sum + r.currentSalary, 0) / rolesInLevel.length);
    const avgMedian = Math.round(rolesInLevel.reduce((sum, r) => sum + r.median, 0) / rolesInLevel.length);
    return {
      group: levelLabels[lvl] || `Level ${lvl}`,
      levelNum: lvl,
      avgActual,
      avgMedian,
      delta: avgActual - avgMedian,
      deltaPercent: Math.round(((avgActual - avgMedian) / avgMedian) * 100),
      count: rolesInLevel.length,
    };
  });

  const downloadChart = async (ref: React.RefObject<HTMLDivElement>, filename: string) => {
    if (ref.current) {
      try {
        const dataUrl = await toPng(ref.current, { backgroundColor: "#ffffff", pixelRatio: 2 });
        const link = document.createElement("a");
        link.download = filename;
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error("Failed to download chart", err);
      }
    }
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-200 text-sm">
          <p className="font-semibold text-slate-800">{data.role}</p>
          <p className="text-slate-500 text-xs mb-2">{data.function || data.groupLabel}</p>
          <div className="space-y-1">
            <p>
              <span className="text-slate-500">Actual:</span>{" "}
              <span className="font-medium">£{data.currentSalary?.toLocaleString() || data.avgActual?.toLocaleString()}</span>
            </p>
            <p>
              <span className="text-slate-500">Median:</span>{" "}
              <span className="font-medium">£{data.median?.toLocaleString() || data.avgMedian?.toLocaleString()}</span>
            </p>
            <p>
              <span className="text-slate-500">Delta:</span>{" "}
              <span className={`font-medium ${data.delta >= 0 ? "text-teal-600" : "text-slate-600"}`}>
                {data.delta >= 0 ? "+" : ""}£{data.delta?.toLocaleString()} ({data.deltaPercent}%)
              </span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const SummaryTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-200 text-sm">
          <p className="font-semibold text-slate-800">{data.group}</p>
          <p className="text-slate-500 text-xs mb-2">{data.count} roles</p>
          <div className="space-y-1">
            <p>
              <span className="text-slate-500">Avg Actual:</span>{" "}
              <span className="font-medium">£{data.avgActual?.toLocaleString()}</span>
            </p>
            <p>
              <span className="text-slate-500">Avg Median:</span>{" "}
              <span className="font-medium">£{data.avgMedian?.toLocaleString()}</span>
            </p>
            <p>
              <span className="text-slate-500">Delta:</span>{" "}
              <span className={`font-medium ${data.delta >= 0 ? "text-teal-600" : "text-slate-600"}`}>
                {data.delta >= 0 ? "+" : ""}£{data.delta?.toLocaleString()} ({data.deltaPercent}%)
              </span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-sm font-medium text-accent uppercase tracking-wider mb-2">
            Executive Overview
          </p>
          <h1 className="text-4xl lg:text-5xl font-display font-bold text-primary mb-4">
            Market Position Comparison
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Visual comparison of actual pay against market median by function and job level.
          </p>
        </div>
        <img src={logoImage} alt="TwentySix" className="h-10 w-auto hidden lg:block" style={{ opacity: 1 }} />
      </div>

      <div className="flex gap-2">
        <Button
          variant={viewMode === "roles" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewMode("roles")}
          className="gap-2"
        >
          <Users className="w-4 h-4" />
          Role-Level View
        </Button>
        <Button
          variant={viewMode === "summary" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewMode("summary")}
          className="gap-2"
        >
          <Layers className="w-4 h-4" />
          Summary by Group Average
        </Button>
      </div>

      <Card className="p-6 bg-white border-0 shadow-md">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-500" />
            <h3 className="font-display font-bold text-xl">Actual vs Market Median by Function</h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => downloadChart(functionChartRef, "comparison-by-function.png")}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Download Image
          </Button>
        </div>

        <div ref={functionChartRef} className="bg-white p-4">
          {viewMode === "roles" ? (
            <div className="overflow-x-auto">
              <div style={{ minWidth: Math.max(800, dataByFunction.length * 50) }}>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={dataByFunction} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis
                      dataKey="role"
                      tick={{ fontSize: 10 }}
                      stroke="#94a3b8"
                      height={80}
                      interval={0}
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      stroke="#94a3b8"
                      tickFormatter={(v) => `£${(v / 1000).toFixed(0)}k`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend verticalAlign="top" height={36} />
                    {functions.map((fn, idx) => {
                      const firstRoleIdx = dataByFunction.findIndex((d) => d.function === fn);
                      if (firstRoleIdx > 0) {
                        return (
                          <ReferenceLine
                            key={`ref-${fn}`}
                            x={dataByFunction[firstRoleIdx].role}
                            stroke="#cbd5e1"
                            strokeDasharray="3 3"
                          />
                        );
                      }
                      return null;
                    })}
                    <Line
                      type="monotone"
                      dataKey="median"
                      stroke="#94a3b8"
                      strokeWidth={2}
                      dot={{ fill: "#94a3b8", strokeWidth: 0, r: 4 }}
                      name="Market Median"
                    />
                    <Line
                      type="monotone"
                      dataKey="currentSalary"
                      stroke="#6366f1"
                      strokeWidth={2}
                      dot={{ fill: "#6366f1", strokeWidth: 0, r: 4 }}
                      name="Actual Pay"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={summaryByFunction} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis
                  dataKey="group"
                  tick={{ fontSize: 11 }}
                  stroke="#94a3b8"
                  height={60}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  stroke="#94a3b8"
                  tickFormatter={(v) => `£${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<SummaryTooltip />} />
                <Legend verticalAlign="top" height={36} />
                <Bar dataKey="avgMedian" name="Avg Market Median" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="avgActual" name="Avg Actual Pay" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}

          <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-slate-100">
            {functions.map((fn) => (
              <div key={fn} className="flex items-center gap-2 text-xs">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: functionColors[fn] || "#64748b" }}
                />
                <span className="text-slate-600">{fn}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-white border-0 shadow-md">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-500" />
            <h3 className="font-display font-bold text-xl">Actual vs Market Median by Job Level</h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => downloadChart(levelChartRef, "comparison-by-level.png")}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Download Image
          </Button>
        </div>

        <div ref={levelChartRef} className="bg-white p-4">
          {viewMode === "roles" ? (
            <div className="overflow-x-auto">
              <div style={{ minWidth: Math.max(800, dataByLevel.length * 50) }}>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={dataByLevel} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis
                      dataKey="role"
                      tick={{ fontSize: 10 }}
                      stroke="#94a3b8"
                      height={80}
                      interval={0}
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      stroke="#94a3b8"
                      tickFormatter={(v) => `£${(v / 1000).toFixed(0)}k`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend verticalAlign="top" height={36} />
                    {levels.map((lvl) => {
                      const firstRoleIdx = dataByLevel.findIndex((d) => d.jobLevel === lvl);
                      if (firstRoleIdx > 0) {
                        return (
                          <ReferenceLine
                            key={`ref-lvl-${lvl}`}
                            x={dataByLevel[firstRoleIdx].role}
                            stroke="#cbd5e1"
                            strokeDasharray="3 3"
                          />
                        );
                      }
                      return null;
                    })}
                    <Line
                      type="monotone"
                      dataKey="median"
                      stroke="#94a3b8"
                      strokeWidth={2}
                      dot={{ fill: "#94a3b8", strokeWidth: 0, r: 4 }}
                      name="Market Median"
                    />
                    <Line
                      type="monotone"
                      dataKey="currentSalary"
                      stroke="#06b6d4"
                      strokeWidth={2}
                      dot={{ fill: "#06b6d4", strokeWidth: 0, r: 4 }}
                      name="Actual Pay"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={summaryByLevel} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis
                  dataKey="group"
                  tick={{ fontSize: 11 }}
                  stroke="#94a3b8"
                  height={60}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  stroke="#94a3b8"
                  tickFormatter={(v) => `£${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<SummaryTooltip />} />
                <Legend verticalAlign="top" height={36} />
                <Bar dataKey="avgMedian" name="Avg Market Median" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="avgActual" name="Avg Actual Pay" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}

          <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-slate-100">
            {levels.map((lvl) => (
              <div key={lvl} className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full bg-slate-400" />
                <span className="text-slate-600">{levelLabels[lvl] || `Level ${lvl}`}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-slate-50 border-0 shadow-md">
        <h3 className="font-display font-bold text-lg text-slate-800 mb-3">Reading These Charts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600">
          <div>
            <p className="font-medium text-slate-700 mb-1">Role-Level View</p>
            <p>Shows each individual role plotted as a point. Where actual pay (colored line) is above the median line, the role is paid above market median. Where it's below, the role is paid below median.</p>
          </div>
          <div>
            <p className="font-medium text-slate-700 mb-1">Summary View</p>
            <p>Shows average actual pay and average market median for each group. Useful for identifying whether entire functions or levels trend above or below market.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
