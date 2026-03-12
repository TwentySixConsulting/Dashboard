import { Card } from "@/components/ui/card";
import { marketData, getPositioning } from "@/lib/data";
import { cn } from "@/lib/utils";

const careerLevels: Record<string, string> = {
  "Managing Director": "Senior",
  "Finance Director": "Senior",
  "Commercial Director": "Senior",
  "Data Manager": "Senior",
  "Product Owner": "Practitioner",
  "Management Accountant": "Practitioner",
  "Data Systems Engineer": "Practitioner",
  "Analyst": "Junior",
  "Data Researcher": "Junior",
  "Data Coordinator": "Junior",
};

const positionColors: Record<string, { bg: string; text: string; border: string }> = {
  below: { bg: "bg-red-50", text: "text-red-600", border: "border-red-200" },
  lower: { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200" },
  upper: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200" },
  above: { bg: "bg-sky-50", text: "text-sky-600", border: "border-sky-200" },
};

const positionBadgeColors: Record<string, string> = {
  below: "bg-red-500",
  lower: "bg-amber-500",
  upper: "bg-emerald-500",
  above: "bg-sky-500",
};

function SalaryRangeIndicator({ 
  current, 
  lq, 
  median, 
  uq 
}: { 
  current: number; 
  lq: number; 
  median: number; 
  uq: number;
}) {
  const min = Math.min(lq * 0.85, current * 0.9);
  const max = Math.max(uq * 1.15, current * 1.1);
  const range = max - min;
  
  const lqPos = ((lq - min) / range) * 100;
  const medianPos = ((median - min) / range) * 100;
  const uqPos = ((uq - min) / range) * 100;
  const currentPos = ((current - min) / range) * 100;

  return (
    <div>
      <div className="flex justify-between text-[10px] text-slate-400 uppercase tracking-wider mb-1.5 px-0.5">
        <span>LQ</span>
        <span style={{ position: 'absolute', left: `calc(${medianPos}% - 8px)` }}>Med</span>
        <span>UQ</span>
      </div>
      <div className="relative h-7">
        <div 
          className="absolute top-3 h-1.5 bg-red-200/60 rounded-l-full" 
          style={{ left: 0, width: `${lqPos}%` }}
        />
        <div 
          className="absolute top-3 h-1.5 rounded-none" 
          style={{ left: `${lqPos}%`, width: `${medianPos - lqPos}%`, background: 'linear-gradient(90deg, #fde68a, #a7f3d0)' }}
        />
        <div 
          className="absolute top-3 h-1.5 rounded-none" 
          style={{ left: `${medianPos}%`, width: `${uqPos - medianPos}%`, background: 'linear-gradient(90deg, #a7f3d0, #bae6fd)' }}
        />
        <div 
          className="absolute top-3 h-1.5 bg-sky-200/60 rounded-r-full" 
          style={{ left: `${uqPos}%`, right: 0 }}
        />
        
        <div 
          className="absolute top-2 w-px h-4 bg-slate-300"
          style={{ left: `${lqPos}%` }}
        />
        <div 
          className="absolute top-2 w-px h-4 bg-slate-500"
          style={{ left: `${medianPos}%` }}
        />
        <div 
          className="absolute top-2 w-px h-4 bg-slate-300"
          style={{ left: `${uqPos}%` }}
        />
        
        <div 
          className="absolute top-1 w-3.5 h-3.5 rounded-full border-2 border-white shadow-md"
          style={{ 
            left: `calc(${currentPos}% - 7px)`,
            backgroundColor: '#6366f1'
          }}
        />
      </div>
    </div>
  );
}

export function RoleDetails() {
  const functions = Array.from(new Set(marketData.map(r => r.function))).sort();

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="page-header">
        <p className="page-badge">Individual Role Analysis</p>
        <h1>Pay Benchmarking – Role by Role Analysis</h1>
      </div>

      {functions.map(fn => {
        const fnRoles = marketData.filter(r => r.function === fn);
        return (
          <div key={fn} className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200" />
              <h2 className="font-display font-bold text-lg text-slate-700 whitespace-nowrap">{fn}</h2>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {fnRoles.map((role, index) => {
                const pos = getPositioning(role.currentSalary, role.lowerQuartile, role.median, role.upperQuartile);
                const diff = role.currentSalary - role.median;
                const diffPercent = ((diff / role.median) * 100).toFixed(1);
                const colors = positionColors[pos.position];
                
                return (
                  <Card 
                    key={role.id} 
                    className={cn(
                      "overflow-hidden section-card hover:shadow-lg transition-all duration-300 opacity-0 animate-slide-up",
                      `stagger-${(index % 5) + 1}`
                    )}
                    data-testid={`role-card-${role.id}`}
                  >
                    <div className={cn("px-5 py-3 flex items-center justify-between border-b", colors.bg, colors.border)}>
                      <div>
                        <h3 className="font-display font-bold text-base text-slate-800">{role.role}</h3>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-xs text-slate-500">{role.function}</span>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs text-slate-500">{careerLevels[role.role] || "—"}</span>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs text-slate-500">{role.location}</span>
                        </div>
                      </div>
                      <span
                        className={cn(
                          "px-2.5 py-1 rounded-full text-xs font-medium text-white whitespace-nowrap",
                          positionBadgeColors[pos.position]
                        )}
                      >
                        {pos.label}
                      </span>
                    </div>

                    <div className="px-5 py-4 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Current Salary</p>
                          <p className="text-2xl font-display font-bold text-indigo-600">£{role.currentSalary.toLocaleString()}</p>
                          <p className={cn(
                            "text-xs font-medium mt-0.5",
                            diff > 0 ? "text-emerald-600" : diff < 0 ? "text-amber-600" : "text-slate-400"
                          )}>
                            {diff > 0 ? "+" : ""}£{diff.toLocaleString()} ({diff > 0 ? "+" : ""}{diffPercent}%) vs median
                          </p>
                        </div>
                      </div>

                      <div className="relative">
                        <SalaryRangeIndicator 
                          current={role.currentSalary}
                          lq={role.lowerQuartile}
                          median={role.median}
                          uq={role.upperQuartile}
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-2 pt-1">
                        <div className="text-center p-2.5 rounded-lg bg-violet-50/60 border border-violet-100">
                          <p className="text-[10px] text-violet-500 uppercase tracking-wider font-semibold mb-0.5">LQ</p>
                          <p className="font-bold text-sm text-violet-700">£{role.lowerQuartile.toLocaleString()}</p>
                        </div>
                        <div className="text-center p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-100">
                          <p className="text-[10px] text-emerald-500 uppercase tracking-wider font-semibold mb-0.5">Median</p>
                          <p className="font-bold text-sm text-emerald-700">£{role.median.toLocaleString()}</p>
                        </div>
                        <div className="text-center p-2.5 rounded-lg bg-sky-50/60 border border-sky-100">
                          <p className="text-[10px] text-sky-500 uppercase tracking-wider font-semibold mb-0.5">UQ</p>
                          <p className="font-bold text-sm text-sky-700">£{role.upperQuartile.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
