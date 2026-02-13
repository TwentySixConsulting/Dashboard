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
  smallPrivate: string;
  socialEnterprises: string;
  largePrivate: string;
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
        smallPrivate: "Yes – either profit share or performance bonus common, typically between 5–20% depending on role and organisation",
        socialEnterprises: "Rare",
        largePrivate: "Yes – either profit share or performance bonus common, typically between 5–20% depending on role and organisation",
      },
      {
        benefit: "Annual Leave",
        smallPrivate: "20–25 days (plus bank holidays), increasing with service",
        socialEnterprises: "25–28 days, increasing with service",
        largePrivate: "25 days (with around 50% increasing annual leave through service)",
      },
      {
        benefit: "Additional Days (e.g. Christmas close-down)",
        smallPrivate: "Relatively uncommon",
        socialEnterprises: "1–3 additional days at Christmas is common but not universal",
        largePrivate: "Relatively uncommon",
      },
      {
        benefit: "Buy & Sell Leave",
        smallPrivate: "Relatively uncommon",
        socialEnterprises: "Being able to buy leave (up to 5 days) is a typical benefit; being able to sell leave is less common, although does happen",
        largePrivate: "Ability to buy/sell up to 5 days",
      },
      {
        benefit: "Pension",
        smallPrivate: "Auto-enrolment levels are typical market practice",
        socialEnterprises: "5–7% employer contribution is typical",
        largePrivate: "5–7% employer contribution is typical, although ability to match contributions up to a typical level of 8%",
      },
      {
        benefit: "Sick Pay",
        smallPrivate: "10 days' full, followed by discretionary element",
        socialEnterprises: "3 months' full; 3 months' half pay",
        largePrivate: "3 months' full; 3 months' half pay (followed by Permanent Health Insurance)",
      },
      {
        benefit: "Maternity Pay",
        smallPrivate: "Statutory",
        socialEnterprises: "Enhanced – 12 weeks' full pay",
        largePrivate: "6 months' full pay",
      },
      {
        benefit: "Paternity Pay",
        smallPrivate: "Statutory",
        socialEnterprises: "2 weeks' full pay",
        largePrivate: "2 weeks' full pay is the typical benefit, but around 50% of organisations are considering extending this to match maternity benefit",
      },
      {
        benefit: "Share Schemes",
        smallPrivate: "Formal equity is relatively rare and is more commonly used as a tool in founder-led progressive organisations",
        socialEnterprises: "N/A",
        largePrivate: "Share options and Save As You Earn share schemes are the norm",
      },
      {
        benefit: "Car Allowance",
        smallPrivate: "Typically for job need rather than status",
        socialEnterprises: "Rare",
        largePrivate: "Car allowance is given both for job need and typically at operational manager level upwards as a status perk",
      },
    ],
    ideas: [
      "Additional days (up to 3) as Wellbeing/Mental Health Days that can be taken in addition to annual leave at short notice",
      "Gender-neutral parental leave policies – a growing trend, with some UK firms offering 20+ weeks regardless of gender",
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
        smallPrivate: "Statutory only",
        socialEnterprises: "Yes: part-time; job-share; compressed hours offered",
        largePrivate: "More variable practice, but larger professional services organisations would typically offer part-time, job-share and compressed hours",
      },
      {
        benefit: "Hybrid/Remote Working",
        smallPrivate: "Mixed practice, but with the emphasis on being office-based",
        socialEnterprises: "Mixed practice: some but not all roles offered with the possibility of hybrid, with a minimum of 1–2 days per week in the office",
        largePrivate: "Mixed practice: some but not all roles offered with the possibility of hybrid, with a minimum of 1–2 days per week in the office",
      },
      {
        benefit: "Sabbaticals",
        smallPrivate: "No",
        socialEnterprises: "Yes, typically after 3–5 years' service, ranging from 3–12 months",
        largePrivate: "Yes, typically after 3–5 years' service, ranging from 3–12 months",
      },
      {
        benefit: "Compassionate Leave",
        smallPrivate: "Discretionary",
        socialEnterprises: "Up to 5 days",
        largePrivate: "Up to 5 days",
      },
    ],
    ideas: [
      "Paid carers leave – we found a few organisations offering this up to a week (or in one case two weeks)",
      "4-day working week – CIPD found 6% of UK employers offer this to all staff",
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
        smallPrivate: "No",
        socialEnterprises: "Yes – 3/4x salary",
        largePrivate: "Yes – 3/4x salary",
      },
      {
        benefit: "Employee Assistance Programme",
        smallPrivate: "Yes",
        socialEnterprises: "Yes",
        largePrivate: "Yes",
      },
      {
        benefit: "Private Medical Insurance",
        smallPrivate: "No",
        socialEnterprises: "Currently not typically offered – however, we are seeing more interest so this is one to watch",
        largePrivate: "This is a standard benefit in larger organisations, with 84% of respondents to a large benefits survey offering this. Coverage is typically for individuals with the ability to top up to family membership",
      },
      {
        benefit: "Health Cash Plan (including dental)",
        smallPrivate: "No",
        socialEnterprises: "Yes – this is a very common benefit, much more so than PMI",
        largePrivate: "Less common due to the prevalence of PMI",
      },
      {
        benefit: "Permanent Health Insurance",
        smallPrivate: "No",
        socialEnterprises: "This is not yet a standard benefit, but has become more prevalent with the decrease in sick pay entitlement over the past 10 years",
        largePrivate: "Mixed practice, with around half of private sector employers offering this",
      },
      {
        benefit: "Digital GP",
        smallPrivate: "No",
        socialEnterprises: "May be offered as part of PMI or Health Cash Plan but not a standard benefit",
        largePrivate: "Typically offered as part of PMI or Health Cash Plan – a more standard benefit than in the not-for-profit sector",
      },
      {
        benefit: "Health Screening",
        smallPrivate: "No",
        socialEnterprises: "Mixed practice – not a standard benefit",
        largePrivate: "Typically offered as part of PMI or Health Cash Plan",
      },
      {
        benefit: "Gym Membership",
        smallPrivate: "No",
        socialEnterprises: "Contribution towards gym membership is a common benefit",
        largePrivate: "Contribution towards gym membership is a common benefit – often as part of a flexible benefits scheme",
      },
      {
        benefit: "Flu Jabs",
        smallPrivate: "No",
        socialEnterprises: "Yes",
        largePrivate: "Yes",
      },
      {
        benefit: "Eye Care Vouchers",
        smallPrivate: "Yes",
        socialEnterprises: "Yes",
        largePrivate: "Yes",
      },
      {
        benefit: "Access to Mental Health Apps",
        smallPrivate: "No",
        socialEnterprises: "Yes, but much less provision of Digital GP services",
        largePrivate: "Yes",
      },
    ],
    ideas: [
      "Free fruit or other food (this was very common at one point but appears to have fallen out of favour)",
      "Programmes to encourage employee health/physical fitness/relaxation courses",
      "Menopause and fertility support – emerging trend with some organisations offering specific policies and support",
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
        benefit: "Financial Education",
        smallPrivate: "No",
        socialEnterprises: "This has become increasingly common and is often offered through the EAP provider",
        largePrivate: "This has become increasingly common and is often offered through the EAP provider",
      },
      {
        benefit: "Low-Cost Loans and Savings Plans",
        smallPrivate: "No",
        socialEnterprises: "Low-cost loans typically given for specific items, such as Season Tickets. There is some use of Credit Unions but not universal practice",
        largePrivate: "Low-cost loans typically given for specific items, such as Season Tickets. Save As You Earn/Share Save schemes are common",
      },
      {
        benefit: "Retail Discounts",
        smallPrivate: "No",
        socialEnterprises: "Online retail discount provider is typical",
        largePrivate: "Online retail discount provider is typical",
      },
      {
        benefit: "Homeworker Financial Allowance",
        smallPrivate: "Relatively uncommon",
        socialEnterprises: "Relatively uncommon",
        largePrivate: "Relatively uncommon",
      },
    ],
    ideas: [
      "Earned pay access (Employer Salary Access Scheme) – 11% of respondents to the CIPD's Reward Management Survey had this",
      "Rental deposit loan scheme",
      "Motorsave – discounts on car maintenance",
      "Energy switching schemes",
      "Will writing services",
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
        smallPrivate: "No",
        socialEnterprises: "Yes (but practice more mixed than in Foundations)",
        largePrivate: "Mixed practice",
      },
      {
        benefit: "Commitment to Tackling Pay Inequality",
        smallPrivate: "No",
        socialEnterprises: "Yes – stated",
        largePrivate: "Yes – stated",
      },
      {
        benefit: "Paid Volunteering Days",
        smallPrivate: "No",
        socialEnterprises: "Yes – typically around 1–2 days",
        largePrivate: "Around 50% with an average provision of 1.5 days",
      },
    ],
    ideas: [
      "Discounts on energy-efficient appliances",
      "Mentoring opportunities for under-represented groups to break down occupational barriers",
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
        smallPrivate: "No",
        socialEnterprises: "Mixed practice – not standard to have a personal budget that is not linked to work outcomes",
        largePrivate: "Mixed practice – not standard to have a personal budget that is not linked to work outcomes",
      },
      {
        benefit: "Free Access to Courses and Videos",
        smallPrivate: "Mixed practice",
        socialEnterprises: "Yes",
        largePrivate: "Yes",
      },
      {
        benefit: "Relevant Professional Subscriptions Paid",
        smallPrivate: "Yes – typically 1 subscription paid for",
        socialEnterprises: "Yes – typically 2 subscriptions paid for",
        largePrivate: "Yes – typically 2 subscriptions paid for",
      },
      {
        benefit: "Career Development (Training, Shadowing, Mentoring)",
        smallPrivate: "No",
        socialEnterprises: "Yes, this is typical market practice. The not-for-profit sector typically places more emphasis on learning opportunities than the private sector",
        largePrivate: "Yes, larger corporates have the full range of development opportunities",
      },
    ],
    ideas: [
      "Innovation time – dedicated hours per week/month for personal projects or skill development",
      "Conference attendance budget – separate from L&D budget, specifically for industry events and networking",
      "Internal knowledge sharing sessions – low-cost, high-impact development opportunity",
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
          <p className="text-sm text-slate-400 mt-0.5">{section.rows.length} benefits compared across UK market segments</p>
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

          <h3 className="font-display font-bold text-sm text-slate-700 mb-3">Typical Market Practice</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th className="text-left py-3 px-3 font-bold text-slate-700 w-[180px]">Benefit</th>
                  <th className="text-left py-3 px-3 font-bold text-slate-600">Small Private Sector</th>
                  <th className="text-left py-3 px-3 font-bold text-slate-600">Social Enterprises</th>
                  <th className="text-left py-3 px-3 font-bold text-slate-600">Large Private Sector</th>
                </tr>
              </thead>
              <tbody>
                {section.rows.map((row, i) => (
                  <tr key={i} className={`border-b border-slate-100 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                    <td className="py-3 px-3 font-semibold text-slate-700 align-top">{row.benefit}</td>
                    <td className="py-3 px-3 text-slate-600 align-top">{row.smallPrivate}</td>
                    <td className="py-3 px-3 text-slate-600 align-top">{row.socialEnterprises}</td>
                    <td className="py-3 px-3 text-slate-600 align-top">{row.largePrivate}</td>
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
          Detailed comparison of benefits practice across three UK market segments. For each benefit, we describe typical market practice to help inform your reward strategy.
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
              For each benefit, we set out {companyInfo.name} provision as we understand it and then describe typical market practice. We've done this rather than use our standard LQ/M/UQ practice because the latter is misleading in that not all organisations will have all of the benefits listed to the level described. Therefore, to be 'below' in some areas does not necessarily mean benefits provision is deficient — the most important factor is that benefits are aligned with the needs of your current and future workforce.
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
        <h3 className="font-display font-bold text-lg text-slate-800 mb-4">Examples of Above-Standard Benefits Packages</h3>
        <p className="text-sm text-slate-500 mb-5">
          Below, we give an overview of two packages that stood out during our research — one from the not-for-profit sector and one from the private sector. Neither has absolutely everything, but they are interesting. The key is that benefits need to be aligned to the needs of your current and future employee base in all its diversity.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
            <h4 className="font-display font-bold text-sm text-slate-700 mb-1">Not-for-Profit Example</h4>
            <p className="text-xs text-slate-400 mb-3">Large charitable trust</p>
            <ul className="space-y-1.5">
              {[
                "25 days' holiday plus bank holidays and Christmas close-down",
                "Pension – up to 15% employer contribution",
                "Income protection – maintains income during prolonged illness",
                "Life assurance – 4–6x base salary",
                "Private medical insurance (individual, with family top-up option)",
                "Free gym membership and subsidised fitness classes",
                "24/7 Employee Assistance Programme",
                "Mental health first aiders network",
                "Health assessments every two years",
                "Buy/sell up to 5 days' holiday",
                "4 days' paid volunteering per year",
                "Cycle-to-work scheme with 25%+ discount",
                "Retail discount platform",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
            <h4 className="font-display font-bold text-sm text-slate-700 mb-1">Large Private Sector Example</h4>
            <p className="text-xs text-slate-400 mb-3">Major financial services company</p>
            <ul className="space-y-1.5">
              {[
                "30 days' annual leave for all colleagues plus bank holidays",
                "5 extra paid wellbeing days per year",
                "Gender-neutral family leave – 20 weeks' paid (52 weeks total)",
                "Pension – up to 13% employer contribution",
                "Income protection – 50% of salary for up to 5 years",
                "Life insurance – 4x base salary, with option to increase",
                "Private medical insurance with family extension option",
                "Structured bonus scheme tied to group and individual performance",
                "Flexible benefits – customise your rewards package",
                "Comprehensive retail discount platform",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
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
                { pillar: "Mind", desc: "Mental health support, counselling, stress management, mental health first aiders" },
                { pillar: "Body", desc: "Fitness programmes, health screening, ergonomic support, flu jabs" },
                { pillar: "Social", desc: "Team events, volunteering, community engagement, quarterly wellbeing check-ins" },
                { pillar: "Finance", desc: "Financial education, salary advance, pension planning, retail discounts" },
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
