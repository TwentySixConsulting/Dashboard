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
  const lqFixed = 25;
  const medFixed = 50;
  const uqFixed = 75;

  let currentPos: number;
  if (current <= lq) {
    const belowRange = lq - lq * 0.8;
    const pct = belowRange > 0 ? (current - lq * 0.8) / belowRange : 0;
    currentPos = Math.max(2, pct * lqFixed);
  } else if (current <= median) {
    const pct = (current - lq) / (median - lq);
    currentPos = lqFixed + pct * (medFixed - lqFixed);
  } else if (current <= uq) {
    const pct = (current - median) / (uq - median);
    currentPos = medFixed + pct * (uqFixed - medFixed);
  } else {
    const aboveRange = uq * 1.2 - uq;
    const pct = aboveRange > 0 ? (current - uq) / aboveRange : 1;
    currentPos = Math.min(98, uqFixed + pct * (100 - uqFixed));
  }

  return (
    <div className="space-y-1">
      <div className="relative" style={{ height: '18px' }}>
        <div className="absolute text-[10px] font-semibold text-slate-400 uppercase tracking-wider" style={{ left: `${lqFixed}%`, transform: 'translateX(-50%)' }}>LQ</div>
        <div className="absolute text-[10px] font-semibold text-slate-500 uppercase tracking-wider" style={{ left: `${medFixed}%`, transform: 'translateX(-50%)' }}>Median</div>
        <div className="absolute text-[10px] font-semibold text-slate-400 uppercase tracking-wider" style={{ left: `${uqFixed}%`, transform: 'translateX(-50%)' }}>UQ</div>
      </div>

      <div className="relative h-5">
        <div className="absolute top-2 left-0 right-0 h-1.5 bg-slate-100 rounded-full" />

        <div 
          className="absolute top-2 h-1.5 rounded-l-full"
          style={{ left: 0, width: `${lqFixed}%`, background: 'linear-gradient(90deg, #fecaca 0%, #fde68a 100%)' }}
        />
        <div 
          className="absolute top-2 h-1.5"
          style={{ left: `${lqFixed}%`, width: `${medFixed - lqFixed}%`, background: 'linear-gradient(90deg, #fde68a 0%, #a7f3d0 100%)' }}
        />
        <div 
          className="absolute top-2 h-1.5"
          style={{ left: `${medFixed}%`, width: `${uqFixed - medFixed}%`, background: 'linear-gradient(90deg, #a7f3d0 0%, #bae6fd 100%)' }}
        />
        <div 
          className="absolute top-2 h-1.5 rounded-r-full"
          style={{ left: `${uqFixed}%`, width: `${100 - uqFixed}%`, background: 'linear-gradient(90deg, #bae6fd 0%, #93c5fd 100%)' }}
        />
        
        <div className="absolute top-0.5 w-px h-4 bg-slate-300" style={{ left: `${lqFixed}%` }} />
        <div className="absolute top-0.5 w-px h-4 bg-slate-500" style={{ left: `${medFixed}%` }} />
        <div className="absolute top-0.5 w-px h-4 bg-slate-300" style={{ left: `${uqFixed}%` }} />
        
        <div 
          className="absolute w-4 h-4 rounded-full border-2 border-white shadow-lg"
          style={{ 
            top: '-1px',
            left: `calc(${currentPos}% - 8px)`,
            backgroundColor: '#6366f1'
          }}
        />
      </div>

      <div className="relative" style={{ height: '14px' }}>
        <div className="absolute text-[9px] text-slate-400" style={{ left: `${lqFixed}%`, transform: 'translateX(-50%)' }}>£{lq.toLocaleString()}</div>
        <div className="absolute text-[9px] text-slate-500 font-medium" style={{ left: `${medFixed}%`, transform: 'translateX(-50%)' }}>£{median.toLocaleString()}</div>
        <div className="absolute text-[9px] text-slate-400" style={{ left: `${uqFixed}%`, transform: 'translateX(-50%)' }}>£{uq.toLocaleString()}</div>
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
