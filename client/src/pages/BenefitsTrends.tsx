import { Card } from "@/components/ui/card";
import {
  Heart,
  Calendar,
  Home,
  Baby,
  Bike,
  GraduationCap,
  Sparkles,
  Clock,
  Wallet,
  TreePine,
  Users,
  Zap,
} from "lucide-react";
import logoImage from "@/assets/twentysix-logo.png";

const emergingTrends = [
  {
    title: "Menopause Support",
    icon: Heart,
    color: "bg-pink-500",
    description: "Dedicated policies, training for managers, and flexible working arrangements. Growing rapidly with 45% of organisations now offering some form of support.",
  },
  {
    title: "Financial Wellbeing",
    icon: Wallet,
    color: "bg-green-500",
    description: "Beyond traditional pensions - salary advances, savings schemes, financial education, and debt support. Critical given cost of living pressures.",
  },
  {
    title: "Fertility Support",
    icon: Baby,
    color: "bg-purple-500",
    description: "IVF support, fertility leave, and egg freezing benefits are emerging in forward-thinking organisations, typically offering 1-5 days paid leave.",
  },
  {
    title: "Climate Perks",
    icon: TreePine,
    color: "bg-emerald-500",
    description: "Extra holiday for low-carbon travel, electric vehicle schemes, and 'green' volunteering days. Appeals strongly to younger workforce.",
  },
  {
    title: "Sabbaticals",
    icon: Calendar,
    color: "bg-blue-500",
    description: "Unpaid or part-paid career breaks of 1-6 months. Increasingly offered after 5+ years service as a retention tool.",
  },
  {
    title: "Learning Budgets",
    icon: GraduationCap,
    color: "bg-amber-500",
    description: "Personal development allowances of £500-£2,000 per year for any learning, not just job-related. Highly valued by all age groups.",
  },
];

const costEffectiveIdeas = [
  {
    title: "Recognition Programmes",
    icon: Sparkles,
    items: [
      "Peer-to-peer recognition platforms",
      "Instant thank-you vouchers (£25-50)",
      "Long service celebrations",
      "Values-based awards",
      "Team achievement celebrations",
    ],
  },
  {
    title: "Flexibility Enhancements",
    icon: Clock,
    items: [
      "Core hours with flexible start/end",
      "Compressed working weeks (4-day option)",
      "Summer Fridays (early finish)",
      "Birthday off",
      "Additional leave purchase scheme",
    ],
  },
  {
    title: "Wellbeing Initiatives",
    icon: Heart,
    items: [
      "Mental health first aiders",
      "Wellbeing days (in addition to sick leave)",
      "Free fruit and healthy snacks",
      "Lunchtime yoga/exercise classes",
      "Walking meetings culture",
    ],
  },
  {
    title: "Connection & Community",
    icon: Users,
    items: [
      "Team social budgets",
      "Interest-based clubs and networks",
      "Charity matching schemes",
      "Volunteering days (2-5 per year)",
      "Cross-team project opportunities",
    ],
  },
];

const quickWins = [
  { name: "Cycle to Work", icon: Bike, adoption: "85% of HAs offer", impact: "Tax efficient, promotes health" },
  { name: "Home Office Allowance", icon: Home, adoption: "Standard post-COVID", impact: "£200-500 one-off or annual" },
  { name: "Electric Vehicle Scheme", icon: Zap, adoption: "Growing rapidly", impact: "Salary sacrifice, tax efficient" },
  { name: "Volunteer Days", icon: Heart, adoption: "2-5 days common", impact: "Aligns with social purpose" },
];

export function BenefitsTrends() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-sm font-medium text-accent uppercase tracking-wider mb-2">
            Innovation in Reward
          </p>
          <h1 className="text-4xl lg:text-5xl font-display font-bold text-primary mb-4">
            Benefits Trends & Ideas
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Emerging trends and creative ideas for enhancing your reward offering.
          </p>
        </div>
        <img src={logoImage} alt="TwentySix" className="h-10 w-auto hidden lg:block" />
      </div>

      <div>
        <h2 className="text-2xl font-display font-bold mb-6">Emerging Benefits Trends</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {emergingTrends.map((trend, i) => (
            <Card key={i} className="p-6 bg-white border-0 shadow-md hover:shadow-lg transition-shadow">
              <div className={`w-12 h-12 rounded-xl ${trend.color} flex items-center justify-center mb-4`}>
                <trend.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{trend.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{trend.description}</p>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-display font-bold mb-6">Cost-Effective Ideas</h2>
        <p className="text-muted-foreground mb-6">Ways to enhance your reward offering without significantly increasing costs</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {costEffectiveIdeas.map((category, i) => (
            <Card key={i} className="p-6 bg-white border-0 shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <category.icon className="w-5 h-5 text-accent" />
                </div>
                <h3 className="font-semibold text-lg">{category.title}</h3>
              </div>
              <ul className="space-y-2">
                {category.items.map((item, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </div>

      <Card className="p-6 bg-white border-0 shadow-md">
        <h2 className="text-2xl font-display font-bold mb-6">Quick Wins</h2>
        <p className="text-muted-foreground mb-6">Popular benefits that are easy to implement</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickWins.map((item, i) => (
            <div key={i} className="p-4 bg-muted/30 rounded-xl text-center">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3">
                <item.icon className="w-5 h-5 text-accent" />
              </div>
              <h4 className="font-semibold mb-1">{item.name}</h4>
              <p className="text-xs text-accent font-medium mb-2">{item.adoption}</p>
              <p className="text-xs text-muted-foreground">{item.impact}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-primary to-primary/80 text-white border-0 shadow-xl">
        <h3 className="text-xl font-display font-bold mb-4">Key Takeaway</h3>
        <p className="text-white/90 leading-relaxed">
          The most valued benefits are often those that show genuine care for employees' lives beyond work. Focus on flexibility, recognition, and personal development. These create engagement and loyalty without the ongoing cost commitment of salary increases.
        </p>
      </Card>
    </div>
  );
}
