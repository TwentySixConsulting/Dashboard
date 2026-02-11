import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { companyInfo } from "@/lib/data";
import { getPublishedSections, getPublishedMeta, DashboardSection, DashboardPageMeta, DEFAULT_SECTIONS, DEFAULT_PAGE_META } from "@/lib/dashboardData";
import {
  BarChart3,
  Users,
  AlertTriangle,
  TrendingUp,
  Building2,
  Percent,
  Gift,
  Lightbulb,
  ArrowRight,
  Database,
  ChevronRight,
  MapPin,
  Calendar,
  HelpCircle,
  Home,
  LineChart,
  LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  home: Home,
  trendingUp: TrendingUp,
  barChart: BarChart3,
  users: Users,
  alertTriangle: AlertTriangle,
  lineChart: LineChart,
  percent: Percent,
  gift: Gift,
  lightbulb: Lightbulb,
  arrowRight: ArrowRight,
  database: Database,
};

const colorMap: Record<string, string> = {
  'market-context': 'from-emerald-500 to-emerald-600',
  'market-data': 'from-blue-500 to-blue-600',
  'role-details': 'from-purple-500 to-purple-600',
  'risks': 'from-amber-400 to-amber-500',
  'market-comparison': 'from-indigo-500 to-indigo-600',
  'bonus': 'from-pink-500 to-pink-600',
  'benefits': 'from-teal-500 to-teal-600',
  'benefits-trends': 'from-orange-400 to-orange-500',
  'next-steps': 'from-cyan-500 to-cyan-600',
  'data-sources': 'from-slate-500 to-slate-600',
};

function DashboardCard({ section }: { section: DashboardSection }) {
  const IconComponent = iconMap[section.icon || 'barChart'] || BarChart3;
  const gradient = colorMap[section.slug] || 'from-slate-500 to-slate-600';

  return (
    <Link href={section.route}>
      <Card
        className="p-5 bg-white border-0 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group"
        data-testid={`launcher-${section.slug}`}
      >
        <div className="flex items-start gap-4">
          <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0`}>
            <IconComponent className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                {section.title}
              </h3>
              <div className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-all">
                <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all shrink-0" />
              </div>
            </div>
            <p className="text-sm text-slate-500 mt-1 leading-relaxed">{section.description}</p>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export function ExecutiveSummary() {
  const [sections, setSections] = useState<DashboardSection[]>([]);
  const [pageMeta, setPageMeta] = useState<DashboardPageMeta>(DEFAULT_PAGE_META);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [sectionsData, metaData] = await Promise.all([
        getPublishedSections(),
        getPublishedMeta()
      ]);
      setSections(sectionsData);
      setPageMeta(metaData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setSections(DEFAULT_SECTIONS.filter(s => s.slug !== 'dashboard'));
      setPageMeta(DEFAULT_PAGE_META);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-500 uppercase tracking-wider mb-2">
            Personalised Pay & Benefits Dashboard
          </p>
          <h1 className="text-4xl lg:text-5xl font-display font-bold text-slate-900 mb-3" data-testid="dashboard-headline">
            {pageMeta.headline || 'Use Your Dashboard'}
          </h1>
          <Link href="#pay-ranges">
            <span className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-600 transition-colors cursor-pointer" data-testid="dashboard-subheadline">
              <HelpCircle className="w-4 h-4" />
              <span className="text-sm font-medium">{pageMeta.subheadline || 'How to interpret pay ranges'}</span>
            </span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 bg-gradient-to-br from-slate-800 to-slate-900 border-0 shadow-md flex items-center gap-4 text-white">
          <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-[10px] text-white/50 uppercase tracking-wider font-medium">Organisation</p>
            <p className="font-semibold">{companyInfo.name}</p>
          </div>
        </Card>

        <Card className="p-5 bg-gradient-to-br from-blue-500 to-blue-600 border-0 shadow-md flex items-center gap-4 text-white">
          <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-[10px] text-white/50 uppercase tracking-wider font-medium">Sector & Location</p>
            <p className="font-semibold">{companyInfo.industry}, {companyInfo.location}</p>
          </div>
        </Card>

        <Card className="p-5 bg-gradient-to-br from-emerald-500 to-emerald-600 border-0 shadow-md flex items-center gap-4 text-white">
          <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-[10px] text-white/50 uppercase tracking-wider font-medium">Report Date</p>
            <p className="font-semibold">{companyInfo.reportDate}</p>
          </div>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-display font-bold text-slate-800 mb-2">What do you want to explore?</h2>
        <p className="text-slate-500 mb-6">Select a section to dive into your personalised pay and benefits insights.</p>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="p-5 bg-white border-0 shadow-sm animate-pulse">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-slate-100" />
                  <div className="flex-1">
                    <div className="h-4 bg-slate-100 rounded w-1/2 mb-2" />
                    <div className="h-3 bg-slate-100 rounded w-3/4" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sections.map((section) => (
              <DashboardCard key={section.id} section={section} />
            ))}
          </div>
        )}
      </div>

      <Card id="pay-ranges" className="p-6 bg-white border-0 shadow-sm">
        <h3 className="font-display font-bold text-lg text-slate-800 mb-4">How to Interpret Pay Ranges</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="bg-red-50 rounded-xl p-4 text-center border border-red-100">
            <p className="font-semibold text-sm mb-1 text-red-600">Below LQ</p>
            <p className="text-xs text-slate-500">Below what 75% of the market pays</p>
          </div>
          <div className="bg-amber-50 rounded-xl p-4 text-center border border-amber-100">
            <p className="font-semibold text-sm mb-1 text-amber-600">LQ to Median</p>
            <p className="text-xs text-slate-500">Lower half of the typical market range</p>
          </div>
          <div className="bg-emerald-50 rounded-xl p-4 text-center border border-emerald-100">
            <p className="font-semibold text-sm mb-1 text-emerald-600">Median to UQ</p>
            <p className="text-xs text-slate-500">Upper half of the typical market range</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-100">
            <p className="font-semibold text-sm mb-1 text-blue-600">Above UQ</p>
            <p className="text-xs text-slate-500">Above what 75% of the market pays</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
