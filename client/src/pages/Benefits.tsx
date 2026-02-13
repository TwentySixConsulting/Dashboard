import { useState } from "react";
import { Card } from "@/components/ui/card";
import { companyInfo } from "@/lib/data";
import {
  Shield,
  Lightbulb,
  Heart,
  Wallet,
  Leaf,
  GraduationCap,
  Clock,
  ChevronDown,
  ChevronUp,
  Building2,
  CheckCircle2,
  Info,
  Star,
} from "lucide-react";

interface BenefitRow {
  benefit: string;
  companyProvision: string;
  startupSME: string;
  midSizeTech: string;
  largeTech: string;
}

interface BenefitSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  gradient: string;
  companyProvisions: string[];
  rows: BenefitRow[];
  ideas: string[];
}

const benefitSections: BenefitSection[] = [
  {
    id: "core",
    title: "Traditional Core Benefits",
    icon: <Shield className="w-5 h-5" />,
    gradient: "from-blue-500 to-indigo-600",
    companyProvisions: [
      "Annual bonus scheme based on company performance, paid annually",
      "Pension – 5% employer contribution",
      "Annual leave – 25 days plus statutory bank holidays, increasing after 3 years' service by 1 day and 5 years' service by a further 2 days",
      "Holiday buying/selling – up to 5 days",
      "Enhanced Maternity Pay – 12 weeks full pay, 14 weeks at 50%",
      "Paternity/Partner Leave – 2 weeks full pay",
      "Sick Pay – up to 10 days full pay",
    ],
    rows: [
      {
        benefit: "Bonus",
        companyProvision: "Annual performance-based bonus",
        startupSME: "Profit share or performance bonus common, typically 5–15% depending on role",
        midSizeTech: "Performance bonus standard, typically 10–20% with individual and company targets",
        largeTech: "Structured bonus schemes are the norm, 10–25% with clear KPIs; sales roles often higher",
      },
      {
        benefit: "Annual Leave",
        companyProvision: "25 days plus bank holidays, increasing with service",
        startupSME: "20–25 days plus bank holidays; unlimited leave policies emerging but still uncommon",
        midSizeTech: "25 days plus bank holidays is standard, with around 60% increasing through service",
        largeTech: "25–28 days plus bank holidays, increasing with service; some offer 30+ days at senior level",
      },
      {
        benefit: "Additional Days (e.g. Christmas close-down)",
        companyProvision: "Not currently offered",
        startupSME: "Relatively uncommon, though some offer office closure between Christmas and New Year",
        midSizeTech: "1–3 additional days at Christmas is increasingly common",
        largeTech: "1–3 additional days at Christmas is typical; some offer company-wide wellbeing days",
      },
      {
        benefit: "Buy & Sell Leave",
        companyProvision: "Buy or sell up to 5 days",
        startupSME: "Relatively uncommon in smaller organisations",
        midSizeTech: "Ability to buy up to 5 days is a typical benefit; selling leave is less common but growing",
        largeTech: "Ability to buy/sell up to 5 days is standard practice",
      },
      {
        benefit: "Pension",
        companyProvision: "5% employer contribution",
        startupSME: "Auto-enrolment minimum levels are typical; some offer 3–5%",
        midSizeTech: "5–7% employer contribution is typical market practice",
        largeTech: "5–8% employer contribution typical, with ability to match contributions up to 10%",
      },
      {
        benefit: "Sick Pay",
        companyProvision: "Up to 10 days full pay",
        startupSME: "Statutory or 5–10 days full pay, followed by discretionary element",
        midSizeTech: "Up to 3 months full pay; 3 months half pay is typical",
        largeTech: "3 months full; 3 months half pay, often followed by Permanent Health Insurance",
      },
      {
        benefit: "Maternity Pay",
        companyProvision: "12 weeks full, 14 weeks at 50%",
        startupSME: "Statutory is still common; enhanced increasingly expected",
        midSizeTech: "Enhanced – typically 12–16 weeks full pay",
        largeTech: "6 months full pay is increasingly standard; some offering gender-neutral parental leave",
      },
      {
        benefit: "Paternity Pay",
        companyProvision: "2 weeks full pay",
        startupSME: "Statutory is most common",
        midSizeTech: "2–4 weeks full pay is the typical enhanced benefit",
        largeTech: "2–4 weeks full pay typical, with around 50% of organisations considering extending to match maternity",
      },
      {
        benefit: "Share/Equity Schemes",
        companyProvision: "EMI share option scheme",
        startupSME: "EMI share options common in VC-backed and founder-led companies; a key recruitment tool",
        midSizeTech: "Share options and Save As You Earn (SAYE) schemes are increasingly common",
        largeTech: "Share options, SAYE, RSUs and equity grants are standard practice across the sector",
      },
    ],
    ideas: [
      "Additional days (up to 3) as Wellbeing/Mental Health Days that can be taken at short notice in addition to annual leave",
      "Gender-neutral parental leave policies – a growing trend, with some UK tech firms offering 20+ weeks regardless of gender",
      "Birthday leave – an extra day off on or around the employee's birthday",
    ],
  },
  {
    id: "working-time",
    title: "Working Time & Time Off Arrangements",
    icon: <Clock className="w-5 h-5" />,
    gradient: "from-violet-500 to-purple-600",
    companyProvisions: [
      "Flexible working hours with core hours of 10am–4pm",
      "Hybrid working – minimum 2 days per week in office",
      "Compassionate leave – up to 5 days",
    ],
    rows: [
      {
        benefit: "Flexible Working",
        companyProvision: "Core hours 10am–4pm with flex either side",
        startupSME: "Very common in tech; flexible hours and output-focused working are standard",
        midSizeTech: "Flexible hours widely offered; compressed hours and part-time arrangements available",
        largeTech: "Full range: part-time, job-share, compressed hours, flexi-time; formal policies in place",
      },
      {
        benefit: "Hybrid/Remote Working",
        companyProvision: "Hybrid with minimum 2 days in office",
        startupSME: "Fully remote or hybrid is common, with some startups being fully remote-first",
        midSizeTech: "Hybrid is the norm – typically 2–3 days per week in office; some roles fully remote",
        largeTech: "Hybrid is standard, with 2–3 days in office most common; fully remote for certain roles",
      },
      {
        benefit: "Sabbaticals",
        companyProvision: "Not currently offered",
        startupSME: "Uncommon due to team size constraints",
        midSizeTech: "Offered by some after 3–5 years' service, typically 1–3 months",
        largeTech: "Yes, typically after 4–5 years' service, ranging from 4 weeks to 3 months; increasingly popular",
      },
      {
        benefit: "Compassionate Leave",
        companyProvision: "Up to 5 days",
        startupSME: "Discretionary – handled on a case-by-case basis",
        midSizeTech: "Up to 5 days paid is typical",
        largeTech: "Up to 5–10 days, with some extending to include pet bereavement",
      },
    ],
    ideas: [
      "Paid carers leave – a growing number of UK organisations now offer 1–2 weeks; the Carer's Leave Act 2024 provides statutory unpaid leave",
      "4-day working week – CIPD research found 6% of UK employers now offer this; several tech companies piloting it in 2025–26",
      "Summer hours – reduced Friday hours during summer months, popular in creative and tech sectors",
    ],
  },
  {
    id: "health",
    title: "Health & Wellbeing",
    icon: <Heart className="w-5 h-5" />,
    gradient: "from-rose-500 to-pink-600",
    companyProvisions: [
      "Employee Assistance Programme (EAP) with 24/7 helpline and counselling",
      "Health cash plan through Healthshield",
      "Cycle to work scheme",
    ],
    rows: [
      {
        benefit: "Life Assurance",
        companyProvision: "Not currently offered",
        startupSME: "Uncommon in smaller organisations",
        midSizeTech: "Yes – 3–4x salary is typical",
        largeTech: "Yes – 4x salary is standard; some offer up to 6x",
      },
      {
        benefit: "Employee Assistance Programme",
        companyProvision: "Yes – 24/7 helpline and counselling",
        startupSME: "Increasingly common, often through a low-cost provider",
        midSizeTech: "Yes – standard benefit",
        largeTech: "Yes – standard benefit, often with enhanced face-to-face counselling",
      },
      {
        benefit: "Private Medical Insurance (PMI)",
        companyProvision: "Not currently offered",
        startupSME: "Growing in prevalence but not yet standard; around 35% offer this",
        midSizeTech: "Common benefit – around 65% of mid-size tech firms now offer PMI",
        largeTech: "Standard benefit – 84% of large tech employers offer this, typically individual cover with option to add family",
      },
      {
        benefit: "Health Cash Plan",
        companyProvision: "Yes – via Healthshield",
        startupSME: "Less common; more prevalent where PMI is not offered",
        midSizeTech: "Common as an alternative to or alongside PMI",
        largeTech: "Less common where PMI is provided; sometimes offered as a supplementary benefit",
      },
      {
        benefit: "Permanent Health Insurance / Income Protection",
        companyProvision: "Not currently offered",
        startupSME: "Uncommon",
        midSizeTech: "Becoming more prevalent, especially alongside reduced sick pay entitlement",
        largeTech: "Around 50% of larger employers now offer this; increasingly seen as essential",
      },
      {
        benefit: "Digital GP",
        companyProvision: "Not currently offered",
        startupSME: "May be offered as part of PMI or health cash plan",
        midSizeTech: "Increasingly common as a standalone benefit or part of PMI",
        largeTech: "Typically offered as part of PMI or as a standalone benefit; becoming standard",
      },
      {
        benefit: "Health Screening",
        companyProvision: "Not currently offered",
        startupSME: "Uncommon",
        midSizeTech: "Mixed practice – not yet standard",
        largeTech: "Typically offered, especially at senior levels; often as part of PMI or wellbeing programme",
      },
      {
        benefit: "Gym Membership / Fitness Contribution",
        companyProvision: "Not currently offered",
        startupSME: "Informal perks (e.g. ClassPass credits) are common in tech startups",
        midSizeTech: "Contribution towards gym membership or fitness app subscription is common",
        largeTech: "Standard benefit – often through a flexible benefits scheme or on-site gym facilities",
      },
      {
        benefit: "Flu Jabs",
        companyProvision: "Not currently offered",
        startupSME: "Uncommon",
        midSizeTech: "Yes – increasingly standard",
        largeTech: "Yes – standard benefit",
      },
      {
        benefit: "Eye Care Vouchers",
        companyProvision: "Not currently offered",
        startupSME: "Mixed – legally required for DSE users but not always formalised",
        midSizeTech: "Yes – standard for DSE users",
        largeTech: "Yes – standard benefit",
      },
      {
        benefit: "Mental Health Apps / Support",
        companyProvision: "Not currently offered",
        startupSME: "Growing trend; apps like Headspace or Calm offered by some",
        midSizeTech: "Yes – mental health apps and first aider programmes common",
        largeTech: "Yes – comprehensive programmes including apps, counselling, and mental health first aiders",
      },
    ],
    ideas: [
      "Menopause and fertility support – emerging trend with some organisations offering specific policies and support",
      "Programmes to encourage physical fitness – step challenges, subsidised fitness classes, lunchtime yoga or running clubs",
      "On-site or virtual physiotherapy sessions – a newer benefit gaining traction in tech companies",
      "Sleep wellness programmes – education and tools to support better sleep; linked to productivity improvements",
    ],
  },
  {
    id: "financial",
    title: "Financial Support",
    icon: <Wallet className="w-5 h-5" />,
    gradient: "from-amber-400 to-orange-500",
    companyProvisions: [
      "Online retail discount platform",
      "Homeworking allowance at statutory level",
    ],
    rows: [
      {
        benefit: "Financial Education / Wellbeing",
        companyProvision: "Not currently offered",
        startupSME: "Uncommon but growing",
        midSizeTech: "Increasingly common – often offered through EAP or specialist provider",
        largeTech: "Standard practice – financial education webinars, pension planning support, and salary sacrifice schemes",
      },
      {
        benefit: "Low-Cost Loans / Season Ticket Loans",
        companyProvision: "Not currently offered",
        startupSME: "Uncommon",
        midSizeTech: "Season ticket and cycle-to-work loans are standard",
        largeTech: "Comprehensive – season ticket loans, tech purchase schemes, rental deposit loans",
      },
      {
        benefit: "Retail Discounts",
        companyProvision: "Yes – online discount platform",
        startupSME: "Growing – low-cost platforms like Perkbox widely available",
        midSizeTech: "Standard benefit – online retail discount platforms typical",
        largeTech: "Standard benefit – comprehensive platforms with wide range of discounts",
      },
      {
        benefit: "Homeworker Financial Allowance",
        companyProvision: "Yes – at statutory level",
        startupSME: "Relatively uncommon as a formal benefit",
        midSizeTech: "Mixed practice – some offer a one-off setup budget (typically £200–500)",
        largeTech: "Around 40% offer a home office setup budget; annual allowance less common",
      },
    ],
    ideas: [
      "Earned pay access (salary advance schemes) – 11% of UK employers surveyed by CIPD now offer this",
      "Rental deposit loan scheme – helping employees in high-cost areas",
      "Energy efficiency schemes and green salary sacrifice options",
      "Will writing services – a low-cost benefit that employees value highly",
      "Tech purchase salary sacrifice schemes – tax-efficient way for employees to buy personal technology",
    ],
  },
  {
    id: "esg",
    title: "Environmental, Social & Governance / Diversity, Equity & Inclusion",
    icon: <Leaf className="w-5 h-5" />,
    gradient: "from-emerald-500 to-teal-600",
    companyProvisions: [
      "No specific ESG/DEI benefits currently identified",
    ],
    rows: [
      {
        benefit: "Pension Invested Ethically",
        companyProvision: "Not currently offered",
        startupSME: "Mixed practice – growing interest but not standard",
        midSizeTech: "Yes – ethical investment options available in most pension schemes",
        largeTech: "Yes – ESG-screened pension options are typical; some default to ethical funds",
      },
      {
        benefit: "Commitment to Tackling Pay Inequality",
        companyProvision: "Not currently stated",
        startupSME: "Uncommon to have formal commitments",
        midSizeTech: "Yes – increasingly stated, with gender and ethnicity pay gap reporting",
        largeTech: "Yes – standard practice with published pay gap reports and action plans",
      },
      {
        benefit: "Paid Volunteering Days",
        companyProvision: "Not currently offered",
        startupSME: "Uncommon but valued when offered",
        midSizeTech: "Yes – typically 1–2 days per year",
        largeTech: "Around 60% offer volunteering days, with an average of 2–3 days per year",
      },
    ],
    ideas: [
      "Discounts on energy-efficient appliances or green commuting incentives",
      "Mentoring programmes for under-represented groups to break down occupational barriers",
      "Carbon offset schemes or matching employee donations to environmental causes",
      "Inclusive benefits reviews – ensuring benefit packages work for diverse employee populations",
    ],
  },
  {
    id: "learning",
    title: "Learning & Personal Development",
    icon: <GraduationCap className="w-5 h-5" />,
    gradient: "from-cyan-400 to-blue-500",
    companyProvisions: [
      "Personal development and training support",
    ],
    rows: [
      {
        benefit: "Personal Development Budget",
        companyProvision: "Training support available",
        startupSME: "Mixed – some offer annual budgets of £500–1,500; not yet standard",
        midSizeTech: "Increasingly common – budgets of £1,000–2,500 per person per year typical",
        largeTech: "Standard practice – annual budgets of £1,500–3,000+ with clear frameworks for usage",
      },
      {
        benefit: "Free Access to Courses & Platforms",
        companyProvision: "Not currently offered",
        startupSME: "Some offer Udemy or similar platform access",
        midSizeTech: "Yes – platforms like LinkedIn Learning, Pluralsight, or Udemy for Business common",
        largeTech: "Yes – comprehensive learning platforms with curated content; internal academies",
      },
      {
        benefit: "Professional Subscriptions Paid",
        companyProvision: "Not currently offered",
        startupSME: "Typically 1 relevant subscription paid for",
        midSizeTech: "1–2 professional subscriptions typical",
        largeTech: "2+ subscriptions, plus conference attendance budgets",
      },
      {
        benefit: "Career Development (Mentoring, Shadowing, Coaching)",
        companyProvision: "Not currently offered",
        startupSME: "Informal – mentoring through networks; limited formal programmes",
        midSizeTech: "Yes – mentoring programmes, internal mobility, and development pathways increasingly common",
        largeTech: "Comprehensive – formal mentoring, coaching, work shadowing, internal academies, and leadership programmes",
      },
    ],
    ideas: [
      "Innovation time – dedicated hours per week/month for personal projects or skill development (e.g. Google's '20% time' model)",
      "Conference attendance budget – separate from L&D budget, specifically for industry events and networking",
      "Internal tech talks and knowledge sharing sessions – low-cost, high-impact development opportunity",
      "Certification bonuses – financial reward for achieving relevant professional certifications",
    ],
  },
];

