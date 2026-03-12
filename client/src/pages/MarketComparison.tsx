import { Card } from "@/components/ui/card";
import { marketData, companyInfo } from "@/lib/data";
import { TrendingUp, TrendingDown, Target, AlertCircle, AlertTriangle, Briefcase, ShieldCheck, BarChart3 } from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

type PositionBand = "belowLQ" | "lqToMedian" | "medianToUQ" | "aboveUQ";

function getPositionBand(actual: number, lq: number, median: number, uq: number): PositionBand {
  if (actual < lq) return "belowLQ";
  if (actual < median) return "lqToMedian";
  if (actual <= uq) return "medianToUQ";
  return "aboveUQ";
}

function CustomRadarTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const dataPoint = payload[0]?.payload;
  if (!dataPoint) return null;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-4 text-sm min-w-[200px]">
      <p className="font-display font-bold text-slate-800 mb-3">{label}</p>
      <div className="space-y-1.5">
        <div className="flex justify-between gap-4">
          <span className="text-slate-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-slate-300" />
            Lower Quartile
          </span>
          <span className="font-semibold text-slate-500">£{dataPoint._rawLQ?.toLocaleString()}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-slate-500 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-slate-600" />
            Median
          </span>
          <span className="font-semibold text-slate-700">£{dataPoint._rawMedian?.toLocaleString()}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-slate-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-slate-300" />
            Upper Quartile
          </span>
          <span className="font-semibold text-slate-500">£{dataPoint._rawUQ?.toLocaleString()}</span>
        </div>
        <div className="border-t border-slate-100 pt-1.5 flex justify-between gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            <span className="font-medium text-indigo-600">{companyInfo.name}</span>
          </span>
          <span className="font-bold text-indigo-600">£{dataPoint._rawActual?.toLocaleString()}</span>
        </div>
        <div className="flex justify-between gap-4 text-xs">
          <span className="text-slate-400">vs median</span>
          <span className={`font-bold ${dataPoint._rawActual >= dataPoint._rawMedian ? 'text-emerald-600' : 'text-amber-600'}`}>
            {dataPoint._rawActual >= dataPoint._rawMedian ? '+' : ''}{(((dataPoint._rawActual - dataPoint._rawMedian) / dataPoint._rawMedian) * 100).toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
}

