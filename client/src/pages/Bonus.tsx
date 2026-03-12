import { Card } from "@/components/ui/card";
import { bonusData, marketData } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Percent, Info, TrendingUp } from "lucide-react";

const careerLevels: Record<string, string> = {
  "Managing Director": "Executive / Director",
  "Finance Director": "Executive / Director",
  "Commercial Director": "Executive / Director",
  "Data Manager": "Senior Manager / Head of",
  "Product Owner": "Manager",
  "Management Accountant": "Senior Professional",
  "Data Systems Engineer": "Senior Professional",
  "Analyst": "Professional",
  "Data Researcher": "Professional",
  "Data Coordinator": "Administrative / Support",
};

export function Bonus() {
  const roleBonus = marketData.map(role => {
    const level = careerLevels[role.role] || "Professional";
    const bonus = bonusData.find(b => b.level === level);
    return {
      ...role,
      bonusLevel: level,
      bonusLQ: bonus?.lq ?? 0,
      bonusMedian: bonus?.median ?? 0,
      bonusUQ: bonus?.uq ?? 0,
    };
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="page-header">
        <p className="page-badge">Variable Pay Analysis</p>
        <h1>Bonuses</h1>
      </div>

      <Card className="p-6 bg-gradient-to-br from-primary to-primary/80 text-white border-0 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
            <Info className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-display font-bold mb-2">About Bonus Data</h2>
            <p className="text-white/80">
              A discretionary or contractual cash payment linked to individual, team or company performance. Excludes base salary and is paid annually or quarterly. The figures below represent typical bonus percentages as a proportion of base salary for the SaaS / Technology sector.
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6 section-card">
        <div className="flex items-center gap-2 mb-6">
          <Percent className="w-5 h-5 text-accent" />
          <h3 className="font-display font-bold text-xl">Bonus by Job Level</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left py-4 px-4 font-semibold">Job Level</th>
                <th className="text-center py-4 px-4 font-semibold text-violet-600">Lower Quartile</th>
                <th className="text-center py-4 px-4 font-semibold text-emerald-600">Median</th>
                <th className="text-center py-4 px-4 font-semibold text-sky-600">Upper Quartile</th>
              </tr>
            </thead>
            <tbody>
              {bonusData.map((row, i) => (
                <tr 
                  key={row.level} 
                  className={cn(
                    "border-b transition-colors hover:bg-muted/20",
                    i % 2 === 0 ? "bg-white" : "bg-muted/10",
                    row.level === "Sales Roles" && "bg-indigo-50/50"
                  )}
                >
                  <td className="py-4 px-4 font-medium">{row.level}</td>
                  <td className="py-4 px-4 text-center">
                    <span className="inline-flex items-center justify-center w-16 py-1.5 rounded-full bg-violet-100 text-violet-700 font-semibold">
                      {row.lq}%
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="inline-flex items-center justify-center w-16 py-1.5 rounded-full bg-emerald-100 text-emerald-700 font-semibold">
                      {row.median}%
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="inline-flex items-center justify-center w-16 py-1.5 rounded-full bg-sky-100 text-sky-700 font-semibold">
                      {row.uq}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-6 section-card">
        <div className="flex items-center gap-2 mb-2">
          <Percent className="w-5 h-5 text-accent" />
          <h3 className="font-display font-bold text-xl">Bonus by Role</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-5">Estimated bonus range for each assessed role based on job level mapping.</p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left py-4 px-4 font-semibold">Role</th>
                <th className="text-left py-4 px-4 font-semibold">Function</th>
                <th className="text-left py-4 px-4 font-semibold">Mapped Level</th>
                <th className="text-right py-4 px-4 font-semibold">Base Salary</th>
                <th className="text-center py-4 px-4 font-semibold text-violet-600">LQ Bonus</th>
                <th className="text-center py-4 px-4 font-semibold text-emerald-600">Median Bonus</th>
                <th className="text-center py-4 px-4 font-semibold text-sky-600">UQ Bonus</th>
              </tr>
            </thead>
            <tbody>
              {roleBonus.map((role, i) => (
                <tr
                  key={role.id}
                  className={cn(
                    "border-b transition-colors hover:bg-muted/20",
                    i % 2 === 0 ? "bg-white" : "bg-muted/10"
                  )}
                >
                  <td className="py-3 px-4 font-medium">{role.role}</td>
                  <td className="py-3 px-4 text-muted-foreground">{role.function}</td>
                  <td className="py-3 px-4 text-muted-foreground text-xs">{role.bonusLevel}</td>
                  <td className="py-3 px-4 text-right font-semibold">£{role.currentSalary.toLocaleString()}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="text-violet-600 font-medium">{role.bonusLQ}%</span>
                    <span className="text-muted-foreground text-xs ml-1">(£{Math.round(role.currentSalary * role.bonusLQ / 100).toLocaleString()})</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="text-emerald-600 font-medium">{role.bonusMedian}%</span>
                    <span className="text-muted-foreground text-xs ml-1">(£{Math.round(role.currentSalary * role.bonusMedian / 100).toLocaleString()})</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="text-sky-600 font-medium">{role.bonusUQ}%</span>
                    <span className="text-muted-foreground text-xs ml-1">(£{Math.round(role.currentSalary * role.bonusUQ / 100).toLocaleString()})</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-6 section-card">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-5 h-5 text-accent" />
          <h3 className="font-display font-bold text-xl">Sector Specific Bonus Strategies</h3>
        </div>

        <p className="text-sm text-muted-foreground mb-6">
          Annual Bonus — % of salary. A discretionary or contractual cash payment linked to individual, team or company performance. Excludes base salary and is paid annually or quarterly.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 rounded-xl overflow-hidden border border-slate-200">
          <div className="border-t-4 border-t-violet-500 p-5 bg-violet-50/30 border-r border-slate-200">
            <p className="text-xs font-bold text-violet-600 uppercase tracking-wider mb-1">Lower Quartile</p>
            <p className="text-xl font-display font-bold text-slate-800 mb-3">5–10% of salary</p>
            <p className="text-sm text-slate-600 leading-relaxed">
              Lower quartile technology employers typically offer a discretionary annual bonus of 5–10% of base salary, often tied to broad company performance metrics with limited individual differentiation. These organisations frequently lack a structured bonus framework, with awards made informally and inconsistently, and may only pay out in strong financial years. Eligibility is often restricted to certain grades or tenure thresholds, and bonus payments are not guaranteed.
            </p>
          </div>

          <div className="border-t-4 border-t-emerald-500 p-5 bg-emerald-50/30 border-r border-slate-200">
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">Median</p>
            <p className="text-xl font-display font-bold text-slate-800 mb-3">10–20% of salary</p>
            <p className="text-sm text-slate-600 leading-relaxed">
              Median-positioned technology employers offer annual bonuses in the range of 10–20% of base salary, typically underpinned by a formal bonus scheme with defined targets split between company, team, and individual performance. Payment is more consistent but still conditional on financial performance gates being met, and schemes are usually documented with clear communication of target and maximum award levels. Roles in software sales, product management, and engineering leadership tend to sit at the higher end of this range.
            </p>
          </div>

          <div className="border-t-4 border-t-sky-500 p-5 bg-sky-50/30">
            <p className="text-xs font-bold text-sky-600 uppercase tracking-wider mb-1">Upper Quartile</p>
            <p className="text-xl font-display font-bold text-slate-800 mb-3">20–40%+ of salary</p>
            <p className="text-sm text-slate-600 leading-relaxed">
              Upper quartile technology employers — including major software vendors, global tech platforms, SaaS scale-ups, and financial technology firms — offer annual bonuses of 20–40% or more of base salary for professional and managerial roles, with senior leadership and commercial functions often exceeding 50%. These organisations operate sophisticated, multi-metric bonus frameworks with defined target bonus percentages by grade, uncapped or high-ceiling accelerators for sales roles, and clear payout curves. Total compensation is frequently benchmarked against US tech market data, pulling UK bonus expectations upward.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 section-card">
          <h3 className="font-display font-bold text-lg mb-4">Sector Trends</h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-3">
              <div className="w-2 h-2 rounded-full bg-accent mt-1.5 shrink-0" />
              <span>Bonus schemes are most common at executive and director level</span>
            </li>
            <li className="flex gap-3">
              <div className="w-2 h-2 rounded-full bg-accent mt-1.5 shrink-0" />
              <span>Many organisations are moving towards team-based or organisational bonuses</span>
            </li>
            <li className="flex gap-3">
              <div className="w-2 h-2 rounded-full bg-accent mt-1.5 shrink-0" />
              <span>Performance-related pay is increasingly linked to ESG and social impact metrics</span>
            </li>
            <li className="flex gap-3">
              <div className="w-2 h-2 rounded-full bg-accent mt-1.5 shrink-0" />
              <span>One-off recognition payments are becoming more popular than annual bonuses</span>
            </li>
          </ul>
        </Card>

        <Card className="p-6 section-card">
          <h3 className="font-display font-bold text-lg mb-4">Considerations</h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-3">
              <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
              <span>Bonus percentages shown are typical maximum or target amounts</span>
            </li>
            <li className="flex gap-3">
              <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
              <span>Actual payments depend on individual and organisational performance</span>
            </li>
            <li className="flex gap-3">
              <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
              <span>Sales roles typically have higher bonus potential with different structures</span>
            </li>
            <li className="flex gap-3">
              <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
              <span>Consider total reward when comparing with organisations without bonus schemes</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
