import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { companyInfo } from "@/lib/data";
import { getPublishedSections, getPublishedMeta, DashboardSection, DashboardPageMeta, DEFAULT_SECTIONS, DEFAULT_PAGE_META } from "@/lib/dashboardData";
import logoImage from "@/assets/twentysix-logo.png";
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
  'market-context': 'bg-emerald-600',
  'market-data': 'bg-blue-600',
  'role-details': 'bg-purple-600',
  'risks': 'bg-amber-500',
  'market-comparison': 'bg-indigo-600',
  'bonus': 'bg-pink-600',
  'benefits': 'bg-teal-600',
  'benefits-trends': 'bg-orange-500',
  'next-steps': 'bg-cyan-600',
  'data-sources': 'bg-slate-600',
};

export function ExecutiveSummary() {
  const [sections, setSections] = useState<DashboardSection[]>([]);
  const [pageMeta, setPageMeta] = useState<DashboardPageMeta>(DEFAULT_PAGE_META);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
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
    loadData();
  }, []);

  const getIcon = (iconName: string | null): LucideIcon => {
    if (!iconName) return BarChart3;
    return iconMap[iconName] || BarChart3;
  };

  const getColor = (slug: string): string => {
    return colorMap[slug] || 'bg-slate-600';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-accent uppercase tracking-wider mb-2">
            Personalised Pay & Benefits Dashboard
          </p>
          <h1 className="text-4xl lg:text-5xl font-display font-bold text-primary mb-3" data-testid="dashboard-headline">
            {pageMeta.headline || 'Use Your Dashboard'}
          </h1>
          <Link href="#pay-ranges">
            <span className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors cursor-pointer" data-testid="dashboard-subheadline">
              <HelpCircle className="w-4 h-4" />
              <span className="text-sm font-medium">{pageMeta.subheadline || 'How to interpret pay ranges'}</span>
            </span>
          </Link>
        </div>
        <img 
          src={logoImage} 
          alt="TwentySix" 
          className="h-14 w-auto hidden lg:block"
          style={{ opacity: 1 }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-white border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-slate-600" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Organisation</p>
            <p className="font-semibold">{companyInfo.name}</p>
          </div>
        </Card>
        
        <Card className="p-4 bg-white border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-slate-600" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Sector & Location</p>
            <p className="font-semibold">{companyInfo.industry}, {companyInfo.location}</p>
          </div>
        </Card>
        
        <Card className="p-4 bg-white border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-slate-600" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Report Date</p>
            <p className="font-semibold">{companyInfo.reportDate}</p>
          </div>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-display font-bold text-slate-800 mb-2">What do you want to do today?</h2>
        <p className="text-muted-foreground mb-6">Select a section to explore your personalised pay and benefits data.</p>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1,2,3,4,5,6].map((i) => (
              <Card key={i} className="p-5 bg-white border border-slate-200 animate-pulse">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-lg bg-slate-200" />
                  <div className="flex-1">
                    <div className="h-4 bg-slate-200 rounded w-1/2 mb-2" />
                    <div className="h-3 bg-slate-200 rounded w-3/4" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sections.map((section) => {
              const IconComponent = getIcon(section.icon);
              return (
                <Link key={section.id} href={section.route}>
                  <Card 
                    className="p-5 bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 cursor-pointer group"
                    data-testid={`launcher-${section.slug}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-11 h-11 rounded-lg ${getColor(section.slug)} flex items-center justify-center shrink-0`}>
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-slate-800 group-hover:text-primary transition-colors">{section.title}</h3>
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{section.description}</p>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <Card id="pay-ranges" className="p-6 bg-slate-50 border border-slate-200">
        <h3 className="font-display font-bold text-xl text-slate-800 mb-4">How to Interpret Pay Ranges</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div className="bg-white rounded-lg p-4 text-center border border-slate-200">
            <p className="font-semibold mb-1 text-amber-600">Lower Quartile</p>
            <p className="text-xs text-muted-foreground">25% of the market pays below this level</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center border border-slate-200">
            <p className="font-semibold mb-1 text-yellow-600">Lower-Mid</p>
            <p className="text-xs text-muted-foreground">Between lower quartile and median</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center border border-slate-200">
            <p className="font-semibold mb-1 text-green-600">Median</p>
            <p className="text-xs text-muted-foreground">The middle point - 50% pay more, 50% pay less</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center border border-slate-200">
            <p className="font-semibold mb-1 text-teal-600">Upper-Mid</p>
            <p className="text-xs text-muted-foreground">Between median and upper quartile</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center border border-slate-200">
            <p className="font-semibold mb-1 text-blue-600">Upper Quartile</p>
            <p className="text-xs text-muted-foreground">Only 25% of the market pays more</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
