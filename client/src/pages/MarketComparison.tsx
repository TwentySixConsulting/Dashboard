import { useState } from "react";
import { Card } from "@/components/ui/card";
import { marketData, getPositioning } from "@/lib/data";
import { TrendingUp, TrendingDown, Minus, Info } from "lucide-react";

const levelLabels: Record<number, string> = {
  1: "Director / Head",
  2: "Senior Manager",
  3: "Manager",
  4: "Senior Professional",
  5: "Professional",
  6: "Officer / Coordinator",
};

type GroupBy = "function" | "level" | "all";

function RangeBar({ role }: { role: typeof marketData[0] }) {
  const pos = getPositioning(role.currentSalary, role.lowerQuartile, role.median, role.upperQuartile);
  const diff = role.currentSalary - role.median;
  const diffPercent = ((diff / role.median) * 100).toFixed(1);

  const globalMin = Math.min(role.lowerQuartile * 0.88, role.currentSalary * 0.92);
  const globalMax = Math.max(role.upperQuartile * 1.12, role.currentSalary * 1.08);
  const range = globalMax - globalMin;

  const lqPct = ((role.lowerQuartile - globalMin) / range) * 100;
  const medPct = ((role.median - globalMin) / range) * 100;
  const uqPct = ((role.upperQuartile - globalMin) / range) * 100;
  const actualPct = ((role.currentSalary - globalMin) / range) * 100;
  const barWidth = uqPct - lqPct;

  return (
    <div className="py-4 px-5 hover:bg-slate-50/50 transition-colors" data-testid={`comparison-role-${role.id}`}>
      <div className="flex items-center justify-between mb-2">
        <div>
          <span className="font-semibold text-slate-800 text-sm">{role.role}</span>
          <span className="text-xs text-slate-400 ml-2">{role.function}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {diff > 0 ? (
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
          ) : diff < 0 ? (
            <TrendingDown className="w-3.5 h-3.5 text-amber-500" />
          ) : (
            <Minus className="w-3.5 h-3.5 text-slate-400" />
          )}
          <span className={`text-xs font-semibold ${diff > 0 ? 'text-emerald-600' : diff < 0 ? 'text-amber-600' : 'text-slate-500'}`}>
            {diff > 0 ? '+' : ''}{diffPercent}% vs median
          </span>
        </div>
      </div>

      <div className="relative h-10 mb-1.5">
        <div
          className="absolute top-3.5 h-3 rounded-full bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100"
          style={{ left: `${lqPct}%`, width: `${barWidth}%` }}
        />

        <div
          className="absolute top-2.5 w-px h-5 bg-slate-300"
          style={{ left: `${lqPct}%` }}
        />
        <div
          className="absolute top-2 w-0.5 h-6 bg-slate-500 rounded-full"
          style={{ left: `${medPct}%` }}
        />
        <div
          className="absolute top-2.5 w-px h-5 bg-slate-300"
          style={{ left: `${uqPct}%` }}
        />

        <div
          className="absolute top-1.5 w-7 h-7 rounded-full border-[3px] border-white flex items-center justify-center shadow-md transition-all"
          style={{
            left: `calc(${actualPct}% - 14px)`,
            backgroundColor: pos.color,
          }}
        >
          <span className="text-[8px] font-bold text-white">£</span>
        </div>
      </div>

      <div className="flex items-center justify-between text-[10px] text-slate-400">
        <div className="flex items-center gap-4" style={{ paddingLeft: `${Math.max(0, lqPct - 2)}%` }}>
          <span>LQ £{(role.lowerQuartile / 1000).toFixed(0)}k</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-medium text-slate-500">Med £{(role.median / 1000).toFixed(0)}k</span>
          <span>UQ £{(role.upperQuartile / 1000).toFixed(0)}k</span>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-1 text-[11px]">
        <span className="text-slate-400">Actual:</span>
        <span className="font-bold text-slate-700">£{role.currentSalary.toLocaleString()}</span>
        <span className="text-slate-300">|</span>
        <span className="text-slate-400">Position:</span>
        <span className="font-medium text-slate-600">{pos.label}</span>
      </div>
    </div>
  );
}

