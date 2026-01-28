import { Card } from "@/components/ui/card";
import { sectorInsights } from "@/lib/data";
import {
  Heart,
  Calendar,
  Wallet,
  Baby,
  GraduationCap,
  Shield,
  Clock,
  Car,
  Stethoscope,
  Users,
  Gift,
} from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from "recharts";
import logoImage from "@/assets/twentysix-logo.png";

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
    title: "Pension & Financial",
    icon: Wallet,
    color: "bg-green-500",
    benefits: [
      { name: "Defined Contribution Pension", typical: "6-8% employer contribution", prevalence: "98%" },
      { name: "Life Assurance", typical: "3-4x salary", prevalence: "92%" },
      { name: "Income Protection", typical: "50-75% of salary", prevalence: "60%" },
      { name: "Critical Illness", typical: "1-2x salary", prevalence: "35%" },
    ],
  },
  {
    title: "Leave & Time Off",
    icon: Calendar,
    color: "bg-blue-500",
    benefits: [
      { name: "Annual Leave", typical: "25-30 days + bank holidays", prevalence: "100%" },
      { name: "Sick Pay", typical: "Enhanced beyond SSP", prevalence: "95%" },
      { name: "Compassionate Leave", typical: "5-10 days paid", prevalence: "90%" },
      { name: "Study Leave", typical: "5 days per year", prevalence: "70%" },
    ],
  },
  {
    title: "Flexible Working",
    icon: Clock,
    color: "bg-purple-500",
    benefits: [
      { name: "Hybrid Working", typical: "2-3 days office", prevalence: "87%" },
      { name: "Flexible Hours", typical: "Core hours model", prevalence: "80%" },
      { name: "Compressed Hours", typical: "9-day fortnight", prevalence: "45%" },
      { name: "Remote Working", typical: "Fully remote options", prevalence: "25%" },
    ],
  },
  {
    title: "Health & Wellbeing",
    icon: Heart,
    color: "bg-red-500",
    benefits: [
      { name: "EAP", typical: "24/7 support line", prevalence: "95%" },
      { name: "Mental Health Support", typical: "Counselling sessions", prevalence: "85%" },
      { name: "Health Cash Plan", typical: "£50-100/year cover", prevalence: "45%" },
      { name: "Private Medical", typical: "For senior roles", prevalence: "30%" },
    ],
  },
  {
    title: "Family Support",
    icon: Baby,
    color: "bg-pink-500",
    benefits: [
      { name: "Maternity Leave", typical: "Up to 26 weeks full pay", prevalence: "75%" },
      { name: "Paternity Leave", typical: "2-4 weeks full pay", prevalence: "70%" },
      { name: "Shared Parental Leave", typical: "Enhanced beyond statutory", prevalence: "60%" },
      { name: "Carers Leave", typical: "5-10 days paid", prevalence: "55%" },
    ],
  },
  {
    title: "Development",
    icon: GraduationCap,
    color: "bg-amber-500",
    benefits: [
      { name: "Professional Subscriptions", typical: "Paid annually", prevalence: "85%" },
      { name: "Training Budget", typical: "£500-2000/year", prevalence: "75%" },
      { name: "Qualification Support", typical: "Fees + study time", prevalence: "70%" },
      { name: "Mentoring Programmes", typical: "Internal schemes", prevalence: "50%" },
    ],
  },
];

const additionalBenefits = [
  { name: "Cycle to Work", icon: Car, prevalence: "85%" },
  { name: "Electric Vehicle Scheme", icon: Car, prevalence: "45%" },
  { name: "Eye Care Vouchers", icon: Stethoscope, prevalence: "90%" },
  { name: "Staff Discounts", icon: Gift, prevalence: "75%" },
  { name: "Social Events", icon: Users, prevalence: "80%" },
  { name: "Volunteer Days", icon: Heart, prevalence: "65%" },
];

export function Benefits() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-sm font-medium text-accent uppercase tracking-wider mb-2">
            Total Reward Analysis
          </p>
          <h1 className="text-4xl lg:text-5xl font-display font-bold text-primary mb-4">
            Benefits
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Comprehensive overview of typical benefits in the Housing Association sector.
          </p>
        </div>
        <img src={logoImage} alt="TwentySix" className="h-10 w-auto hidden lg:block" />
      </div>

      <Card className="p-6 bg-gradient-to-br from-primary to-primary/80 text-white border-0 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-display font-bold mb-2">Note on Benefits Data</h2>
            <p className="text-white/80">
              This section provides an overview of typical benefits in the Housing Association sector based on our survey data. Benefits have not been specifically analysed for your organisation. For bespoke benefits analysis, please contact our team.
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <div key={j} className="py-2 border-b last:border-0">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-sm">{benefit.name}</span>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{benefit.prevalence}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{benefit.typical}</span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6 bg-white border-0 shadow-md">
        <h3 className="font-display font-bold text-xl mb-6">Additional Benefits</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {additionalBenefits.map((benefit, i) => (
            <div key={i} className="text-center p-4 bg-muted/30 rounded-xl">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3">
                <benefit.icon className="w-5 h-5 text-accent" />
              </div>
              <p className="font-medium text-sm mb-1">{benefit.name}</p>
              <p className="text-xs text-green-600 font-medium">{benefit.prevalence} offer</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
