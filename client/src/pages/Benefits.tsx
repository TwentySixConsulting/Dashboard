import { Card } from "@/components/ui/card";
import { sectorInsights } from "@/lib/data";
import {
  Heart,
  Calendar,
  Wallet,
  Home,
  Baby,
  Bike,
  GraduationCap,
  Shield,
  Clock,
  Sparkles,
} from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from "recharts";

const benefitsRadarData = [
  { benefit: "Pension", current: 85, market: 75 },
  { benefit: "Leave", current: 90, market: 80 },
  { benefit: "Flexible Work", current: 95, market: 85 },
  { benefit: "Wellbeing", current: 70, market: 65 },
  { benefit: "L&D", current: 75, market: 70 },
  { benefit: "Family", current: 80, market: 72 },
];

const benefitsCategories = [
  {
    title: "Financial Wellbeing",
    icon: Wallet,
    color: "bg-green-500",
    benefits: [
      { name: "Defined Contribution Pension", typical: "6-8% employer contribution" },
      { name: "Life Assurance", typical: "3-4x salary" },
      { name: "Income Protection", typical: "Available in 60% of HAs" },
    ],
  },
  {
    title: "Work-Life Balance",
    icon: Clock,
    color: "bg-blue-500",
    benefits: [
      { name: "Annual Leave", typical: "25-30 days + bank holidays" },
      { name: "Flexible Working", typical: "Hybrid arrangements common" },
      { name: "Compressed Hours", typical: "Available in many organisations" },
    ],
  },
  {
    title: "Health & Wellbeing",
    icon: Heart,
    color: "bg-red-500",
    benefits: [
      { name: "EAP", typical: "Employee Assistance Programme" },
      { name: "Mental Health Support", typical: "Counselling & resources" },
      { name: "Health Cash Plans", typical: "Offered by 45% of HAs" },
    ],
  },
  {
    title: "Family Support",
    icon: Baby,
    color: "bg-purple-500",
    benefits: [
      { name: "Enhanced Maternity", typical: "Up to 26 weeks full pay" },
      { name: "Enhanced Paternity", typical: "2-4 weeks full pay" },
      { name: "Carers Leave", typical: "5-10 days paid leave" },
    ],
  },
];

const emergingBenefits = [
  { name: "Menopause Support", icon: Heart, adoption: "Growing rapidly" },
  { name: "Cycle to Work", icon: Bike, adoption: "85% offer" },
  { name: "Learning Budgets", icon: GraduationCap, adoption: "Increasing" },
  { name: "Volunteer Days", icon: Sparkles, adoption: "2-5 days common" },
  { name: "Home Office Setup", icon: Home, adoption: "Post-COVID standard" },
  { name: "Sabbaticals", icon: Calendar, adoption: "Emerging benefit" },
];

export function Benefits() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="mb-12">
        <p className="text-sm font-medium text-accent uppercase tracking-wider mb-2">
          Total Reward Analysis
        </p>
        <h1 className="text-4xl lg:text-5xl font-display font-bold text-primary mb-4">
          Benefits Overview
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Sector-typical benefits and emerging trends in the Housing Association market.
        </p>
      </div>

      <Card className="p-6 bg-gradient-to-br from-primary to-primary/80 text-white border-0 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-display font-bold mb-2">Note on Benefits Data</h2>
            <p className="text-white/80">
              This section provides an overview of typical benefits in the Housing Association sector. Benefits have not been specifically analysed for your organisation. For bespoke benefits analysis, please contact our team.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 bg-white border-0 shadow-md lg:col-span-1">
          <h3 className="font-display font-bold text-xl mb-2">Benefits Positioning</h3>
          <p className="text-sm text-muted-foreground mb-4">Typical HA vs Market average</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={benefitsRadarData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="benefit" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "none",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Radar
                  name="Housing Association"
                  dataKey="current"
                  stroke="hsl(220, 60%, 25%)"
                  fill="hsl(220, 60%, 25%)"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Radar
                  name="Market Average"
                  dataKey="market"
                  stroke="hsl(200, 85%, 55%)"
                  fill="hsl(200, 85%, 55%)"
                  fillOpacity={0.1}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-4 justify-center mt-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-primary" />
              <span className="text-xs text-muted-foreground">Housing Sector</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-accent" />
              <span className="text-xs text-muted-foreground">Market Average</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white border-0 shadow-md lg:col-span-2">
          <h3 className="font-display font-bold text-xl mb-4">Top Benefits in Sector</h3>
          <div className="grid grid-cols-2 gap-4">
            {sectorInsights.topBenefits.map((benefit, i) => (
              <div key={i} className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <span className="text-accent font-bold">{i + 1}</span>
                </div>
                <span className="font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {benefitsCategories.map((category, i) => (
          <Card key={i} className="p-6 bg-white border-0 shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-lg ${category.color} flex items-center justify-center`}>
                <category.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-display font-bold text-lg">{category.title}</h3>
            </div>
            <div className="space-y-3">
              {category.benefits.map((benefit, j) => (
                <div key={j} className="flex justify-between items-start py-2 border-b last:border-0">
                  <span className="font-medium text-sm">{benefit.name}</span>
                  <span className="text-xs text-muted-foreground text-right max-w-[50%]">{benefit.typical}</span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6 bg-white border-0 shadow-md">
        <h3 className="font-display font-bold text-xl mb-4">Emerging Benefits Trends</h3>
        <p className="text-sm text-muted-foreground mb-6">New and growing benefits gaining traction in the sector</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {emergingBenefits.map((benefit, i) => (
            <div key={i} className="text-center p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3">
                <benefit.icon className="w-5 h-5 text-accent" />
              </div>
              <p className="font-medium text-sm mb-1">{benefit.name}</p>
              <p className="text-xs text-muted-foreground">{benefit.adoption}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 bg-white border-0 shadow-md">
        <h3 className="font-display font-bold text-xl mb-4">Enhancing Reward Without Increasing Base Pay</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">Recognition Programmes</h4>
            <p className="text-sm text-green-700">Peer recognition, service awards, and instant recognition schemes boost engagement at low cost.</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Flexibility Options</h4>
            <p className="text-sm text-blue-700">Enhanced flexible working, compressed hours, and additional leave purchase schemes are highly valued.</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <h4 className="font-semibold text-purple-800 mb-2">Development Investment</h4>
            <p className="text-sm text-purple-700">Professional development budgets, mentoring programmes, and career pathways add significant value.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
