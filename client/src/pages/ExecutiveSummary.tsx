import { Card } from "@/components/ui/card";
import { companyInfo, benchmarkData, getPositioning } from "@/lib/data";
import { Building2, MapPin, Calendar, Users, TrendingUp, Target, CheckCircle2 } from "lucide-react";

export function ExecutiveSummary() {
  const positioningSummary = benchmarkData.reduce(
    (acc, role) => {
      const pos = getPositioning(role.currentSalary, role.lowerQuartile, role.median, role.upperQuartile);
      acc[pos.position] = (acc[pos.position] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="mb-12">
        <p className="text-sm font-medium text-accent uppercase tracking-wider mb-2">
          Personalised Pay & Benefits Report
        </p>
        <h1 className="text-4xl lg:text-5xl font-display font-bold text-primary mb-4">
          Executive Summary
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          A comprehensive analysis of your organisation's pay positioning against current market benchmarks.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="p-5 bg-white border-0 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Organisation</p>
              <p className="font-semibold text-lg">{companyInfo.name}</p>
            </div>
          </div>
        </Card>
        <Card className="p-5 bg-white border-0 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
              <MapPin className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Industry & Location</p>
              <p className="font-semibold text-lg">{companyInfo.industry}</p>
              <p className="text-sm text-muted-foreground">{companyInfo.location}</p>
            </div>
          </div>
        </Card>
        <Card className="p-5 bg-white border-0 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Report Date</p>
              <p className="font-semibold text-lg">{companyInfo.reportDate}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-8 bg-gradient-to-br from-primary to-primary/80 text-white border-0 shadow-xl">
        <div className="flex items-start gap-6">
          <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-display font-bold mb-2">
              {benchmarkData.length} Roles Benchmarked
            </h2>
            <p className="text-white/80 mb-4">
              We have analysed your submitted roles against current market data for the {companyInfo.industry} sector in {companyInfo.location}.
            </p>
            <div className="flex flex-wrap gap-6 mt-6">
              <div className="bg-white/10 rounded-lg px-4 py-3">
                <p className="text-2xl font-bold">{positioningSummary.median || 0}</p>
                <p className="text-sm text-white/70">At Median</p>
              </div>
              <div className="bg-white/10 rounded-lg px-4 py-3">
                <p className="text-2xl font-bold">{(positioningSummary.upper || 0) + (positioningSummary.above || 0)}</p>
                <p className="text-sm text-white/70">Above Median</p>
              </div>
              <div className="bg-white/10 rounded-lg px-4 py-3">
                <p className="text-2xl font-bold">{(positioningSummary.lower || 0) + (positioningSummary.below || 0)}</p>
                <p className="text-sm text-white/70">Below Median</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-white border-0 shadow-md">
          <h3 className="font-display font-bold text-xl mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-accent" />
            Who We Are
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            TwentySix is a specialist reward consultancy, working across a large number of sectors in the UK. Our team consists of senior reward consultants, supported by specially trained analysts who bring deep expertise in compensation benchmarking and market analysis.
          </p>
        </Card>

        <Card className="p-6 bg-white border-0 shadow-md">
          <h3 className="font-display font-bold text-xl mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-accent" />
            Our Methodology
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            We utilise proprietary data sources combined with validated market surveys to provide accurate benchmarking. Each role is carefully matched against comparable positions considering industry, location, organisation size, and scope of responsibilities.
          </p>
        </Card>
      </div>

      <Card className="p-6 bg-white border-0 shadow-md">
        <h3 className="font-display font-bold text-xl mb-6">How to Use This Report</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { useCase: "Pay Review", help: "Provides market-aligned ranges for annual salary reviews" },
            { useCase: "New Roles", help: "Sense-checks proposed salaries for new positions" },
            { useCase: "Prioritisation", help: "Highlights roles needing deeper review or adjustment" },
          ].map((item, i) => (
            <div key={i} className="flex gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-1">{item.useCase}</p>
                <p className="text-sm text-muted-foreground">{item.help}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
