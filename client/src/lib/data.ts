export interface MarketDataRole {
  id: string;
  role: string;
  currentSalary: number;
  expectedSalary?: number;
  lowerQuartile: number;
  median: number;
  upperQuartile: number;
  medianDifference: number;
  function: string;
  jobLevel: number;
  location: string;
  notes?: string;
}

export const companyInfo = {
  name: "Brighton Demo Technologies",
  industry: "SaaS / Technology",
  location: "London/South East",
  reportDate: "Q1: March 2026",
  employees: 15,
  rolesAssessed: 10,
};

export const marketData: MarketDataRole[] = [
  {
    id: "1",
    role: "Analyst",
    currentSalary: 27000,
    lowerQuartile: 27000,
    median: 29500,
    upperQuartile: 33000,
    medianDifference: -0.0926,
    function: "Data & Analytics",
    jobLevel: 5,
    location: "Brighton",
  },
  {
    id: "2",
    role: "Data Researcher",
    currentSalary: 24000,
    expectedSalary: 25000,
    lowerQuartile: 22500,
    median: 23500,
    upperQuartile: 24000,
    medianDifference: 0.0208,
    function: "Data & Analytics",
    jobLevel: 6,
    location: "Brighton",
  },
  {
    id: "3",
    role: "Data Systems Engineer",
    currentSalary: 47500,
    lowerQuartile: 45000,
    median: 50000,
    upperQuartile: 55000,
    medianDifference: -0.0526,
    function: "Technology",
    jobLevel: 4,
    location: "Brighton",
  },
  {
    id: "4",
    role: "Data Manager",
    currentSalary: 54600,
    lowerQuartile: 50000,
    median: 56000,
    upperQuartile: 62000,
    medianDifference: -0.0256,
    function: "Data & Analytics",
    jobLevel: 3,
    location: "Brighton",
  },
  {
    id: "5",
    role: "Data Coordinator",
    currentSalary: 27000,
    lowerQuartile: 25000,
    median: 27500,
    upperQuartile: 30000,
    medianDifference: -0.0185,
    function: "Data & Analytics",
    jobLevel: 6,
    location: "Brighton",
  },
  {
    id: "6",
    role: "Product Owner",
    currentSalary: 56000,
    expectedSalary: 60000,
    lowerQuartile: 51000,
    median: 56000,
    upperQuartile: 63000,
    medianDifference: 0,
    function: "Product",
    jobLevel: 3,
    location: "Brighton",
  },
  {
    id: "7",
    role: "Finance Director",
    currentSalary: 87000,
    lowerQuartile: 78000,
    median: 86000,
    upperQuartile: 94000,
    medianDifference: 0.0115,
    function: "Finance",
    jobLevel: 1,
    location: "Brighton",
  },
  {
    id: "8",
    role: "Management Accountant",
    currentSalary: 44000,
    lowerQuartile: 40000,
    median: 44000,
    upperQuartile: 48000,
    medianDifference: 0,
    function: "Finance",
    jobLevel: 4,
    location: "Brighton",
  },
  {
    id: "9",
    role: "Commercial Director",
    currentSalary: 82000,
    lowerQuartile: 72000,
    median: 80000,
    upperQuartile: 89000,
    medianDifference: 0.0244,
    function: "Commercial",
    jobLevel: 1,
    location: "Brighton",
  },
  {
    id: "10",
    role: "Managing Director",
    currentSalary: 110000,
    lowerQuartile: 100000,
    median: 110000,
    upperQuartile: 120000,
    medianDifference: 0,
    function: "Leadership",
    jobLevel: 1,
    location: "Brighton",
  },
];

export const marketTrends = {
  averagePayRise: 3.5,
  cpi: 3.0,
  realLivingWage: 12.60,
  londonLivingWage: 13.85,
  unemploymentRate: 4.4,
  minimumSalary37_5: 23809,
  averageWeeklyEarnings: 698,
  payRisePrediction: 3.2,
};

export const sectorInsights = {
  averageSalaryIncrease: 3.5,
  medianTurnover: 14.2,
  topBenefits: ["Flexible Working", "Pension (avg 5%)", "25+ Days Leave", "Private Medical"],
  recruitmentChallenges: ["Data & engineering roles", "Senior leadership", "Product specialists"],
};

export function getPositioning(currentSalary: number, lq: number, median: number, uq: number): {
  position: "below" | "lower" | "upper" | "above";
  label: string;
  color: string;
  percentage: number;
} {
  const range = uq - lq;
  const position = ((currentSalary - lq) / range) * 100;
  
  if (currentSalary < lq) {
    return { position: "below", label: "Below LQ", color: "hsl(0, 72%, 51%)", percentage: Math.max(0, position) };
  } else if (currentSalary < median) {
    return { position: "lower", label: "LQ to Median", color: "hsl(35, 90%, 55%)", percentage: position };
  } else if (currentSalary <= uq) {
    return { position: "upper", label: "Median to UQ", color: "hsl(160, 70%, 45%)", percentage: position };
  } else {
    return { position: "above", label: "Above UQ", color: "hsl(210, 80%, 55%)", percentage: Math.min(100, position) };
  }
}

export const salaryTrendData = [
  { year: "2021", company: 2.5, market: 2.8 },
  { year: "2022", company: 3.8, market: 4.5 },
  { year: "2023", company: 5.0, market: 5.5 },
  { year: "2024", company: 4.2, market: 4.0 },
  { year: "2025", company: 3.5, market: 3.8 },
];

export const cpiTrendData = [
  { month: "Jan", cpi: 3.0 },
  { month: "Feb", cpi: 2.8 },
  { month: "Mar", cpi: 2.6 },
  { month: "Apr", cpi: 2.9 },
  { month: "May", cpi: 3.1 },
  { month: "Jun", cpi: 2.7 },
  { month: "Jul", cpi: 3.0 },
  { month: "Aug", cpi: 3.2 },
];

export const distributionData = (() => {
  const counts = { below: 0, lower: 0, upper: 0, above: 0 };
  marketData.forEach((role) => {
    const pos = getPositioning(role.currentSalary, role.lowerQuartile, role.median, role.upperQuartile);
    counts[pos.position]++;
  });
  return [
    { name: "Below LQ", value: counts.below, color: "hsl(0, 72%, 51%)" },
    { name: "LQ to Median", value: counts.lower, color: "hsl(35, 90%, 55%)" },
    { name: "Median to UQ", value: counts.upper, color: "hsl(160, 70%, 45%)" },
    { name: "Above UQ", value: counts.above, color: "hsl(210, 80%, 55%)" },
  ];
})();

export const bonusData = [
  { level: "Executive / Director", lq: 15, median: 25, uq: 40 },
  { level: "Senior Manager / Head of", lq: 10, median: 15, uq: 25 },
  { level: "Manager", lq: 5, median: 10, uq: 15 },
  { level: "Senior Professional", lq: 3, median: 7, uq: 12 },
  { level: "Professional", lq: 0, median: 5, uq: 10 },
  { level: "Administrative / Support", lq: 0, median: 3, uq: 5 },
  { level: "Sales Roles", lq: 20, median: 30, uq: 40 },
];
