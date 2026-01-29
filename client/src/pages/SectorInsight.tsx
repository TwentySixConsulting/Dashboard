import { Card } from "@/components/ui/card";
import { sectorInsights } from "@/lib/data";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Building2, TrendingUp, Users, Briefcase, CheckCircle2, AlertTriangle } from "lucide-react";
import logoImage from "@/assets/twentysix-logo.png";

const sectorComparisonData = [
  { sector: "Housing Associations", avgSalary: 42500, color: "hsl(220, 60%, 25%)" },
  { sector: "Local Government", avgSalary: 38200, color: "hsl(200, 85%, 55%)" },
  { sector: "Charities", avgSalary: 36800, color: "hsl(160, 70%, 45%)" },
  { sector: "Private Sector", avgSalary: 48500, color: "hsl(35, 90%, 55%)" },
];

const benefitsData = [
  { benefit: "Flexible Working", percentage: 94 },
  { benefit: "Pension (6%+)", percentage: 88 },
  { benefit: "25+ Days Leave", percentage: 82 },
  { benefit: "Wellbeing Support", percentage: 76 },
  { benefit: "Life Assurance", percentage: 68 },
];

export function SectorInsight() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-sm font-medium text-accent uppercase tracking-wider mb-2">
            Housing Association Analysis
          </p>
          <h1 className="text-4xl lg:text-5xl font-display font-bold text-primary mb-4">
            Sector Insight
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Specific trends and pay data for the Housing Association sector.
          </p>
        </div>
        <img src={logoImage} alt="TwentySix" className="h-10 w-auto hidden lg:block" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 bg-gradient-to-br from-slate-700 to-slate-800 text-white border-0 shadow-md">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold">{sectorInsights.averageSalaryIncrease}%</p>
          <p className="text-sm font-medium text-white/90 mt-1">Avg Salary Increase</p>
        </Card>

        <Card className="p-5 bg-gradient-to-br from-indigo-600 to-indigo-700 text-white border-0 shadow-md">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold">{sectorInsights.medianTurnover}%</p>
          <p className="text-sm font-medium text-white/90 mt-1">Median Turnover</p>
        </Card>

        <Card className="p-5 bg-gradient-to-br from-cyan-600 to-cyan-700 text-white border-0 shadow-md">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold">98%</p>
          <p className="text-sm font-medium text-white/90 mt-1">Living Wage Accredited</p>
        </Card>

        <Card className="p-5 bg-gradient-to-br from-teal-600 to-teal-700 text-white border-0 shadow-md">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold">87%</p>
          <p className="text-sm font-medium text-white/90 mt-1">Hybrid Working</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-white border-0 shadow-md">
          <h3 className="font-display font-bold text-xl mb-2">Sector Salary Comparison</h3>
          <p className="text-sm text-muted-foreground mb-6">Average salaries across related sectors</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sectorComparisonData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={true} vertical={false} />
                <XAxis type="number" tick={{ fontSize: 12 }} stroke="#94a3b8" tickFormatter={(v) => `£${(v/1000).toFixed(0)}k`} />
                <YAxis dataKey="sector" type="category" tick={{ fontSize: 11 }} stroke="#94a3b8" width={130} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "none",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  formatter={(value: number) => [`£${value.toLocaleString()}`, "Avg Salary"]}
                />
                <Bar dataKey="avgSalary" radius={[0, 4, 4, 0]}>
                  {sectorComparisonData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 bg-white border-0 shadow-md">
          <h3 className="font-display font-bold text-xl mb-2">Common Benefits Offered</h3>
          <p className="text-sm text-muted-foreground mb-6">Percentage of housing associations offering</p>
          <div className="space-y-4">
            {benefitsData.map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium">{item.benefit}</span>
                  <span className="text-muted-foreground">{item.percentage}%</span>
                </div>
                <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: `${item.percentage}%`,
                      background: `linear-gradient(90deg, hsl(220, 60%, 25%) 0%, hsl(200, 85%, 55%) 100%)`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-white border-0 shadow-md">
          <h3 className="font-display font-bold text-xl mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            Sector Strengths
          </h3>
          <ul className="space-y-3">
            {[
              "Strong pension contributions averaging 6-8% employer contribution",
              "High adoption of flexible and hybrid working arrangements",
              "Commitment to Real Living Wage accreditation",
              "Comprehensive wellbeing and employee support programmes",
              "Generous annual leave allowances (typically 25-30 days)",
            ].map((item, i) => (
              <li key={i} className="flex gap-3 text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-6 bg-white border-0 shadow-md">
          <h3 className="font-display font-bold text-xl mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Recruitment Challenges
          </h3>
          <ul className="space-y-3">
            {[
              "Technical and trades roles remain difficult to fill",
              "Competition with private sector for specialist skills",
              "Leadership succession planning gaps",
              "Geographic limitations in rural areas",
              "Salary compression affecting career progression appeal",
            ].map((item, i) => (
              <li key={i} className="flex gap-3 text-muted-foreground">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