export function MarketComparison() {
  const overallAvgActual = Math.round(marketData.reduce((s, r) => s + r.currentSalary, 0) / marketData.length);
  const overallAvgMedian = Math.round(marketData.reduce((s, r) => s + r.median, 0) / marketData.length);
  const overallDiff = overallAvgActual - overallAvgMedian;
  const overallDiffPct = ((overallDiff / overallAvgMedian) * 100).toFixed(1);

  const totalSalaryBill = marketData.reduce((s, r) => s + r.currentSalary, 0);
  const totalMedianBill = marketData.reduce((s, r) => s + r.median, 0);
  const billDifference = totalSalaryBill - totalMedianBill;
  const functions = Array.from(new Set(marketData.map(r => r.function))).sort();
  const highestPaid = [...marketData].sort((a, b) => b.currentSalary - a.currentSalary)[0];
  const lowestPaid = [...marketData].sort((a, b) => a.currentSalary - b.currentSalary)[0];

  const rolesWithBands = marketData.map((role) => ({
    ...role,
    band: getPositionBand(role.currentSalary, role.lowerQuartile, role.median, role.upperQuartile),
    gapToLQ: role.lowerQuartile - role.currentSalary,
    gapToUQ: role.currentSalary - role.upperQuartile,
    diffPct: ((role.currentSalary - role.median) / role.median) * 100,
  }));

  const belowMedianRoles = rolesWithBands.filter(r => r.currentSalary < r.median);
  const atMedianRoles = rolesWithBands.filter(r => {
    const pct = Math.abs(r.diffPct);
    return pct <= 2.5;
  });
  const aboveMedianRoles = rolesWithBands.filter(r => r.currentSalary > r.median);

  const strengths = rolesWithBands.filter(r =>
    r.currentSalary >= r.median && r.diffPct <= 2.5
  );
  const risks = rolesWithBands.filter(r =>
    r.currentSalary < r.median || r.diffPct > 2.5
  );

  const belowLQRoles = rolesWithBands
    .filter((r) => r.band === "belowLQ")
    .sort((a, b) => b.gapToLQ - a.gapToLQ);

  const aboveUQRoles = rolesWithBands
    .filter((r) => r.band === "aboveUQ")
    .sort((a, b) => b.gapToUQ - a.gapToUQ);

  const sortedByFunction = [...marketData].sort((a, b) => {
    if (a.function !== b.function) return a.function.localeCompare(b.function);
    return b.currentSalary - a.currentSalary;
  });

  const radarData = sortedByFunction.map((role, _i, arr) => {
    const m = role.median;
    const fnRoles = arr.filter(r => r.function === role.function);
    const fnIndex = fnRoles.indexOf(role);
    const isFirst = fnIndex === 0;
    const isSingle = fnRoles.length === 1;
    return {
      role: role.role,
      label: isFirst || isSingle
        ? `${role.function}: ${role.role}`
        : `  ${role.role}`,
      functionName: role.function,
      isFirstInFunction: isFirst,
      "Lower Quartile": Math.round((role.lowerQuartile / m) * 100),
      "Median": 100,
      "Upper Quartile": Math.round((role.upperQuartile / m) * 100),
      "Actual": Math.round((role.currentSalary / m) * 100),
      _rawLQ: role.lowerQuartile,
      _rawMedian: role.median,
      _rawUQ: role.upperQuartile,
      _rawActual: role.currentSalary,
    };
  });

  const avgLQ = Math.round(radarData.reduce((s, d) => s + d["Lower Quartile"], 0) / radarData.length);
  const avgUQ = Math.round(radarData.reduce((s, d) => s + d["Upper Quartile"], 0) / radarData.length);
  const spacing = avgUQ - 100;
  const belowBand = avgLQ - spacing;
  const aboveBand = avgUQ + spacing;
  const gridTicks = [belowBand, avgLQ, 100, avgUQ, aboveBand];
  const domainMax = aboveBand + 2;

  const functionBreakdown = functions.map(fn => {
    const fnRoles = marketData.filter(r => r.function === fn);
    const avgActual = Math.round(fnRoles.reduce((s, r) => s + r.currentSalary, 0) / fnRoles.length);
    const avgMedian = Math.round(fnRoles.reduce((s, r) => s + r.median, 0) / fnRoles.length);
    const diff = avgActual - avgMedian;
    const diffPct = ((diff / avgMedian) * 100).toFixed(1);
    return { function: fn, roles: fnRoles.length, avgActual, avgMedian, diff, diffPct };
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="page-header">
        <p className="page-badge">Overview</p>
        <h1>Your Market Position</h1>
        <p className="page-subtitle">How {companyInfo.name}'s pay compares to the market across all assessed roles.</p>
      </div>

      <Card className="p-6 section-card" data-testid="company-stats">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
            <Target className="w-4 h-4 text-indigo-500" />
          </div>
          <h3 className="font-display font-bold text-xl text-slate-800">{companyInfo.name}'s Headline Profile</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-5">
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1">Roles Assessed</p>
            <p className="text-xl font-display font-bold text-slate-800">{marketData.length}</p>
            <p className="text-xs text-slate-400 mt-0.5">across {functions.length} functions</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1">Total Salary Bill</p>
            <p className="text-xl font-display font-bold text-slate-800">£{(totalSalaryBill / 1000).toFixed(0)}k</p>
            <p className="text-xs text-slate-400 mt-0.5">assessed roles</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1">Total at Median</p>
            <p className="text-xl font-display font-bold text-slate-800">£{(totalMedianBill / 1000).toFixed(0)}k</p>
            <p className="text-xs text-slate-400 mt-0.5">if all roles paid at median</p>
          </div>
          <div className={`rounded-xl p-4 ${billDifference > 0 ? 'bg-amber-50 border border-amber-100' : 'bg-emerald-50 border border-emerald-100'}`}>
            <p className={`text-[10px] uppercase tracking-wider font-semibold mb-1 ${billDifference > 0 ? 'text-amber-500' : 'text-emerald-500'}`}>
              {billDifference > 0 ? 'Potential Saving' : 'Investment Needed'}
            </p>
            <div className="flex items-center gap-1.5">
              {billDifference > 0 ? (
                <TrendingDown className="w-4 h-4 text-amber-500" />
              ) : (
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              )}
              <p className={`text-xl font-display font-bold ${billDifference > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                £{(Math.abs(billDifference) / 1000).toFixed(0)}k
              </p>
            </div>
            <p className={`text-xs mt-0.5 ${billDifference > 0 ? 'text-amber-500' : 'text-emerald-500'}`}>
              {billDifference > 0 ? 'could save if paid at median' : 'needed to reach median'}
            </p>
          </div>
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1">Average Salary</p>
            <p className="text-xl font-display font-bold text-slate-800">£{overallAvgActual.toLocaleString()}</p>
            <p className="text-xs text-slate-400 mt-0.5">vs £{overallAvgMedian.toLocaleString()} market</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1">Market Alignment</p>
            <div className="flex items-center gap-1.5">
              {overallDiff >= 0 ? (
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-amber-500" />
              )}
              <p className={`text-xl font-display font-bold ${overallDiff >= 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
                {overallDiff >= 0 ? '+' : ''}{overallDiffPct}%
              </p>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{overallDiff >= 0 ? 'above' : 'below'} market median</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1">Sector</p>
            <p className="text-sm font-display font-bold text-slate-800">{companyInfo.industry}</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1">Dataset</p>
            <p className="text-sm font-display font-bold text-slate-800">{companyInfo.location}</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1">Highest Paid</p>
            <p className="text-sm font-display font-bold text-slate-800">{highestPaid.role}</p>
            <p className="text-xs text-slate-400">£{highestPaid.currentSalary.toLocaleString()}</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1">Lowest Paid</p>
            <p className="text-sm font-display font-bold text-slate-800">{lowestPaid.role}</p>
            <p className="text-xs text-slate-400">£{lowestPaid.currentSalary.toLocaleString()}</p>
          </div>
        </div>
      </Card>

      <Card className="p-5 section-card" data-testid="stat-overall">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-slate-600" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-slate-800">Overall Position: <span className={overallDiff >= 0 ? 'text-emerald-600' : 'text-amber-600'}>{overallDiff >= 0 ? '+' : ''}{overallDiffPct}%</span> vs market median</h3>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl p-4 bg-amber-50 border border-amber-100">
            <p className="text-xs text-amber-600 uppercase tracking-wider font-semibold mb-1">Below Median</p>
            <p className="text-2xl font-display font-bold text-amber-600">{belowMedianRoles.length} <span className="text-base font-normal text-amber-400">of {marketData.length}</span></p>
            <p className="text-xs text-amber-500 mt-1">roles paying below market median</p>
            {belowMedianRoles.length > 0 && (
              <div className="mt-3 space-y-1">
                {belowMedianRoles.map(r => (
                  <p key={r.id} className="text-xs text-amber-700">{r.role} ({r.diffPct.toFixed(1)}%)</p>
                ))}
              </div>
            )}
          </div>
          <div className="rounded-xl p-4 bg-blue-50 border border-blue-100">
            <p className="text-xs text-blue-600 uppercase tracking-wider font-semibold mb-1">At Median</p>
            <p className="text-2xl font-display font-bold text-blue-600">{atMedianRoles.length} <span className="text-base font-normal text-blue-400">of {marketData.length}</span></p>
            <p className="text-xs text-blue-500 mt-1">roles within ±2.5% of median</p>
            {atMedianRoles.length > 0 && (
              <div className="mt-3 space-y-1">
                {atMedianRoles.map(r => (
                  <p key={r.id} className="text-xs text-blue-700">{r.role} ({r.diffPct >= 0 ? '+' : ''}{r.diffPct.toFixed(1)}%)</p>
                ))}
              </div>
            )}
          </div>
          <div className="rounded-xl p-4 bg-emerald-50 border border-emerald-100">
            <p className="text-xs text-emerald-600 uppercase tracking-wider font-semibold mb-1">Above Median</p>
            <p className="text-2xl font-display font-bold text-emerald-600">{aboveMedianRoles.length} <span className="text-base font-normal text-emerald-400">of {marketData.length}</span></p>
            <p className="text-xs text-emerald-500 mt-1">roles paying above market median</p>
            {aboveMedianRoles.length > 0 && (
              <div className="mt-3 space-y-1">
                {aboveMedianRoles.map(r => (
                  <p key={r.id} className="text-xs text-emerald-700">{r.role} (+{r.diffPct.toFixed(1)}%)</p>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>

      <Card className="p-6 section-card" data-testid="function-breakdown">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
            <Briefcase className="w-4 h-4 text-violet-500" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-slate-800">Function Breakdown</h3>
            <p className="text-xs text-slate-400">Average salary vs market median by department</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-2.5 font-semibold text-slate-700">Function</th>
                <th className="text-center py-2.5 font-semibold text-slate-700">Roles</th>
                <th className="text-right py-2.5 font-semibold text-slate-700">Avg Salary</th>
                <th className="text-right py-2.5 font-semibold text-slate-700">Avg Median</th>
                <th className="text-right py-2.5 font-semibold text-slate-700">Difference</th>
              </tr>
            </thead>
            <tbody>
              {functionBreakdown.map((fn) => (
                <tr key={fn.function} className="border-b border-slate-100">
                  <td className="py-3 font-medium text-slate-800">{fn.function}</td>
                  <td className="py-3 text-center">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-xs font-semibold text-slate-600">{fn.roles}</span>
                  </td>
                  <td className="text-right py-3 font-medium">£{fn.avgActual.toLocaleString()}</td>
                  <td className="text-right py-3 text-slate-500">£{fn.avgMedian.toLocaleString()}</td>
                  <td className="text-right py-3">
                    <span className={`font-bold ${fn.diff >= 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {fn.diff >= 0 ? '+' : ''}{fn.diffPct}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="section-card overflow-hidden" data-testid="radar-chart">
        <div className="p-6 pb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
              <Target className="w-4 h-4 text-violet-500" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-slate-800">Market Position Map</h3>
              <p className="text-xs text-slate-400">Roles grouped by function, normalised to median (100%). Hover for actual values.</p>
            </div>
          </div>
        </div>
        <div className="px-4 pb-6">
          <ResponsiveContainer width="100%" height={650}>
            <RadarChart data={radarData} outerRadius="48%" cx="50%" cy="50%">
              <PolarGrid
                stroke="#e2e8f0"
                gridType="circle"
              />
              <PolarAngleAxis
                dataKey="role"
                tickLine={false}
                tick={(props: any) => {
                  const { x, y, payload, textAnchor, cx, cy } = props;
                  const dataItem = radarData[payload.index];
                  if (!dataItem) return <text />;
                  const isFirst = dataItem.isFirstInFunction;
                  const dx = x - cx;
                  const dy = y - cy;
                  const dist = Math.sqrt(dx * dx + dy * dy);
                  const nudge = 14;
                  const nx = x + (dx / dist) * nudge;
                  const ny = y + (dy / dist) * nudge;
                  return (
                    <g>
                      {isFirst && (
                        <text
                          x={nx}
                          y={ny - 4}
                          textAnchor={textAnchor}
                          fontSize={10}
                          fontWeight={700}
                          fill="#334155"
                          dominantBaseline="auto"
                        >
                          {dataItem.functionName}
                        </text>
                      )}
                      <text
                        x={nx}
                        y={isFirst ? ny + 11 : ny + 3}
                        textAnchor={textAnchor}
                        fontSize={9}
                        fontWeight={400}
                        fill="#94a3b8"
                        dominantBaseline="auto"
                      >
                        {dataItem.role}
                      </text>
                    </g>
                  );
                }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, domainMax]}
                tick={false}
                axisLine={false}
                ticks={gridTicks}
              />
              <Radar
                name="Lower Quartile"
                dataKey="Lower Quartile"
                stroke="#94a3b8"
                fill="#f1f5f9"
                fillOpacity={0.6}
                strokeWidth={1.5}
                strokeDasharray="6 3"
              />
              <Radar
                name="Median"
                dataKey="Median"
                stroke="#475569"
                fill="none"
                fillOpacity={0}
                strokeWidth={2}
              />
              <Radar
                name="Upper Quartile"
                dataKey="Upper Quartile"
                stroke="#94a3b8"
                fill="#e2e8f0"
                fillOpacity={0.15}
                strokeWidth={1.5}
                strokeDasharray="6 3"
              />
              <Radar
                name={companyInfo.name}
                dataKey="Actual"
                stroke="#6366f1"
                fill="#6366f1"
                fillOpacity={0.12}
                strokeWidth={2.5}
                dot={{ r: 5, fill: "#6366f1", stroke: "#fff", strokeWidth: 2 }}
              />
              <Tooltip content={<CustomRadarTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: 12, paddingTop: 16 }}
                iconType="line"
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-6 section-card" data-testid="strengths-risks-box">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-indigo-500" />
          <h3 className="font-display font-bold text-xl text-slate-800">Strengths and Risks</h3>
        </div>
        <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
          <p>Your market position is mixed, with some roles sitting towards the top of the market and others falling into the bottom half.</p>
          <p>In base pay terms, you are strongest on the finance and commercial side of the business, with all roles sitting in the top half of the market.</p>
          <p>All of your data roles are currently in the bottom half of the market, with the Analyst and Data Systems Engineer sitting below the lower quartile.</p>
          <p className="text-slate-500 italic">Differing market positions are not necessarily a problem — see our help guide for more on this.</p>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 section-card" data-testid="watch-below-lq">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-slate-500" />
            <h3 className="font-display font-bold text-xl">Watch: Below Lower Quartile</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">Roles positioned below market lower quartile, sorted by largest gap</p>
          {belowLQRoles.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-2 font-semibold text-slate-700">Role</th>
                    <th className="text-right py-2 font-semibold text-slate-700">Current</th>
                    <th className="text-right py-2 font-semibold text-slate-700">LQ</th>
                    <th className="text-right py-2 font-semibold text-slate-700">Gap</th>
                  </tr>
                </thead>
                <tbody>
                  {belowLQRoles.map((role) => (
                    <tr key={role.id} className="border-b border-slate-100">
                      <td className="py-3">
                        <p className="font-medium">{role.role}</p>
                        <p className="text-xs text-muted-foreground">{role.function}</p>
                      </td>
                      <td className="text-right py-3 font-medium">£{role.currentSalary.toLocaleString()}</td>
                      <td className="text-right py-3 text-slate-600">£{role.lowerQuartile.toLocaleString()}</td>
                      <td className="text-right py-3 font-semibold text-slate-700">-£{role.gapToLQ.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 text-center bg-emerald-50 rounded-lg">
              <ShieldCheck className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
              <p className="text-emerald-700 font-medium">No roles below lower quartile</p>
              <p className="text-xs text-emerald-500 mt-1">All roles are within or above the market range</p>
            </div>
          )}
        </Card>

        <Card className="p-6 section-card" data-testid="watch-above-uq">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-teal-600" />
            <h3 className="font-display font-bold text-xl">Watch: Above Upper Quartile</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">Roles positioned above market upper quartile, sorted by largest gap</p>
          {aboveUQRoles.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-2 font-semibold text-slate-700">Role</th>
                    <th className="text-right py-2 font-semibold text-slate-700">Current</th>
                    <th className="text-right py-2 font-semibold text-slate-700">UQ</th>
                    <th className="text-right py-2 font-semibold text-slate-700">Gap</th>
                  </tr>
                </thead>
                <tbody>
                  {aboveUQRoles.map((role) => (
                    <tr key={role.id} className="border-b border-slate-100">
                      <td className="py-3">
                        <p className="font-medium">{role.role}</p>
                        <p className="text-xs text-muted-foreground">{role.function}</p>
                      </td>
                      <td className="text-right py-3 font-medium">£{role.currentSalary.toLocaleString()}</td>
                      <td className="text-right py-3 text-slate-600">£{role.upperQuartile.toLocaleString()}</td>
                      <td className="text-right py-3 font-semibold text-teal-700">+£{role.gapToUQ.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 text-center bg-slate-50 rounded-lg">
              <p className="text-slate-600">No roles above upper quartile</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
