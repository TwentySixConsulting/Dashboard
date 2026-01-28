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
  MapPin,
  Calendar,
  Sparkles,
  Target,
} from "lucide-react";

const sections = [
  {
    path: "/market-context",
    title: "Market Context",
    description: "Economic indicators and commentary.",
    icon: TrendingUp,
    color: "bg-green-500",
  },
  {
    path: "/sector-insight",
    title: "Sector Insight",
    description: "Housing Association trends.",
    icon: Building2,
    color: "bg-indigo-500",
  },
  {
    path: "/market-data",
    title: "Market Data Results",
    description: "Overview of all roles with market ranges.",
    icon: BarChart3,
    color: "bg-blue-500",
  },
  {
    path: "/role-details",
    title: "Role-by-Role Detail",
    description: "Individual analysis for each role.",
    icon: Users,
    color: "bg-purple-500",
  },
  {
    path: "/risks",
    title: "Your Strengths & Risks",
    description: "Roles needing attention.",
    icon: AlertTriangle,
    color: "bg-amber-500",
  },
  {
    path: "/bonus",
    title: "Bonus Potential",
    description: "Bonus levels by job level.",
    icon: Percent,
    color: "bg-pink-500",
  },
  {
    path: "/benefits",
    title: "Benefits",
    description: "Sector benefits overview.",
    icon: Gift,
    color: "bg-teal-500",
  },
  {
    path: "/benefits-trends",
    title: "Benefits Trends & Ideas",
    description: "Emerging benefits trends.",
    icon: Lightbulb,
    color: "bg-orange-500",
  },
  {
    path: "/next-steps",
    title: "Next Steps",
    description: "Recommended actions.",
    icon: ArrowRight,
    color: "bg-cyan-500",
  },
  {
    path: "/data-sources",
    title: "Data Sources",
    description: "Methodology information.",
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

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-accent uppercase tracking-wider mb-2">
            Personalised Pay & Benefits Report
          </p>
          <h1 className="text-4xl lg:text-5xl font-display font-bold text-primary mb-4">
            Executive Summary
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            A comprehensive analysis of your organisation's pay positioning against current market data.
          </p>
        </div>
        <img src={logoImage} alt="TwentySix" className="h-12 w-auto hidden lg:block" />
      </div>

      {/* Organisation Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 bg-white border-0 shadow-md flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <Building2 className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Organisation</p>
            <p className="font-semibold text-lg">{companyInfo.name}</p>
          </div>
        </Card>
        
        <Card className="p-5 bg-white border-0 shadow-md flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <MapPin className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Industry & Location</p>
            <p className="font-semibold text-lg">{companyInfo.industry}</p>
            <p className="text-sm text-muted-foreground">{companyInfo.location}</p>
          </div>
        </Card>
        
        <Card className="p-5 bg-white border-0 shadow-md flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
            <Calendar className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Report Date</p>
            <p className="font-semibold text-lg">{companyInfo.reportDate}</p>
          </div>
        </Card>
      </div>

      {/* Roles Analysed Card */}
      <Card className="p-8 bg-gradient-to-br from-primary to-primary/80 text-white border-0 shadow-xl">
        <div className="flex items-start gap-6">
          <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
            <Users className="w-7 h-7" />
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-display font-bold mb-2">{totalRoles} Roles Analysed</h2>
            <p className="text-white/80 mb-6">
              We have analysed your submitted roles against current market data for the {companyInfo.industry} sector in {companyInfo.location}.
            </p>
            <div className="flex gap-6">
              <div className="bg-white/10 rounded-lg px-6 py-4 text-center">
                <p className="text-3xl font-bold">{atMedian}</p>
                <p className="text-sm text-white/80">At Median</p>
              </div>
              <div className="bg-white/10 rounded-lg px-6 py-4 text-center">
                <p className="text-3xl font-bold">{aboveMedian}</p>
                <p className="text-sm text-white/80">Above Median</p>
              </div>
              <div className="bg-white/10 rounded-lg px-6 py-4 text-center">
                <p className="text-3xl font-bold">{belowMedian}</p>
                <p className="text-sm text-white/80">Below Median</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Who We Are & Methodology */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-white border-0 shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-accent" />
            <h3 className="font-display font-bold text-xl">Who We Are</h3>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            TwentySix is a specialist reward consultancy, working across a large number of sectors in the UK. Our team consists of senior reward consultants, supported by specially trained analysts who bring deep expertise in compensation and market analysis.
          </p>
        </Card>

        <Card className="p-6 bg-white border-0 shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-purple-500" />
            <h3 className="font-display font-bold text-xl">Our Methodology</h3>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            We utilise proprietary data sources combined with validated salary surveys to provide accurate pay data. Each role is carefully matched against comparable positions considering industry, location, organisation size, and scope of responsibilities.
          </p>
        </Card>
      </div>

      {/* How to Use This Report */}
      <Card className="p-6 bg-white border-0 shadow-md">
        <h3 className="font-display font-bold text-xl mb-6">How to Use This Report</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Pay Review</p>
              <p className="text-sm text-muted-foreground">Provides market-aligned pay ranges for annual salary reviews</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">New Roles</p>
              <p className="text-sm text-muted-foreground">Sense-checks proposed salaries for new positions</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Prioritisation</p>
              <p className="text-sm text-muted-foreground">Highlights roles needing deeper review or adjustment</p>
            </div>
          </div>
        </div>
      </Card>

      {/* How to Interpret Pay Ranges */}
      <Card className="p-8 bg-muted/30 border-0">
        <h3 className="font-display font-bold text-xl mb-4">How to Interpret Pay Ranges</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <p className="font-semibold mb-1 text-amber-600">Lower Quartile</p>
            <p className="text-xs text-muted-foreground">25% of the market pays below this level</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <p className="font-semibold mb-1 text-yellow-600">Lower-Mid</p>
            <p className="text-xs text-muted-foreground">Between lower quartile and median</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <p className="font-semibold mb-1 text-green-600">Median</p>
            <p className="text-xs text-muted-foreground">The middle point - 50% pay more, 50% pay less</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <p className="font-semibold mb-1 text-teal-600">Upper-Mid</p>
            <p className="text-xs text-muted-foreground">Between median and upper quartile</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <p className="font-semibold mb-1 text-blue-600">Upper Quartile</p>
            <p className="text-xs text-muted-foreground">Only 25% of the market pays more</p>
          </div>
        </div>
      </Card>

      {/* Report Sections */}
      <div>
        <h2 className="text-2xl font-display font-bold mb-4">Report Sections</h2>
        <p className="text-muted-foreground mb-6">Click on any section below to navigate directly to that page.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {sections.map((section) => (
            <Link key={section.path} href={section.path}>
              <Card 
                className="p-4 bg-white border-0 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group hover:-translate-y-0.5"
                data-testid={`link-${section.path.replace("/", "")}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${section.color} flex items-center justify-center shrink-0`}>
                    <section.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold group-hover:text-primary transition-colors">{section.title}</h3>
                    <p className="text-xs text-muted-foreground">{section.description}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
