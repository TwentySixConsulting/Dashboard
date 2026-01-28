import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { companyInfo, marketData, getPositioning } from "@/lib/data";
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
  CheckCircle2,
  Target,
} from "lucide-react";

const sections = [
  {
    path: "/market-data",
    title: "Market Data Results",
    description: "Overview of all roles with market ranges showing where your current salaries sit against lower quartile, lower-mid, median, upper-mid, and upper quartile.",
    icon: BarChart3,
    color: "bg-blue-500",
  },
  {
    path: "/role-details",
    title: "Role-by-Role Detail",
    description: "Individual analysis for each role showing market position, variance from median, and detailed pay range visualization.",
    icon: Users,
    color: "bg-purple-500",
  },
  {
    path: "/risks",
    title: "Your Strengths & Risks",
    description: "Strategic summary highlighting roles that are competitively positioned and those that may need attention.",
    icon: AlertTriangle,
    color: "bg-amber-500",
  },
  {
    path: "/market-context",
    title: "Market Context",
    description: "Current economic indicators including CPI, average weekly earnings, and pay rise predictions with expert commentary.",
    icon: TrendingUp,
    color: "bg-green-500",
  },
  {
    path: "/sector-insight",
    title: "Sector Insight",
    description: "Specific trends, salary comparisons, and recruitment challenges for the Housing Association sector.",
    icon: Building2,
    color: "bg-indigo-500",
  },
  {
    path: "/bonus",
    title: "Bonus Potential",
    description: "Market data on bonus levels by job level, showing typical bonus percentages across the sector.",
    icon: Percent,
    color: "bg-pink-500",
  },
  {
    path: "/benefits",
    title: "Benefits",
    description: "Comprehensive overview of typical benefits in the sector including pension, leave, and wellbeing support.",
    icon: Gift,
    color: "bg-teal-500",
  },
  {
    path: "/benefits-trends",
    title: "Benefits Trends & Ideas",
    description: "Emerging benefits trends and creative ideas for enhancing your reward offering without increasing base pay.",
    icon: Lightbulb,
    color: "bg-orange-500",
  },
  {
    path: "/next-steps",
    title: "Next Steps",
    description: "Recommended actions and guidance on how to use this report effectively.",
    icon: ArrowRight,
    color: "bg-cyan-500",
  },
  {
    path: "/data-sources",
    title: "Data Sources",
    description: "Information about the data sources and methodology used in this report.",
    icon: Database,
    color: "bg-gray-500",
  },
];

