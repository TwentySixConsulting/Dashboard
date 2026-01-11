import { Card } from "@/components/ui/card";
import { marketTrends, cpiTrendData, salaryTrendData } from "@/lib/data";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { TrendingUp, TrendingDown, Percent, PoundSterling, Users, AlertCircle } from "lucide-react";

export function MarketOverview() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="mb-12">
        <p className="text-sm font-medium text-accent uppercase tracking-wider mb-2">
          UK Labour Market Analysis
        </p>
        <h1 className="text-4xl lg:text-5xl font-display font-bold text-primary mb-4">
          Market Overview
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Current trends and economic indicators shaping the employment landscape.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 bg-white border-0 shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Percent className="w-5 h-5 text-accent" />
            </div>
            <TrendingUp className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-3xl font-bold text-primary">{marketTrends.averagePayRise}%</p>
          <p className="text-sm text-muted-foreground mt-1">Average Pay Rise</p>
        </Card>

        <Card className="p-5 bg-white border-0 shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-red-500" />
            </div>
            <AlertCircle className="w-4 h-4 text-red-400" />
          </div>
          <p className="text-3xl font-bold text-primary">{marketTrends.cpi}%</p>
          <p className="text-sm text-muted-foreground mt-1">CPI Inflation</p>
        </Card>

        <Card className="p-5 bg-white border-0 shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <PoundSterling className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-primary">£{marketTrends.realLivingWage}</p>
          <p className="text-sm text-muted-foreground mt-1">Real Living Wage</p>
        </Card>

        <Card className="p-5 bg-white border-0 shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <TrendingDown className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-3xl font-bold text-primary">{marketTrends.unemploymentRate}%</p>
          <p className="text-sm text-muted-foreground mt-1">Unemployment Rate</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-white border-0 shadow-md">
          <h3 className="font-display font-bold text-xl mb-2">CPI Trend 2025</h3>
          <p className="text-sm text-muted-foreground mb-6">Consumer Price Index monthly movement</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cpiTrendData}>
                <defs>
                  <linearGradient id="cpiGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(200, 85%, 55%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(200, 85%, 55%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" domain={[0, 5]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "none",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  formatter={(value: number) => [`${value}%`, "CPI"]}
                />
                <Area
                  type="monotone"
                  dataKey="cpi"
                  stroke="hsl(200, 85%, 55%)"
                  strokeWidth={2}
                  fill="url(#cpiGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 bg-white border-0 shadow-md">
          <h3 className="font-display font-bold text-xl mb-2">Salary Increase Trends</h3>
          <p className="text-sm text-muted-foreground mb-6">Housing sector vs overall market</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salaryTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" domain={[0, 6]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "none",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  formatter={(value: number) => [`${value}%`]}
                />
                <Line
                  type="monotone"
                  dataKey="housing"
                  name="Housing Sector"
                  stroke="hsl(220, 60%, 25%)"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "hsl(220, 60%, 25%)" }}
                />
                <Line
                  type="monotone"
                  dataKey="market"
                  name="Overall Market"
                  stroke="hsl(200, 85%, 55%)"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "hsl(200, 85%, 55%)" }}
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-6 mt-4 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-sm text-muted-foreground">Housing Sector</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-accent" />
              <span className="text-sm text-muted-foreground">Overall Market</span>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-8 bg-white border-0 shadow-md">
        <h3 className="font-display font-bold text-xl mb-6">Key Market Developments</h3>
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
              <span className="text-amber-600 font-bold">1</span>
            </div>
            <div>
              <h4 className="font-semibold mb-1">National Insurance Increases</h4>
              <p className="text-muted-foreground">
                Businesses have experienced significant increases in costs with steep rises in national insurance contributions, alongside the April 2025 increase in the National Living Wage to £12.21.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <span className="text-blue-600 font-bold">2</span>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Differential Pay Rises</h4>
              <p className="text-muted-foreground">
                The lion's share of increased pay budgets is going to those at the bottom of the market, resulting in manager-level salaries showing only small or no increases.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
              <span className="text-purple-600 font-bold">3</span>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Grade Compression</h4>
              <p className="text-muted-foreground">
                Compression between bottom grades and those just above is causing difficulties in creating career paths, especially for supervisory roles.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
