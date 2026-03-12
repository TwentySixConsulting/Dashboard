import { Card } from "@/components/ui/card";
import { marketData, companyInfo } from "@/lib/data";
import { TrendingUp, TrendingDown, Target, AlertCircle, CheckCircle2, ShieldCheck, AlertTriangle } from "lucide-react";
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
  const aboveCount = marketData.filter(r => r.currentSalary >= r.median).length;

  const radarData = marketData.map((role) => {
    const m = role.median;
    return {
      role: role.role,
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

  const maxPct = Math.max(
    ...radarData.map(d => Math.max(d["Upper Quartile"], d["Actual"]))
  );
  const domainMax = Math.ceil(maxPct / 10) * 10;

  const rolesWithBands = marketData.map((role) => ({
    ...role,
    band: getPositionBand(role.currentSalary, role.lowerQuartile, role.median, role.upperQuartile),
    gapToLQ: role.lowerQuartile - role.currentSalary,
    gapToUQ: role.currentSalary - role.upperQuartile,
  }));

  const strengths = rolesWithBands.filter(r => r.band === "medianToUQ" || r.band === "aboveUQ");
  const risks = rolesWithBands.filter(r => r.band === "belowLQ" || r.band === "lqToMedian");

  const belowLQRoles = rolesWithBands
    .filter((r) => r.band === "belowLQ")
    .sort((a, b) => b.gapToLQ - a.gapToLQ);

  const aboveUQRoles = rolesWithBands
    .filter((r) => r.band === "aboveUQ")
    .sort((a, b) => b.gapToUQ - a.gapToUQ);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="page-header">
        <p className="page-badge">Overview</p>
        <h1>Your Market Position</h1>
        <p className="page-subtitle">How {companyInfo.name}'s pay compares to the market across all assessed roles.</p>
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

      <Card className="p-6 section-card" data-testid="headline-profile">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
            <Target className="w-4 h-4 text-indigo-500" />
          </div>
          <h3 className="font-display font-bold text-xl text-slate-800">{companyInfo.name}'s Headline Profile</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Average Salary</p>
            <p className="text-xl font-display font-bold text-slate-800">£{overallAvgActual.toLocaleString()}</p>
            <p className="text-xs text-slate-400 mt-1">across {marketData.length} roles</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Market Median (avg)</p>
            <p className="text-xl font-display font-bold text-slate-800">£{overallAvgMedian.toLocaleString()}</p>
            <p className="text-xs text-slate-400 mt-1">benchmark comparison</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Market Alignment</p>
            <div className="flex items-center gap-2">
              {overallDiff >= 0 ? (
                <TrendingUp className="w-5 h-5 text-emerald-500" />
              ) : (
                <TrendingDown className="w-5 h-5 text-amber-500" />
              )}
              <p className={`text-xl font-display font-bold ${overallDiff >= 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
                {overallDiff >= 0 ? '+' : ''}£{Math.abs(overallDiff).toLocaleString()}
              </p>
            </div>
            <p className="text-xs text-slate-400 mt-1">{overallDiff >= 0 ? 'above' : 'below'} market average</p>
          </div>
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
              <p className="text-xs text-slate-400">Each role normalised to its median (100%). Hover for actual salary values.</p>
            </div>
          </div>
        </div>
        <div className="px-4 pb-6">
          <ResponsiveContainer width="100%" height={500}>
            <RadarChart data={radarData} outerRadius="72%">
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis
                dataKey="role"
                tick={{ fontSize: 11, fill: "#64748b" }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, domainMax]}
                tick={{ fontSize: 9, fill: "#94a3b8" }}
                tickFormatter={(v: number) => `${v}%`}
                tickCount={5}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 section-card" data-testid="strengths-box">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <h3 className="font-display font-bold text-xl text-slate-800">Strengths</h3>
          </div>
          <p className="text-sm text-slate-400 mb-4">Roles positioned at or above market median</p>
          {strengths.length > 0 ? (
            <div className="space-y-2">
              {strengths.map((role) => {
                const diffPct = ((role.currentSalary - role.median) / role.median * 100).toFixed(1);
                return (
                  <div key={role.id} className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-emerald-50/50 border border-emerald-100">
                    <div>
                      <p className="font-medium text-sm text-slate-800">{role.role}</p>
                      <p className="text-xs text-slate-400">{role.function}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm text-emerald-600">+{diffPct}%</p>
                      <p className="text-xs text-slate-400">vs median</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-6 text-center bg-slate-50 rounded-lg">
              <p className="text-slate-500">No roles above median</p>
            </div>
          )}
        </Card>

        <Card className="p-6 section-card" data-testid="risks-box">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h3 className="font-display font-bold text-xl text-slate-800">Risks</h3>
          </div>
          <p className="text-sm text-slate-400 mb-4">Roles positioned below market median</p>
          {risks.length > 0 ? (
            <div className="space-y-2">
              {risks.map((role) => {
                const diffPct = ((role.currentSalary - role.median) / role.median * 100).toFixed(1);
                return (
                  <div key={role.id} className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-amber-50/50 border border-amber-100">
                    <div>
                      <p className="font-medium text-sm text-slate-800">{role.role}</p>
                      <p className="text-xs text-slate-400">{role.function}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm text-amber-600">{diffPct}%</p>
                      <p className="text-xs text-slate-400">vs median</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-6 text-center bg-slate-50 rounded-lg">
              <p className="text-slate-500">No roles below median</p>
            </div>
          )}
        </Card>
      </div>

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
