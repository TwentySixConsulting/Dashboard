import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { marketData, getPositioning } from "@/lib/data";
import { Download, Users, Layers, Info } from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  Cell,
  ReferenceLine,
} from "recharts";
import { toPng } from "html-to-image";

const levelLabels: Record<number, string> = {
  1: "Director / Head",
  2: "Senior Manager",
  3: "Manager",
  4: "Senior Professional",
  5: "Professional",
  6: "Officer / Coordinator",
};

const shortLevelLabels: Record<number, string> = {
  1: "Director",
  2: "Sr Manager",
  3: "Manager",
  4: "Sr Professional",
  5: "Professional",
  6: "Coordinator",
};

const COLORS = {
  actual: "#6366f1",
  median: "#cbd5e1",
  lq: "#e2e8f0",
  uq: "#e2e8f0",
  positive: "#10b981",
  negative: "#f59e0b",
};

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const data = payload[0]?.payload;
  if (!data) return null;

  const diff = (data.avgActual || data.actual) - (data.avgMedian || data.median);
  const base = data.avgMedian || data.median;
  const pct = ((diff / base) * 100).toFixed(1);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-4 text-sm min-w-[200px]">
      <p className="font-display font-bold text-slate-800 mb-2">{data.name || data.group || label}</p>
      {data.count !== undefined && (
        <p className="text-xs text-slate-400 mb-2">{data.count} role{data.count !== 1 ? 's' : ''}</p>
      )}
      <div className="space-y-1.5">
        <div className="flex justify-between">
          <span className="text-slate-500">Actual Pay</span>
          <span className="font-semibold text-indigo-600">£{(data.avgActual || data.actual)?.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Market Median</span>
          <span className="font-semibold text-slate-600">£{(data.avgMedian || data.median)?.toLocaleString()}</span>
        </div>
        {data.lq && (
          <div className="flex justify-between">
            <span className="text-slate-400">LQ – UQ</span>
            <span className="text-slate-500">£{data.lq?.toLocaleString()} – £{data.uq?.toLocaleString()}</span>
          </div>
        )}
        <div className="border-t border-slate-100 pt-1.5 flex justify-between">
          <span className="text-slate-500">Difference</span>
          <span className={`font-bold ${diff >= 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
            {diff >= 0 ? '+' : ''}{pct}%
          </span>
        </div>
      </div>
    </div>
  );
}

function CustomBarLabel({ x, y, width, value }: any) {
  if (!value) return null;
  return (
    <text x={x + width / 2} y={y - 6} textAnchor="middle" className="text-[10px] fill-slate-400 font-medium">
      £{(value / 1000).toFixed(0)}k
    </text>
  );
}

export function MarketComparison() {
  const [view, setView] = useState<"roles" | "summary">("roles");
  const functionChartRef = useRef<HTMLDivElement>(null);
  const levelChartRef = useRef<HTMLDivElement>(null);

  const functions = Array.from(new Set(marketData.map((r) => r.function))).sort();
  const levels = Array.from(new Set(marketData.map((r) => r.jobLevel))).sort((a, b) => a - b);

  const rolesByFunction = marketData
    .slice()
    .sort((a, b) => {
      if (a.function !== b.function) return a.function.localeCompare(b.function);
      return b.currentSalary - a.currentSalary;
    })
    .map((role) => ({
      name: role.role,
      function: role.function,
      actual: role.currentSalary,
      median: role.median,
      lq: role.lowerQuartile,
      uq: role.upperQuartile,
      delta: role.currentSalary - role.median,
    }));

  const rolesByLevel = marketData
    .slice()
    .sort((a, b) => {
      if (a.jobLevel !== b.jobLevel) return a.jobLevel - b.jobLevel;
      return b.currentSalary - a.currentSalary;
    })
    .map((role) => ({
      name: role.role,
      level: levelLabels[role.jobLevel],
      actual: role.currentSalary,
      median: role.median,
      lq: role.lowerQuartile,
      uq: role.upperQuartile,
      delta: role.currentSalary - role.median,
    }));

  const summaryByFunction = functions.map((fn) => {
    const roles = marketData.filter((r) => r.function === fn);
    const avgActual = Math.round(roles.reduce((s, r) => s + r.currentSalary, 0) / roles.length);
    const avgMedian = Math.round(roles.reduce((s, r) => s + r.median, 0) / roles.length);
    return { group: fn, avgActual, avgMedian, count: roles.length, delta: avgActual - avgMedian };
  });

  const summaryByLevel = levels.map((lvl) => {
    const roles = marketData.filter((r) => r.jobLevel === lvl);
    const avgActual = Math.round(roles.reduce((s, r) => s + r.currentSalary, 0) / roles.length);
    const avgMedian = Math.round(roles.reduce((s, r) => s + r.median, 0) / roles.length);
    return { group: shortLevelLabels[lvl] || `Level ${lvl}`, avgActual, avgMedian, count: roles.length, delta: avgActual - avgMedian };
  });

  const overallAvgActual = Math.round(marketData.reduce((s, r) => s + r.currentSalary, 0) / marketData.length);
  const overallAvgMedian = Math.round(marketData.reduce((s, r) => s + r.median, 0) / marketData.length);
  const overallDiff = overallAvgActual - overallAvgMedian;
  const overallDiffPct = ((overallDiff / overallAvgMedian) * 100).toFixed(1);
  const aboveCount = marketData.filter(r => r.currentSalary >= r.median).length;

  const downloadChart = async (ref: React.RefObject<HTMLDivElement | null>, filename: string) => {
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

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="page-header">
        <p className="page-badge">Executive Overview</p>
        <h1>Market Position Comparison</h1>
        <p className="page-subtitle">Visual comparison of actual pay against market data, grouped by function and job level.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 section-card text-center" data-testid="stat-overall">
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Overall Position</p>
          <p className={`text-2xl font-display font-bold ${overallDiff >= 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
            {overallDiff >= 0 ? '+' : ''}{overallDiffPct}%
          </p>
          <p className="text-xs text-slate-400 mt-1">vs market median (avg)</p>
        </Card>
        <Card className="p-5 section-card text-center" data-testid="stat-above">
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">At or Above Median</p>
          <p className="text-2xl font-display font-bold text-emerald-600">{aboveCount} <span className="text-base font-normal text-slate-400">of {marketData.length}</span></p>
          <p className="text-xs text-slate-400 mt-1">roles at or above market</p>
        </Card>
        <Card className="p-5 section-card text-center" data-testid="stat-below">
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Below Median</p>
          <p className="text-2xl font-display font-bold text-amber-600">{marketData.length - aboveCount} <span className="text-base font-normal text-slate-400">of {marketData.length}</span></p>
          <p className="text-xs text-slate-400 mt-1">roles below market median</p>
        </Card>
      </div>

      <div className="flex items-center justify-end">
        <div className="flex gap-1 bg-slate-100 rounded-lg p-0.5">
          {[
            { key: "roles" as const, label: "Individual Roles" },
            { key: "summary" as const, label: "Summary Averages" },
          ].map(opt => (
            <button
              key={opt.key}
              onClick={() => setView(opt.key)}
              className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                view === opt.key
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
              data-testid={`button-view-${opt.key}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <Card className="section-card overflow-hidden" data-testid="chart-by-function">
        <div className="p-6 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
              <Users className="w-4 h-4 text-indigo-500" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-slate-800">By Function</h3>
              <p className="text-xs text-slate-400">Comparing actual pay to market median across departments</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => downloadChart(functionChartRef, "comparison-by-function.png")}
            className="gap-1.5 text-xs"
            data-testid="button-download-function"
          >
            <Download className="w-3.5 h-3.5" />
            Export
          </Button>
        </div>

        <div ref={functionChartRef} className="bg-white px-4 pb-6 pt-2">
          <div className="flex items-center gap-5 mb-4 px-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: COLORS.actual }} />
              Actual Pay
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: COLORS.median }} />
              Market Median
            </div>
          </div>

          {view === "roles" ? (
            <ResponsiveContainer width="100%" height={380}>
              <BarChart data={rolesByFunction} margin={{ top: 20, right: 20, left: 10, bottom: 60 }} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  angle={-35}
                  textAnchor="end"
                  height={70}
                  interval={0}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  tickFormatter={(v) => `£${(v / 1000).toFixed(0)}k`}
                  width={55}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99,102,241,0.04)' }} />
                <Bar dataKey="median" name="Market Median" fill={COLORS.median} radius={[4, 4, 0, 0]} barSize={24} label={<CustomBarLabel />} />
                <Bar dataKey="actual" name="Actual Pay" radius={[4, 4, 0, 0]} barSize={24} label={<CustomBarLabel />}>
                  {rolesByFunction.map((entry, i) => (
                    <Cell key={i} fill={entry.delta >= 0 ? COLORS.positive : COLORS.negative} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={summaryByFunction} margin={{ top: 20, right: 20, left: 10, bottom: 20 }} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="group" tick={{ fontSize: 12, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} tickFormatter={(v) => `£${(v / 1000).toFixed(0)}k`} width={55} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99,102,241,0.04)' }} />
                <Bar dataKey="avgMedian" name="Market Median" fill={COLORS.median} radius={[6, 6, 0, 0]} barSize={40} label={<CustomBarLabel />} />
                <Bar dataKey="avgActual" name="Actual Pay" radius={[6, 6, 0, 0]} barSize={40} label={<CustomBarLabel />}>
                  {summaryByFunction.map((entry, i) => (
                    <Cell key={i} fill={entry.delta >= 0 ? COLORS.positive : COLORS.negative} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}

          {view === "roles" && (
            <div className="flex flex-wrap gap-2 px-2 mt-2">
              {functions.map((fn) => (
                <span key={fn} className="px-2.5 py-1 text-[11px] text-slate-500 bg-slate-50 rounded-full border border-slate-100">
                  {fn}
                </span>
              ))}
            </div>
          )}
        </div>
      </Card>

      <Card className="section-card overflow-hidden" data-testid="chart-by-level">
        <div className="p-6 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-50 flex items-center justify-center">
              <Layers className="w-4 h-4 text-cyan-500" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-slate-800">By Job Level</h3>
              <p className="text-xs text-slate-400">Comparing actual pay to market median across seniority levels</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => downloadChart(levelChartRef, "comparison-by-level.png")}
            className="gap-1.5 text-xs"
            data-testid="button-download-level"
          >
            <Download className="w-3.5 h-3.5" />
            Export
          </Button>
        </div>

        <div ref={levelChartRef} className="bg-white px-4 pb-6 pt-2">
          <div className="flex items-center gap-5 mb-4 px-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: COLORS.actual }} />
              Actual Pay
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: COLORS.median }} />
              Market Median
            </div>
          </div>

          {view === "roles" ? (
            <ResponsiveContainer width="100%" height={380}>
              <BarChart data={rolesByLevel} margin={{ top: 20, right: 20, left: 10, bottom: 60 }} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  angle={-35}
                  textAnchor="end"
                  height={70}
                  interval={0}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  tickFormatter={(v) => `£${(v / 1000).toFixed(0)}k`}
                  width={55}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(6,182,212,0.04)' }} />
                <Bar dataKey="median" name="Market Median" fill={COLORS.median} radius={[4, 4, 0, 0]} barSize={24} label={<CustomBarLabel />} />
                <Bar dataKey="actual" name="Actual Pay" radius={[4, 4, 0, 0]} barSize={24} label={<CustomBarLabel />}>
                  {rolesByLevel.map((entry, i) => (
                    <Cell key={i} fill={entry.delta >= 0 ? '#06b6d4' : COLORS.negative} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={summaryByLevel} margin={{ top: 20, right: 20, left: 10, bottom: 20 }} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="group" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} tickFormatter={(v) => `£${(v / 1000).toFixed(0)}k`} width={55} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(6,182,212,0.04)' }} />
                <Bar dataKey="avgMedian" name="Market Median" fill={COLORS.median} radius={[6, 6, 0, 0]} barSize={40} label={<CustomBarLabel />} />
                <Bar dataKey="avgActual" name="Actual Pay" radius={[6, 6, 0, 0]} barSize={40} label={<CustomBarLabel />}>
                  {summaryByLevel.map((entry, i) => (
                    <Cell key={i} fill={entry.delta >= 0 ? '#06b6d4' : COLORS.negative} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>

      <Card className="p-5 bg-slate-50 border-0 shadow-sm">
        <div className="flex items-start gap-3">
          <Info className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
          <div className="text-sm text-slate-500 leading-relaxed">
            <p>
              Bars show actual pay (coloured) against market median (grey) for each role. Green/cyan bars indicate pay at or above market median; amber bars indicate pay below median. Toggle between individual roles and summary averages using the buttons above. Use <strong>Export</strong> to download charts as images.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
