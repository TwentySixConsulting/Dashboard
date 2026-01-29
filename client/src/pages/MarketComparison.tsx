import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { marketData } from "@/lib/data";
import { Download, BarChart3, Layers, Users } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
  Cell,
  ComposedChart,
  Line,
} from "recharts";
import { toPng } from "html-to-image";
import logoImage from "@/assets/twentysix-logo.png";

const levelLabels: Record<number, string> = {
  1: "Head / Director",
  2: "Senior Manager",
  3: "Manager",
  4: "Senior Prof.",
  5: "Professional",
  6: "Officer / Coord.",
};

type ViewMode = "roles" | "summary";

export function MarketComparison() {
  const [viewMode, setViewMode] = useState<ViewMode>("summary");
  const functionChartRef = useRef<HTMLDivElement>(null!);
  const levelChartRef = useRef<HTMLDivElement>(null!);

  const functions = Array.from(new Set(marketData.map((r) => r.function))).sort();
  const levels = Array.from(new Set(marketData.map((r) => r.jobLevel))).sort((a, b) => a - b);

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

  const roleDataByFunction = marketData
    .slice()
    .sort((a, b) => {
      if (a.function !== b.function) return a.function.localeCompare(b.function);
      return a.median - b.median;
    })
    .map((role) => ({
      name: role.role.length > 20 ? role.role.substring(0, 18) + "..." : role.role,
      fullName: role.role,
      function: role.function,
      actual: role.currentSalary,
      median: role.median,
      delta: role.currentSalary - role.median,
      deltaPercent: Math.round(((role.currentSalary - role.median) / role.median) * 100),
    }));

  const roleDataByLevel = marketData
    .slice()
    .sort((a, b) => {
      if (a.jobLevel !== b.jobLevel) return a.jobLevel - b.jobLevel;
      return a.median - b.median;
    })
    .map((role) => ({
      name: role.role.length > 20 ? role.role.substring(0, 18) + "..." : role.role,
      fullName: role.role,
      level: levelLabels[role.jobLevel] || `Level ${role.jobLevel}`,
      actual: role.currentSalary,
      median: role.median,
      delta: role.currentSalary - role.median,
      deltaPercent: Math.round(((role.currentSalary - role.median) / role.median) * 100),
    }));

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

  const SummaryTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-200 text-sm">
          <p className="font-semibold text-slate-800 mb-2">{data.group}</p>
          <p className="text-slate-500 text-xs mb-2">{data.count} role{data.count > 1 ? "s" : ""}</p>
          <div className="space-y-1">
            <p><span className="text-slate-500">Avg Actual:</span> <span className="font-medium">£{data.avgActual?.toLocaleString()}</span></p>
            <p><span className="text-slate-500">Avg Median:</span> <span className="font-medium">£{data.avgMedian?.toLocaleString()}</span></p>
            <p>
              <span className="text-slate-500">Variance:</span>{" "}
              <span className={`font-medium ${data.delta >= 0 ? "text-teal-600" : "text-slate-600"}`}>
                {data.delta >= 0 ? "+" : ""}£{data.delta?.toLocaleString()} ({data.deltaPercent >= 0 ? "+" : ""}{data.deltaPercent}%)
              </span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const RoleTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-200 text-sm">
          <p className="font-semibold text-slate-800">{data.fullName}</p>
          <p className="text-slate-500 text-xs mb-2">{data.function || data.level}</p>
          <div className="space-y-1">
            <p><span className="text-slate-500">Actual:</span> <span className="font-medium">£{data.actual?.toLocaleString()}</span></p>
            <p><span className="text-slate-500">Median:</span> <span className="font-medium">£{data.median?.toLocaleString()}</span></p>
            <p>
              <span className="text-slate-500">Variance:</span>{" "}
              <span className={`font-medium ${data.delta >= 0 ? "text-teal-600" : "text-slate-600"}`}>
                {data.delta >= 0 ? "+" : ""}£{data.delta?.toLocaleString()} ({data.deltaPercent >= 0 ? "+" : ""}{data.deltaPercent}%)
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
            Visual comparison of actual pay against market median.
          </p>
        </div>
        <img src={logoImage} alt="TwentySix" className="h-10 w-auto hidden lg:block" style={{ opacity: 1 }} />
      </div>

      <div className="flex gap-2">
        <Button
          variant={viewMode === "summary" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewMode("summary")}
          className="gap-2"
        >
          <Layers className="w-4 h-4" />
          Group Averages
        </Button>
        <Button
          variant={viewMode === "roles" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewMode("roles")}
          className="gap-2"
        >
          <Users className="w-4 h-4" />
          Individual Roles
        </Button>
      </div>

      <Card className="p-6 bg-white border-0 shadow-md">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-500" />
            <h3 className="font-display font-bold text-xl">By Function</h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => downloadChart(functionChartRef, "comparison-by-function.png")}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Download
          </Button>
        </div>

        <div ref={functionChartRef} className="bg-white p-4">
          {viewMode === "summary" ? (
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={summaryByFunction} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="group" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" tickFormatter={(v) => `£${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<SummaryTooltip />} />
                <Legend wrapperStyle={{ paddingTop: 10 }} />
                <Bar dataKey="avgMedian" name="Market Median" fill="#94a3b8" radius={[4, 4, 0, 0]} barSize={30} />
                <Bar dataKey="avgActual" name="Actual Pay" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={30} />
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <ComposedChart data={roleDataByFunction} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 9 }} stroke="#94a3b8" angle={-45} textAnchor="end" height={80} interval={0} />
                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" tickFormatter={(v) => `£${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<RoleTooltip />} />
                <Legend wrapperStyle={{ paddingTop: 10 }} />
                <Bar dataKey="median" name="Market Median" fill="#94a3b8" radius={[4, 4, 0, 0]} barSize={16} />
                <Bar dataKey="actual" name="Actual Pay" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={16} />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>

      <Card className="p-6 bg-white border-0 shadow-md">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-500" />
            <h3 className="font-display font-bold text-xl">By Job Level</h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => downloadChart(levelChartRef, "comparison-by-level.png")}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Download
          </Button>
        </div>

        <div ref={levelChartRef} className="bg-white p-4">
          {viewMode === "summary" ? (
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={summaryByLevel} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="group" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" tickFormatter={(v) => `£${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<SummaryTooltip />} />
                <Legend wrapperStyle={{ paddingTop: 10 }} />
                <Bar dataKey="avgMedian" name="Market Median" fill="#94a3b8" radius={[4, 4, 0, 0]} barSize={30} />
                <Bar dataKey="avgActual" name="Actual Pay" fill="#06b6d4" radius={[4, 4, 0, 0]} barSize={30} />
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <ComposedChart data={roleDataByLevel} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 9 }} stroke="#94a3b8" angle={-45} textAnchor="end" height={80} interval={0} />
                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" tickFormatter={(v) => `£${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<RoleTooltip />} />
                <Legend wrapperStyle={{ paddingTop: 10 }} />
                <Bar dataKey="median" name="Market Median" fill="#94a3b8" radius={[4, 4, 0, 0]} barSize={16} />
                <Bar dataKey="actual" name="Actual Pay" fill="#06b6d4" radius={[4, 4, 0, 0]} barSize={16} />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>

      <Card className="p-6 bg-slate-50 border-0 shadow-sm">
        <h3 className="font-display font-bold text-lg text-slate-800 mb-3">How to Read These Charts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600">
          <div>
            <p className="font-medium text-slate-700 mb-1">Group Averages View</p>
            <p>Compares average actual pay to average market median for each function or job level. Quick overview of overall positioning by group.</p>
          </div>
          <div>
            <p className="font-medium text-slate-700 mb-1">Individual Roles View</p>
            <p>Shows each role side-by-side. Hover for full details including variance from market median.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
