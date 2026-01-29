import { useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { TrendingUp, Percent, PoundSterling, BarChart3, Download } from "lucide-react";
import logoImage from "@/assets/twentysix-logo.png";
import { toPng } from "html-to-image";

function QuartilesExplained() {
  const graphicRef = useRef<HTMLDivElement>(null);

  const handleExport = async () => {
    if (graphicRef.current) {
      try {
        const dataUrl = await toPng(graphicRef.current, {
          backgroundColor: "#ffffff",
          pixelRatio: 2,
        });
        const link = document.createElement("a");
        link.download = "quartiles-explained.png";
        link.href = dataUrl;
        link.click();
      } catch (error) {
        console.error("Failed to export image:", error);
      }
    }
  };

  return (
    <Card className="p-6 bg-white border-0 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-bold text-xl">Quartiles Explained</h3>
        <Button 
          onClick={handleExport} 
          variant="outline" 
          size="sm" 
          className="gap-2"
          data-testid="button-export-quartiles"
        >
          <Download className="w-4 h-4" />
          Export Image
        </Button>
      </div>

      <div ref={graphicRef} className="p-4 bg-white">
        {/* Horizontal Bar Graphic */}
        <div className="mb-6">
          <div className="flex h-12 rounded-lg overflow-hidden border border-slate-200">
            <div className="flex-1 bg-red-100 flex items-center justify-center border-r border-slate-200">
              <span className="text-xs font-medium text-red-700 text-center px-1">Below Lower Quartile</span>
            </div>
            <div className="flex-1 bg-amber-100 flex items-center justify-center border-r border-slate-200">
              <span className="text-xs font-medium text-amber-700 text-center px-1">LQ → Median</span>
            </div>
            <div className="flex-1 bg-emerald-100 flex items-center justify-center border-r border-slate-200">
              <span className="text-xs font-medium text-emerald-700 text-center px-1">Median → UQ</span>
            </div>
            <div className="flex-1 bg-blue-100 flex items-center justify-center">
              <span className="text-xs font-medium text-blue-700 text-center px-1">Above Upper Quartile</span>
            </div>
          </div>

          {/* Reference Points */}
          <div className="relative h-8 mt-1">
            <div className="absolute left-0 right-0 top-0 h-px bg-slate-300" />
            
            {/* LQ tick */}
            <div className="absolute" style={{ left: "25%" }}>
              <div className="w-px h-3 bg-slate-400 -translate-x-1/2" />
              <p className="text-xs text-slate-600 font-medium mt-1 -translate-x-1/2 whitespace-nowrap">Lower Quartile</p>
            </div>
            
            {/* Median tick */}
            <div className="absolute" style={{ left: "50%" }}>
              <div className="w-px h-3 bg-slate-600 -translate-x-1/2" />
              <p className="text-xs text-slate-800 font-semibold mt-1 -translate-x-1/2">Median</p>
            </div>
            
            {/* UQ tick */}
            <div className="absolute" style={{ left: "75%" }}>
              <div className="w-px h-3 bg-slate-400 -translate-x-1/2" />
              <p className="text-xs text-slate-600 font-medium mt-1 -translate-x-1/2 whitespace-nowrap">Upper Quartile</p>
            </div>
          </div>
        </div>

        {/* Explanation */}
        <p className="text-sm text-muted-foreground leading-relaxed">
          <strong>Market data points:</strong> We use three standard reference points — Lower Quartile (LQ), Median, and Upper Quartile (UQ). 
          <strong> Position bands:</strong> Each role's salary is categorised into one of four bands based on where it falls relative to these reference points. 
          This helps identify whether a role is paid below market, around the middle, or above market rates.
        </p>
      </div>
    </Card>
  );
}

export function MarketOverview() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-sm font-medium text-accent uppercase tracking-wider mb-2">
            UK Labour Market Analysis
          </p>
          <h1 className="text-4xl lg:text-5xl font-display font-bold text-primary mb-4">
            Market Context
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Current economic indicators and market outlook shaping the employment landscape.
          </p>
        </div>
        <img src={logoImage} alt="TwentySix" className="h-10 w-auto hidden lg:block" style={{ opacity: 1 }} />
      </div>

      {/* Quartiles Explained */}
      <QuartilesExplained />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-5 bg-gradient-to-br from-red-500 to-red-600 text-white border-0 shadow-lg">
            <div className="flex items-center gap-2 mb-3">
              <Percent className="w-5 h-5" />
              <span className="text-sm font-medium opacity-90">CPI Inflation</span>
            </div>
            <p className="text-4xl font-bold">{marketTrends.cpi}%</p>
            <p className="text-xs opacity-75 mt-2">August 2025 (ONS)</p>
          </Card>

          <Card className="p-5 bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
            <div className="flex items-center gap-2 mb-3">
              <PoundSterling className="w-5 h-5" />
              <span className="text-sm font-medium opacity-90">Avg Weekly Earnings</span>
            </div>
            <p className="text-4xl font-bold">£{marketTrends.averageWeeklyEarnings}</p>
            <p className="text-xs opacity-75 mt-2">Total pay growth 4.0%</p>
          </Card>

          <Card className="p-5 bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm font-medium opacity-90">Pay Rise Prediction</span>
            </div>
            <p className="text-4xl font-bold">{marketTrends.payRisePrediction}%</p>
            <p className="text-xs opacity-75 mt-2">2026 forecast</p>
          </Card>

          <Card className="p-5 bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="w-5 h-5" />
              <span className="text-sm font-medium opacity-90">Sector Pay Rise</span>
            </div>
            <p className="text-4xl font-bold">{marketTrends.averagePayRise}%</p>
            <p className="text-xs opacity-75 mt-2">Housing Association avg</p>
          </Card>
        </div>

        <Card className="p-6 bg-white border-0 shadow-md">
          <h3 className="font-display font-bold text-xl mb-4">Market Commentary</h3>
          <div className="prose prose-sm text-muted-foreground">
            <p className="mb-3">
              The UK labour market continues to show signs of weakening, with unemployment rising to 4.7% and fewer job vacancies across most sectors. However, pay pressures remain due to persistent inflation above the Bank of England's 2% target.
            </p>
            <p className="mb-3">
              For the Housing Association sector, we're seeing differential pay rises with the majority of budget going to lower-paid roles to maintain Living Wage commitments. This is creating compression between grades.
            </p>
            <p>
              Looking ahead to 2026, we expect pay rises to average 3.5% across the sector, with continued pressure on technical and specialist roles where skill shortages persist.
            </p>
          </div>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mb-3">
              <span className="text-amber-600 font-bold">1</span>
            </div>
            <h4 className="font-semibold mb-2">National Insurance Increases</h4>
            <p className="text-sm text-muted-foreground">
              Steep rises in NI contributions alongside the April 2025 NLW increase to £12.21 have significantly increased business costs.
            </p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-3">
              <span className="text-blue-600 font-bold">2</span>
            </div>
            <h4 className="font-semibold mb-2">Differential Pay Rises</h4>
            <p className="text-sm text-muted-foreground">
              Most pay budget going to lower-paid roles, resulting in manager-level salaries showing minimal increases.
            </p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mb-3">
              <span className="text-purple-600 font-bold">3</span>
            </div>
            <h4 className="font-semibold mb-2">Grade Compression</h4>
            <p className="text-sm text-muted-foreground">
              Compression between bottom grades is causing difficulties in creating career paths, especially for supervisory roles.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
