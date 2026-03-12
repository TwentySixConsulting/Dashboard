import { useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, TrendingDown, Flame, Snowflake, BarChart3, Download, Zap } from "lucide-react";

import { toPng } from "html-to-image";

const payRiseComparisonData = [
  { category: "CIPD Forecast", value: 3.0, color: "#3b82f6" },
  { category: "Statutory Min Wage", value: 4.1, color: "#10b981" },
];

function ExportableChart({ 
  children, 
  title, 
  filename,
}: { 
  children: React.ReactNode; 
  title: string; 
  filename: string;
}) {
  const chartRef = useRef<HTMLDivElement>(null);

  const handleExport = async () => {
    if (chartRef.current) {
      try {
        const dataUrl = await toPng(chartRef.current, {
          backgroundColor: "#ffffff",
          pixelRatio: 2,
        });
        const link = document.createElement("a");
        link.download = `${filename}.png`;
        link.href = dataUrl;
        link.click();
      } catch (error) {
        console.error("Failed to export image:", error);
      }
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-display font-semibold text-sm text-slate-600">{title}</h4>
        <Button 
          onClick={handleExport} 
          variant="ghost" 
          size="sm" 
          className="gap-1 text-muted-foreground hover:text-foreground h-7 px-2"
        >
          <Download className="w-3.5 h-3.5" />
        </Button>
      </div>
      <div ref={chartRef} className="bg-white p-2">
        {children}
      </div>
    </div>
  );
}

export function MarketOverview() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="page-header">
        <p className="page-badge">Market Intelligence</p>
        <h1>Trends & Hotspots</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 section-card">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-indigo-500" />
            </div>
            <h3 className="font-display font-bold text-lg text-slate-800">Technology Sector Pay Rises</h3>
          </div>
          <div className="space-y-3 text-sm text-slate-600">
            <p>
              The UK technology sector continues to see pay growth moderately above the cross-sector average. Median pay increases for tech roles in 2025/26 are running at <strong className="text-slate-800">3.5–4.5%</strong>, driven by sustained demand for specialist skills in AI/ML, cloud infrastructure, and cybersecurity.
            </p>
            <ul className="space-y-2">
              <li className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                <span>SaaS and platform companies are budgeting 4–5% increases for engineering and product roles to remain competitive</span>
              </li>
              <li className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                <span>Data and analytics functions are seeing above-average rises of 4–6% as demand outstrips supply</span>
              </li>
              <li className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                <span>Support and administrative tech roles are tracking closer to the UK average at 3–3.5%</span>
              </li>
              <li className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                <span>Remote-first companies are increasingly benchmarking against London salaries regardless of employee location</span>
              </li>
            </ul>
          </div>
        </Card>

        <Card className="p-6 section-card">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
            <h3 className="font-display font-bold text-lg text-slate-800">UK Pay Rises 2026</h3>
          </div>
          <div className="prose prose-sm max-w-none text-slate-600 mb-5">
            <p className="mb-3">
              We anticipate that continued increases in the <strong className="text-slate-800">statutory and Real Living Wages</strong> will continue to dominate the pay landscape throughout 2026.
            </p>
            <p className="mb-3">
              Pay rises as a whole are forecast to sit in the region of <strong className="text-slate-800">3.0%</strong> (CIPD Labour Market Outlook); however, the latest estimate for the statutory minimum wage is an increase of <strong className="text-slate-800">4.1%</strong>.
            </p>
            <p>
              This upwards pressure at the bottom of the market will have a longer term transformational effect on the labour market.
            </p>
          </div>
          
          <ExportableChart title="2026 Pay Rise Comparison" filename="pay-rise-comparison">
            <div className="h-36">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={payRiseComparisonData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={true} vertical={false} />
                  <XAxis type="number" tick={{ fontSize: 11 }} stroke="#94a3b8" domain={[0, 5]} tickFormatter={(v) => `${v}%`} />
                  <YAxis dataKey="category" type="category" tick={{ fontSize: 11 }} stroke="#94a3b8" width={120} />
                  <Tooltip formatter={(value: number) => [`${value}%`]} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {payRiseComparisonData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ExportableChart>
        </Card>
      </div>

      <Card className="p-6 section-card">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
            <Zap className="w-4 h-4 text-slate-600" />
          </div>
          <h3 className="font-display font-bold text-xl text-slate-800">The Market at a Glance</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-amber-50/60 p-5 rounded-xl border border-amber-100">
            <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center mb-3">
              <span className="text-amber-600 font-bold text-sm">1</span>
            </div>
            <h4 className="font-display font-bold text-slate-800 mb-2">Differential Pay Rises</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              The lion's share of any increased pay pot is going to those at the bottom of the market — this has resulted in some senior level salaries showing only small or no increases. The statutory minimum wage rise of 4.1% continues to push up entry-level pay faster than mid-career roles.
            </p>
          </div>
          
          <div className="bg-blue-50/60 p-5 rounded-xl border border-blue-100">
            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center mb-3">
              <span className="text-blue-600 font-bold text-sm">2</span>
            </div>
            <h4 className="font-display font-bold text-slate-800 mb-2">Pay Compression</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              Compression between bottom grades and those just above is creating difficulties in establishing clear career paths, especially for supervisory roles. The gap between entry-level and experienced professionals is narrowing across many sectors.
            </p>
          </div>
          
          <div className="bg-violet-50/60 p-5 rounded-xl border border-violet-100">
            <div className="w-9 h-9 rounded-full bg-violet-100 flex items-center justify-center mb-3">
              <span className="text-violet-600 font-bold text-sm">3</span>
            </div>
            <h4 className="font-display font-bold text-slate-800 mb-2">Labour Market Softening</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              Unemployment has risen from 4.2% to 5.1% over the past 18 months. Vacancy numbers are falling and hiring cycles are lengthening. However, specialist technical and data roles remain tight with quality candidates in short supply.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 section-card border-l-4 border-l-orange-400">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
              <Flame className="w-4 h-4 text-orange-500" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-slate-800">Heating Up</h3>
              <p className="text-xs text-slate-400">Roles with increasing demand and upward pay pressure</p>
            </div>
          </div>
          <ul className="space-y-3 text-sm text-slate-600">
            <li className="flex gap-3">
              <TrendingUp className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-800">AI / Machine Learning Engineers</span>
                <p className="text-xs text-slate-500 mt-0.5">Salaries up 8–12% YoY. Fierce competition from US-funded companies offering remote roles at premium rates.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <TrendingUp className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-800">Data Engineers & Analytics Leads</span>
                <p className="text-xs text-slate-500 mt-0.5">Growing 5–8% as organisations invest heavily in data infrastructure and real-time analytics capabilities.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <TrendingUp className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-800">Cybersecurity Specialists</span>
                <p className="text-xs text-slate-500 mt-0.5">Regulatory pressure and rising threat landscape driving 6–10% increases with significant signing bonuses.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <TrendingUp className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-800">Product Managers (SaaS)</span>
                <p className="text-xs text-slate-500 mt-0.5">Experienced PMs with commercial acumen seeing 4–7% increases as SaaS firms prioritise product-led growth.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <TrendingUp className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-800">Cloud / DevOps Engineers</span>
                <p className="text-xs text-slate-500 mt-0.5">Multi-cloud expertise in high demand with 5–8% pay growth. AWS and Azure certifications commanding premium.</p>
              </div>
            </li>
          </ul>
        </Card>

        <Card className="p-6 section-card border-l-4 border-l-sky-400">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center">
              <Snowflake className="w-4 h-4 text-sky-500" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-slate-800">Cooling Down</h3>
              <p className="text-xs text-slate-400">Roles with easing demand or flattening pay growth</p>
            </div>
          </div>
          <ul className="space-y-3 text-sm text-slate-600">
            <li className="flex gap-3">
              <TrendingDown className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-800">Junior / Graduate Developers</span>
                <p className="text-xs text-slate-500 mt-0.5">Increased supply from bootcamps and university programmes. Pay rises slowing to 1–2% with longer hiring cycles.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <TrendingDown className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-800">IT Support & Helpdesk</span>
                <p className="text-xs text-slate-500 mt-0.5">Automation and AI chatbots reducing headcount needs. Pay flat or tracking statutory minimum only.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <TrendingDown className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-800">QA / Manual Testing</span>
                <p className="text-xs text-slate-500 mt-0.5">Shift towards automated testing reducing demand. Roles increasingly consolidated into development teams.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <TrendingDown className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-800">Project Managers (Generalist)</span>
                <p className="text-xs text-slate-500 mt-0.5">Agile transformation reducing need for traditional PMs. Pay growth stalling at 1–3% unless paired with technical specialism.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <TrendingDown className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-800">General Admin / Data Entry</span>
                <p className="text-xs text-slate-500 mt-0.5">AI-assisted workflows and process automation reducing volume. Roles being redesigned with broader scope.</p>
              </div>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