function SummaryCard({ label, roles }: { label: string; roles: typeof marketData }) {
  const avgActual = Math.round(roles.reduce((s, r) => s + r.currentSalary, 0) / roles.length);
  const avgMedian = Math.round(roles.reduce((s, r) => s + r.median, 0) / roles.length);
  const diff = avgActual - avgMedian;
  const diffPct = ((diff / avgMedian) * 100).toFixed(1);

  return (
    <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-slate-50 border border-slate-100">
      <div>
        <p className="font-semibold text-sm text-slate-700">{label}</p>
        <p className="text-xs text-slate-400">{roles.length} role{roles.length !== 1 ? 's' : ''}</p>
      </div>
      <div className="text-right">
        <p className="text-sm">
          <span className="text-slate-400">Avg: </span>
          <span className="font-bold text-slate-800">£{avgActual.toLocaleString()}</span>
          <span className="text-slate-300 mx-1.5">vs</span>
          <span className="font-medium text-slate-500">£{avgMedian.toLocaleString()}</span>
        </p>
        <p className={`text-xs font-semibold ${diff >= 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
          {diff >= 0 ? '+' : ''}{diffPct}% vs market median
        </p>
      </div>
    </div>
  );
}

export function MarketComparison() {
  const [groupBy, setGroupBy] = useState<GroupBy>("all");

  const functions = Array.from(new Set(marketData.map((r) => r.function))).sort();
  const levels = Array.from(new Set(marketData.map((r) => r.jobLevel))).sort((a, b) => a - b);

  const overallAvgActual = Math.round(marketData.reduce((s, r) => s + r.currentSalary, 0) / marketData.length);
  const overallAvgMedian = Math.round(marketData.reduce((s, r) => s + r.median, 0) / marketData.length);
  const overallDiff = overallAvgActual - overallAvgMedian;
  const overallDiffPct = ((overallDiff / overallAvgMedian) * 100).toFixed(1);

  const aboveCount = marketData.filter(r => r.currentSalary >= r.median).length;
  const belowCount = marketData.length - aboveCount;

  const sortedRoles = [...marketData].sort((a, b) => {
    if (groupBy === "function") {
      if (a.function !== b.function) return a.function.localeCompare(b.function);
      return b.currentSalary - a.currentSalary;
    }
    if (groupBy === "level") {
      if (a.jobLevel !== b.jobLevel) return a.jobLevel - b.jobLevel;
      return b.currentSalary - a.currentSalary;
    }
    return b.currentSalary - a.currentSalary;
  });

  const groupedRoles: { label: string; roles: typeof marketData }[] = [];
  if (groupBy === "function") {
    functions.forEach(fn => {
      const roles = sortedRoles.filter(r => r.function === fn);
      if (roles.length) groupedRoles.push({ label: fn, roles });
    });
  } else if (groupBy === "level") {
    levels.forEach(lvl => {
      const roles = sortedRoles.filter(r => r.jobLevel === lvl);
      if (roles.length) groupedRoles.push({ label: levelLabels[lvl] || `Level ${lvl}`, roles });
    });
  } else {
    groupedRoles.push({ label: "All Roles", roles: sortedRoles });
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="page-header">
        <p className="page-badge">Executive Overview</p>
        <h1>Market Position Comparison</h1>
        <p className="page-subtitle">See at a glance where each role sits against the market range.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 section-card text-center">
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Overall Position</p>
          <p className={`text-2xl font-display font-bold ${overallDiff >= 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
            {overallDiff >= 0 ? '+' : ''}{overallDiffPct}%
          </p>
          <p className="text-xs text-slate-400 mt-1">vs market median (avg)</p>
        </Card>
        <Card className="p-5 section-card text-center">
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">At or Above Median</p>
          <p className="text-2xl font-display font-bold text-emerald-600">{aboveCount} <span className="text-base font-normal text-slate-400">of {marketData.length}</span></p>
          <p className="text-xs text-slate-400 mt-1">roles at or above market median</p>
        </Card>
        <Card className="p-5 section-card text-center">
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Below Median</p>
          <p className="text-2xl font-display font-bold text-amber-600">{belowCount} <span className="text-base font-normal text-slate-400">of {marketData.length}</span></p>
          <p className="text-xs text-slate-400 mt-1">roles below market median</p>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-5 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-2.5 rounded-full bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100" />
            <span>Market range (LQ–UQ)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-0.5 h-3 bg-slate-500 rounded-full" />
            <span>Median</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded-full bg-indigo-500 border-2 border-white shadow-sm" />
            <span>Actual pay</span>
          </div>
        </div>
        <div className="flex gap-1 bg-slate-100 rounded-lg p-0.5">
          {[
            { key: "all" as GroupBy, label: "All" },
            { key: "function" as GroupBy, label: "By Function" },
            { key: "level" as GroupBy, label: "By Level" },
          ].map(opt => (
            <button
              key={opt.key}
              onClick={() => setGroupBy(opt.key)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                groupBy === opt.key
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
              data-testid={`button-group-${opt.key}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {groupedRoles.map(group => (
        <Card key={group.label} className="section-card overflow-hidden">
          {groupBy !== "all" && (
            <div className="px-5 pt-4 pb-2 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-slate-700">{group.label}</h3>
                <SummaryBadge roles={group.roles} />
              </div>
            </div>
          )}
          <div className="divide-y divide-slate-100">
            {group.roles.map(role => (
              <RangeBar key={role.id} role={role} />
            ))}
          </div>
        </Card>
      ))}

      {groupBy !== "all" && (
        <Card className="p-5 section-card">
          <h3 className="font-display font-bold text-sm text-slate-700 mb-3">
            Summary by {groupBy === "function" ? "Function" : "Job Level"}
          </h3>
          <div className="space-y-2">
            {groupedRoles.map(group => (
              <SummaryCard key={group.label} label={group.label} roles={group.roles} />
            ))}
          </div>
        </Card>
      )}

      <Card className="p-5 bg-slate-50 border-0 shadow-sm">
        <div className="flex items-start gap-3">
          <Info className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
          <div className="text-sm text-slate-500 leading-relaxed">
            <p>
              Each row shows a role's actual pay (coloured dot) relative to the market range. The grey bar represents the range from Lower Quartile to Upper Quartile, with the dark line marking the Median. The dot colour indicates positioning: roles at or above median appear in green/blue tones, while those below appear in amber/red tones.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

function SummaryBadge({ roles }: { roles: typeof marketData }) {
  const avgActual = Math.round(roles.reduce((s, r) => s + r.currentSalary, 0) / roles.length);
  const avgMedian = Math.round(roles.reduce((s, r) => s + r.median, 0) / roles.length);
  const diff = avgActual - avgMedian;
  const pct = ((diff / avgMedian) * 100).toFixed(1);

  return (
    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${diff >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
      {diff >= 0 ? '+' : ''}{pct}% avg vs median
    </span>
  );
}
