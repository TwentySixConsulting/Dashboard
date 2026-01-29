import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { companyInfo } from "@/lib/data";
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
} from "lucide-react";

const launcherCards = [
  {
    path: "/market-data",
    title: "Market Data Results & Position",
    description: "Overview of all roles with market ranges showing where your salaries sit against quartiles.",
    icon: BarChart3,
    color: "bg-blue-600",
  },
  {
    path: "/risks",
    title: "Strengths, Risks & Outliers",
    description: "Identify competitively positioned roles and those requiring attention.",
    icon: AlertTriangle,
    color: "bg-amber-500",
  },
  {
    path: "/role-details",
    title: "Role-by-Role Detail",
    description: "Individual analysis for each role with market positioning visualisation.",
    icon: Users,
    color: "bg-purple-600",
  },
  {
    path: "/market-context",
    title: "Market Context",
    description: "Current CPI, average weekly earnings, and pay rise predictions with commentary.",
    icon: TrendingUp,
    color: "bg-emerald-600",
  },
  {
    path: "/sector-insight",
    title: "Sector Insight",
    description: "Housing Association specific trends, comparisons, and recruitment challenges.",
    icon: Building2,
    color: "bg-indigo-600",
  },
  {
    path: "/bonus",
    title: "Bonus Potential",
    description: "Market data on bonus levels by job level across the sector.",
    icon: Percent,
    color: "bg-pink-600",
  },
  {
    path: "/benefits",
    title: "Benefits Breakdown",
    description: "Comprehensive overview of typical benefits provision by organisation type.",
    icon: Gift,
    color: "bg-teal-600",
  },
  {
    path: "/benefits-trends",
    title: "Benefits Trends & Ideas",
    description: "Emerging trends and creative ideas for enhancing your reward offering.",
    icon: Lightbulb,
    color: "bg-orange-500",
  },
  {
    path: "/next-steps",
    title: "Next Steps",
    description: "Recommended actions and guidance on using this dashboard effectively.",
    icon: ArrowRight,
    color: "bg-cyan-600",
  },
  {
    path: "/data-sources",
    title: "Data Sources & Methodology",
    description: "Information about data sources, methodology, and who we are.",
    icon: Database,
    color: "bg-slate-600",
  },
];

export function ExecutiveSummary() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Header with Logo */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-accent uppercase tracking-wider mb-2">
            Personalised Pay & Benefits Dashboard
          </p>
          <h1 className="text-4xl lg:text-5xl font-display font-bold text-primary mb-3">
            Use Your Dashboard
          </h1>
          <Link href="#pay-ranges">
            <span className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors cursor-pointer">
              <HelpCircle className="w-4 h-4" />
              <span className="text-sm font-medium">How to interpret pay ranges</span>
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

      {/* Organisation Info */}
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

      {/* What do you want to do today? */}
      <div>
        <h2 className="text-2xl font-display font-bold text-slate-800 mb-2">What do you want to do today?</h2>
        <p className="text-muted-foreground mb-6">Select a section to explore your personalised pay and benefits data.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {launcherCards.map((card) => (
            <Link key={card.path} href={card.path}>
              <Card 
                className="p-5 bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 cursor-pointer group"
                data-testid={`launcher-${card.path.replace("/", "")}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-11 h-11 rounded-lg ${card.color} flex items-center justify-center shrink-0`}>
                    <card.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-slate-800 group-hover:text-primary transition-colors">{card.title}</h3>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{card.description}</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* How to Interpret Pay Ranges */}
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
