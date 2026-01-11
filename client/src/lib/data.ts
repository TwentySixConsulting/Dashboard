export interface BenchmarkRole {
  id: string;
  role: string;
  currentSalary: number;
  lowerQuartile: number;
  median: number;
  upperQuartile: number;
  function: string;
  jobLevel: number;
  location: string;
  notes?: string;
}

export const companyInfo = {
  name: "Saffron Housing",
  industry: "Housing Association",
  location: "Norfolk",
  reportDate: "January 2026",
};

export const benchmarkData: BenchmarkRole[] = [
  {
    id: "1",
    role: "Technical Manager",
    currentSalary: 65000,
    lowerQuartile: 65000,
    median: 68000,
    upperQuartile: 72000,
    function: "Technical",
    jobLevel: 3,
    location: "Norfolk",
  },
  {
    id: "2",
    role: "Learning & Development Manager",
    currentSalary: 45000,
    lowerQuartile: 42000,
    median: 45000,
    upperQuartile: 48000,
    function: "HR",
    jobLevel: 3,
    location: "Norfolk",
    notes: "This is a small team role",
  },
  {
    id: "3",
    role: "Learning & Development Officer",
    currentSalary: 26000,
    lowerQuartile: 26000,
    median: 28000,
    upperQuartile: 29500,
    function: "HR",
    jobLevel: 6,
    location: "Norfolk",
  },
  {
    id: "4",
    role: "People Business Partner",
    currentSalary: 65000,
    lowerQuartile: 56000,
    median: 61000,
    upperQuartile: 64000,
    function: "HR",
    jobLevel: 3,
    location: "Norfolk",
    notes: "Basically now at upper quartile",
  },
  {
    id: "5",
    role: "Data Protection Officer",
    currentSalary: 44000,
    lowerQuartile: 38000,
    median: 41000,
    upperQuartile: 44000,
    function: "Governance",
    jobLevel: 4,
    location: "Norfolk",
  },
  {
    id: "6",
    role: "Governance Officer",
    currentSalary: 30000,
    lowerQuartile: 29000,
    median: 31000,
    upperQuartile: 33000,
    function: "Governance",
    jobLevel: 5,
    location: "Norfolk",
    notes: "Developing role",
  },
  {
    id: "7",
    role: "Head of Electrical Services",
    currentSalary: 66000,
    lowerQuartile: 62000,
    median: 66000,
    upperQuartile: 69000,
    function: "Technical",
    jobLevel: 1,
    location: "Norfolk",
  },
  {
    id: "8",
    role: "Maintenance Delivery Manager",
    currentSalary: 46000,
    lowerQuartile: 41000,
    median: 45000,
    upperQuartile: 48000,
    function: "Technical",
    jobLevel: 3,
    location: "Norfolk",
  },
  {
    id: "9",
    role: "Independent Living Manager",
    currentSalary: 42000,
    lowerQuartile: 38000,
    median: 42000,
    upperQuartile: 45000,
    function: "Operations",
    jobLevel: 3,
    location: "Norfolk",
  },
];

export const marketTrends = {
  averagePayRise: 3.8,
  cpi: 3.8,
  realLivingWage: 12.60,
  londonLivingWage: 13.85,
  unemploymentRate: 4.7,
  minimumSalary37_5: 23809,
};

export const sectorInsights = {
  averageSalaryIncrease: 3.2,
  medianTurnover: 12.5,
  topBenefits: ["Flexible Working", "Pension (avg 6%)", "25+ Days Leave", "Wellbeing Support"],
  recruitmentChallenges: ["Technical roles", "Leadership positions", "Entry-level competition"],
};

export function getPositioning(currentSalary: number, lq: number, median: number, uq: number): {
  position: "below" | "lower" | "median" | "upper" | "above";
  label: string;
  color: string;
  percentage: number;
} {
  const range = uq - lq;
  const position = ((currentSalary - lq) / range) * 100;
  
  if (currentSalary < lq) {
    return { position: "below", label: "Below Market", color: "hsl(0, 72%, 51%)", percentage: Math.max(0, position) };
  } else if (currentSalary < median - (range * 0.1)) {
    return { position: "lower", label: "Lower Quartile", color: "hsl(35, 90%, 55%)", percentage: position };
  } else if (currentSalary <= median + (range * 0.1)) {
    return { position: "median", label: "At Median", color: "hsl(160, 70%, 45%)", percentage: position };
  } else if (currentSalary <= uq) {
    return { position: "upper", label: "Upper Quartile", color: "hsl(200, 85%, 55%)", percentage: position };
  } else {
    return { position: "above", label: "Above Market", color: "hsl(280, 65%, 55%)", percentage: Math.min(100, position) };
  }
}

export const salaryTrendData = [
  { year: "2021", housing: 2.1, market: 2.5 },
  { year: "2022", housing: 3.2, market: 4.1 },
  { year: "2023", housing: 4.5, market: 5.2 },
  { year: "2024", housing: 3.8, market: 4.0 },
  { year: "2025", housing: 3.2, market: 3.8 },
];

export const cpiTrendData = [
  { month: "Jan", cpi: 4.0 },
  { month: "Feb", cpi: 3.8 },
  { month: "Mar", cpi: 3.5 },
  { month: "Apr", cpi: 3.2 },
  { month: "May", cpi: 3.0 },
  { month: "Jun", cpi: 2.8 },
  { month: "Jul", cpi: 3.2 },
  { month: "Aug", cpi: 3.8 },
];

export const distributionData = [
  { name: "Below Market", value: 0, color: "hsl(0, 72%, 51%)" },
  { name: "Lower Quartile", value: 2, color: "hsl(35, 90%, 55%)" },
  { name: "At Median", value: 4, color: "hsl(160, 70%, 45%)" },
  { name: "Upper Quartile", value: 2, color: "hsl(200, 85%, 55%)" },
  { name: "Above Market", value: 1, color: "hsl(280, 65%, 55%)" },
];
