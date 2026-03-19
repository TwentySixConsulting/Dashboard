import { useState, useEffect } from "react";
import { Link } from "wouter";
import { companyInfo } from "@/lib/data";
import { getPublishedSections, getPublishedMeta, DashboardSection, DashboardPageMeta, DEFAULT_SECTIONS, DEFAULT_PAGE_META } from "@/lib/dashboardData";
import {
  BarChart3,
  Users,
  AlertTriangle,
  TrendingUp,
  Percent,
  Gift,
  Lightbulb,
  ArrowRight,
  Database,
  ChevronRight,
  MapPin,
  Calendar,
  Home,
  LineChart,
  LucideIcon,
  Briefcase,
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

const cardStyles: Record<string, { gradient: string; glow: string }> = {
  'market-context': { gradient: 'from-emerald-500 to-teal-600', glow: 'shadow-emerald-500/10' },
  'market-data': { gradient: 'from-blue-500 to-indigo-600', glow: 'shadow-blue-500/10' },
  'role-details': { gradient: 'from-violet-500 to-purple-600', glow: 'shadow-violet-500/10' },
  'market-comparison': { gradient: 'from-indigo-500 to-blue-600', glow: 'shadow-indigo-500/10' },
  'bonus': { gradient: 'from-pink-500 to-rose-600', glow: 'shadow-pink-500/10' },
  'benefits': { gradient: 'from-teal-400 to-cyan-600', glow: 'shadow-teal-500/10' },
  'benefits-trends': { gradient: 'from-orange-400 to-amber-500', glow: 'shadow-orange-500/10' },
  'next-steps': { gradient: 'from-cyan-400 to-blue-500', glow: 'shadow-cyan-500/10' },
  'data-sources': { gradient: 'from-slate-400 to-slate-600', glow: 'shadow-slate-500/10' },
};

function DashboardCard({ section, index }: { section: DashboardSection; index: number }) {
  const IconComponent = iconMap[section.icon || 'barChart'] || BarChart3;
  const style = cardStyles[section.slug] || { gradient: 'from-slate-400 to-slate-600', glow: 'shadow-slate-500/10' };

  return (
    <Link href={section.route}>
      <div
        className={`relative bg-white rounded-2xl p-5 cursor-pointer group transition-all duration-500 opacity-0 animate-slide-up stagger-${Math.min(index + 1, 8)} hover:-translate-y-1`}
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 24px rgba(0,0,0,0.04)' }}
        data-testid={`launcher-${section.slug}`}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.04), 0 12px 40px rgba(0,0,0,0.1)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.04), 0 4px 24px rgba(0,0,0,0.04)';
        }}
      >
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${style.gradient} flex items-center justify-center shrink-0 shadow-lg ${style.glow} group-hover:scale-110 transition-transform duration-300`}>
            <IconComponent className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-slate-800 group-hover:text-blue-600 transition-colors duration-300">
                {section.title}
              </h3>
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-all duration-300">
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all duration-300 shrink-0" />
              </div>
            </div>
            <p className="text-[13px] text-slate-400 mt-1.5 leading-relaxed">{section.description}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

function StatCard({ icon: Icon, label, value, gradient, delay }: {
  icon: LucideIcon;
  label: string;
  value: string;
  gradient: string;
  delay: number;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br ${gradient} text-white opacity-0 animate-slide-up card-shine`}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-8 translate-x-8" />
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-6 -translate-x-6" />
      <div className="relative">
        <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center mb-3">
          <Icon className="w-5 h-5" />
        </div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/60 mb-1">{label}</p>
        <p className="font-display font-bold text-lg leading-tight">{value}</p>
      </div>
    </div>
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
    <div className="max-w-6xl mx-auto space-y-10">
      <div className="page-header animate-fade-in">
        <p className="page-badge">
          Pay & Benefits Dashboard
        </p>
        <h1 className="text-4xl lg:text-5xl font-display font-bold text-slate-900 mb-3" data-testid="dashboard-headline"
          style={{ background: 'linear-gradient(135deg, hsl(228 35% 11%) 0%, hsl(228 25% 25%) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Brighton Demo's Dashboard
        </h1>
        <p className="text-sm text-slate-400" data-testid="dashboard-subheadline">By Zigbert</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatCard icon={Briefcase} label="Sector" value={companyInfo.industry} gradient="from-blue-500 to-indigo-600" delay={0.05} />
        <StatCard icon={MapPin} label="Dataset" value={companyInfo.location} gradient="from-violet-500 to-purple-600" delay={0.1} />
        <StatCard icon={Calendar} label="Date" value={companyInfo.reportDate} gradient="from-emerald-500 to-teal-600" delay={0.15} />
      </div>

      <div>
        <h2 className="text-2xl font-display font-bold text-slate-800 mb-1">Explore Your Report</h2>
        <p className="text-slate-400 mb-6 text-[15px]">Select a section to dive into your pay and benefits insights.</p>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-5 animate-pulse" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100" />
                  <div className="flex-1">
                    <div className="h-4 bg-slate-100 rounded-lg w-1/2 mb-3" />
                    <div className="h-3 bg-slate-50 rounded-lg w-3/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sections.map((section, index) => (
              <DashboardCard key={section.id} section={section} index={index} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