export function ExecutiveSummary() {
  // Calculate summary statistics
  const rolesByPosition = marketData.reduce((acc, role) => {
    const pos = getPositioning(role.currentSalary, role.lowerQuartile, role.median, role.upperQuartile);
    if (!acc[pos.position]) acc[pos.position] = [];
    acc[pos.position].push(role);
    return acc;
  }, {} as Record<string, typeof marketData>);

  const atMedian = rolesByPosition.median?.length || 0;
  const aboveMedian = (rolesByPosition.upperMid?.length || 0) + (rolesByPosition.upper?.length || 0) + (rolesByPosition.above?.length || 0);
  const belowMedian = (rolesByPosition.below?.length || 0) + (rolesByPosition.lower?.length || 0) + (rolesByPosition.lowerMid?.length || 0);
  
  const totalRoles = marketData.length;
  const competitivePercent = Math.round(((atMedian + aboveMedian) / totalRoles) * 100);

  // Find roles needing attention
  const rolesNeedingAttention = marketData.filter(role => {
    const pos = getPositioning(role.currentSalary, role.lowerQuartile, role.median, role.upperQuartile);
    return pos.position === "below" || pos.position === "lower" || pos.position === "lowerMid";
  });

  // Find competitive strengths
  const competitiveRoles = marketData.filter(role => {
    const pos = getPositioning(role.currentSalary, role.lowerQuartile, role.median, role.upperQuartile);
    return pos.position === "median" || pos.position === "upperMid" || pos.position === "upper" || pos.position === "above";
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-sm font-medium text-accent uppercase tracking-wider mb-2">
            Personalised Pay & Benefits Report
          </p>
          <h1 className="text-4xl lg:text-5xl font-display font-bold text-primary mb-2">
            How to Use This Report
          </h1>
          <p className="text-lg text-muted-foreground">
            Prepared for <span className="font-semibold text-foreground">{companyInfo.name}</span> | {companyInfo.reportDate}
          </p>
        </div>
        <img src={logoImage} alt="TwentySix" className="h-12 w-auto hidden lg:block" />
      </div>

      {/* Executive Summary Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 bg-gradient-to-br from-primary to-primary/80 text-white border-0 shadow-lg">
          <p className="text-4xl font-bold">{totalRoles}</p>
          <p className="text-sm opacity-80 mt-1">Roles Analysed</p>
        </Card>
        <Card className="p-5 bg-gradient-to-br from-green-600 to-green-500 text-white border-0 shadow-lg">
          <p className="text-4xl font-bold">{competitivePercent}%</p>
          <p className="text-sm opacity-80 mt-1">At or Above Median</p>
        </Card>
        <Card className="p-5 bg-gradient-to-br from-accent to-blue-500 text-white border-0 shadow-lg">
          <p className="text-4xl font-bold">{atMedian}</p>
          <p className="text-sm opacity-80 mt-1">At Market Median</p>
        </Card>
        <Card className="p-5 bg-gradient-to-br from-amber-500 to-orange-500 text-white border-0 shadow-lg">
          <p className="text-4xl font-bold">{belowMedian}</p>
          <p className="text-sm opacity-80 mt-1">Below Median</p>
        </Card>
      </div>

      {/* Key Findings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-white border-0 shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <h3 className="font-display font-bold text-lg">Competitive Strengths</h3>
          </div>
          <ul className="space-y-2">
            {competitiveRoles.slice(0, 4).map((role) => {
              const pos = getPositioning(role.currentSalary, role.lowerQuartile, role.median, role.upperQuartile);
              return (
                <li key={role.id} className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                  <span className="font-medium text-sm">{role.role}</span>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{pos.label}</span>
                </li>
              );
            })}
          </ul>
        </Card>

        <Card className="p-6 bg-white border-0 shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-amber-500" />
            <h3 className="font-display font-bold text-lg">Roles to Monitor</h3>
          </div>
          {rolesNeedingAttention.length > 0 ? (
            <ul className="space-y-2">
              {rolesNeedingAttention.slice(0, 4).map((role) => {
                const pos = getPositioning(role.currentSalary, role.lowerQuartile, role.median, role.upperQuartile);
                const gap = role.median - role.currentSalary;
                return (
                  <li key={role.id} className="flex items-center justify-between p-2 bg-amber-50 rounded-lg">
                    <span className="font-medium text-sm">{role.role}</span>
                    <span className="text-xs text-amber-700">£{gap.toLocaleString()} below median</span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="p-4 bg-green-50 rounded-lg text-center">
              <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-sm text-green-700">All roles are competitively positioned</p>
            </div>
          )}
        </Card>
      </div>

      {/* How to Interpret Pay Ranges */}
      <Card className="p-8 bg-gradient-to-br from-primary to-primary/80 text-white border-0 shadow-xl">
        <h2 className="text-2xl font-display font-bold mb-4">How to Interpret Pay Ranges</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <p className="font-semibold mb-1">Lower Quartile</p>
            <p className="text-sm text-white/80">25% of the market pays below this level</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <p className="font-semibold mb-1">Lower-Mid</p>
            <p className="text-sm text-white/80">Between lower quartile and median</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <p className="font-semibold mb-1">Median</p>
            <p className="text-sm text-white/80">The middle point - 50% pay more, 50% pay less</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <p className="font-semibold mb-1">Upper-Mid</p>
            <p className="text-sm text-white/80">Between median and upper quartile</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <p className="font-semibold mb-1">Upper Quartile</p>
            <p className="text-sm text-white/80">Only 25% of the market pays more</p>
          </div>
        </div>
      </Card>

      {/* Report Sections */}
      <div>
        <h2 className="text-2xl font-display font-bold mb-6">Report Sections</h2>
        <p className="text-muted-foreground mb-6">Click on any section below to navigate directly to that page.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sections.map((section) => (
            <Link key={section.path} href={section.path}>
              <Card 
                className="p-5 bg-white border-0 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer group hover:-translate-y-1"
                data-testid={`link-${section.path.replace("/", "")}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl ${section.color} flex items-center justify-center shrink-0`}>
                    <section.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{section.title}</h3>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{section.description}</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