function BenefitSectionCard({ section, isOpen, onToggle }: {
  section: BenefitSection;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="section-card overflow-hidden" data-testid={`benefits-section-${section.id}`}>
      <button
        onClick={onToggle}
        className="w-full p-6 flex items-center gap-4 hover:bg-slate-50/50 transition-colors text-left"
        data-testid={`button-toggle-${section.id}`}
      >
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${section.gradient} flex items-center justify-center text-white shrink-0 shadow-md`}>
          {section.icon}
        </div>
        <div className="flex-1">
          <h2 className="font-display font-bold text-lg text-slate-800">{section.title}</h2>
          <p className="text-sm text-slate-400 mt-0.5">{section.rows.length} benefits compared across UK tech market segments</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
          {isOpen ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
        </div>
      </button>

      {isOpen && (
        <div className="px-6 pb-6 animate-fade-in">
          <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-xl p-5 mb-6 border border-slate-100">
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="w-4 h-4 text-blue-500" />
              <h3 className="font-display font-bold text-sm text-slate-700">{companyInfo.name} — Current Provision</h3>
            </div>
            <ul className="space-y-1.5">
              {section.companyProvisions.map((p, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          <h3 className="font-display font-bold text-sm text-slate-700 mb-3">Typical UK Tech Market Practice</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th className="text-left py-3 px-3 font-bold text-slate-700 w-[160px]">Benefit</th>
                  <th className="text-left py-3 px-3 font-bold text-blue-600 bg-blue-50/50 w-[140px]">{companyInfo.name.split(' ')[0]}</th>
                  <th className="text-left py-3 px-3 font-bold text-slate-600">Startup / SME Tech</th>
                  <th className="text-left py-3 px-3 font-bold text-slate-600">Mid-Size Tech</th>
                  <th className="text-left py-3 px-3 font-bold text-slate-600">Large Tech / Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {section.rows.map((row, i) => (
                  <tr key={i} className={`border-b border-slate-100 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                    <td className="py-3 px-3 font-semibold text-slate-700 align-top">{row.benefit}</td>
                    <td className="py-3 px-3 text-blue-700 bg-blue-50/30 align-top">{row.companyProvision}</td>
                    <td className="py-3 px-3 text-slate-600 align-top">{row.startupSME}</td>
                    <td className="py-3 px-3 text-slate-600 align-top">{row.midSizeTech}</td>
                    <td className="py-3 px-3 text-slate-600 align-top">{row.largeTech}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {section.ideas.length > 0 && (
            <div className="mt-5 p-4 bg-amber-50/70 rounded-xl border border-amber-100">
              <div className="flex items-center gap-2 mb-2.5">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <h4 className="font-display font-bold text-sm text-amber-800">Less Common Benefits & Emerging Ideas</h4>
              </div>
              <ul className="space-y-1.5">
                {section.ideas.map((idea, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-amber-900/70">
                    <Star className="w-3 h-3 text-amber-400 mt-1 shrink-0" />
                    <span>{idea}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function Benefits() {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(["core"]));

  const toggleSection = (id: string) => {
    setOpenSections(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const allOpen = openSections.size === benefitSections.length;
  const toggleAll = () => {
    if (allOpen) {
      setOpenSections(new Set());
    } else {
      setOpenSections(new Set(benefitSections.map(s => s.id)));
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="page-header">
        <p className="page-badge">Total Reward Analysis</p>
        <h1>Breakdown of Benefits Provision</h1>
        <p className="page-subtitle">
          Detailed comparison of your benefits package against typical UK tech market practice across three market segments.
        </p>
      </div>

      <Card className="p-6 bg-gradient-to-br from-slate-700 to-slate-800 text-white border-0 shadow-lg">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
            <Info className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-display font-bold mb-2">How to Read This Section</h2>
            <p className="text-white/80 text-[15px] leading-relaxed">
              For each benefit, we set out {companyInfo.name} provision as we understand it and then describe typical market practice across three UK tech market segments. We've used descriptive comparisons rather than quartile positioning because not all organisations will have all of the benefits listed — being 'below' in some areas does not necessarily mean provision is deficient. The most important factor is that benefits are aligned with the needs of your current and future workforce.
            </p>
          </div>
        </div>
      </Card>

      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{benefitSections.length} benefit categories</p>
        <button
          onClick={toggleAll}
          className="text-sm font-medium text-blue-500 hover:text-blue-600 transition-colors"
          data-testid="button-toggle-all"
        >
          {allOpen ? "Collapse All" : "Expand All"}
        </button>
      </div>

      <div className="space-y-4">
        {benefitSections.map((section) => (
          <BenefitSectionCard
            key={section.id}
            section={section}
            isOpen={openSections.has(section.id)}
            onToggle={() => toggleSection(section.id)}
          />
        ))}
      </div>

      <Card className="p-6 section-card">
        <h3 className="font-display font-bold text-lg text-slate-800 mb-4">Example of an Above-Standard Benefits Package</h3>
        <p className="text-sm text-slate-500 mb-5">
          Below is an example benefits package from a leading UK organisation that demonstrates best-in-class practice. Not every organisation will match this, but it provides a useful benchmark for what competitive benefits look like.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { category: "Core", items: ["25+ days holiday plus Christmas close-down", "Pension – up to 15% employer contribution", "Income protection – 50% salary for up to 5 years", "Life assurance – 4–6x base salary", "Gender-neutral family leave – 20 weeks paid"] },
            { category: "Health & Wellbeing", items: ["Private medical insurance (individual, with family top-up)", "Free gym and fitness classes", "24/7 Employee Assistance Programme", "Mental health first aiders network", "Health assessments every two years"] },
            { category: "Work-Life Balance", items: ["Flexible working hours and remote options", "Buy/sell up to 5 days holiday", "5 additional wellbeing days per year", "Sabbatical options after 5 years' service"] },
            { category: "Other", items: ["4 days paid volunteering per year", "Cycle-to-work scheme with 25%+ discount", "Retail discount platform", "Staff social club and team events", "Structured bonus scheme tied to performance"] },
          ].map((col) => (
            <div key={col.category} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <h4 className="font-display font-bold text-sm text-slate-700 mb-3">{col.category}</h4>
              <ul className="space-y-1.5">
                {col.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-100 shadow-sm">
        <div className="flex items-start gap-3">
          <Heart className="w-5 h-5 text-indigo-500 mt-0.5 shrink-0" />
          <div>
            <h3 className="font-display font-bold text-lg text-slate-800 mb-2">The Wellbeing Trend</h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Health and wellbeing is one of the fastest-growing areas of UK employee benefits. A rounded approach to wellbeing typically centres around four pillars: <strong>Mind</strong>, <strong>Body</strong>, <strong>Social Connection</strong>, and <strong>Finance</strong>. Leading organisations are moving beyond reactive support to proactive wellbeing strategies that empower employees to manage their own health and wellness.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { pillar: "Mind", desc: "Mental health support, counselling, stress management" },
                { pillar: "Body", desc: "Fitness programmes, health screening, ergonomic support" },
                { pillar: "Social", desc: "Team events, volunteering, community engagement" },
                { pillar: "Finance", desc: "Financial education, salary advance, pension planning" },
              ].map((p) => (
                <div key={p.pillar} className="bg-white rounded-lg p-3 border border-indigo-100">
                  <p className="font-display font-bold text-sm text-indigo-600 mb-1">{p.pillar}</p>
                  <p className="text-xs text-slate-500 leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
