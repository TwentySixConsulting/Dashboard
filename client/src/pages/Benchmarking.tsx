import { useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { marketData, getPositioning } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Download } from "lucide-react";

import { toPng } from "html-to-image";

function QuartilesExplained() {
  const graphicRef = useRef<HTMLDivElement>(null);

  const handleExport = async () => {
    if (graphicRef.current) {
      try {
        const dataUrl = await toPng(graphicRef.current, {
          backgroundColor: "#ffffff",
          pixelRatio: 2,
        });
        const link = document.createElement("a");
        link.download = "quartiles-explained.png";
        link.href = dataUrl;
        link.click();
      } catch (error) {
        console.error("Failed to export image:", error);
      }
    }
  };

  return (
    <Card className="p-6 section-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-bold text-xl">Quartiles Explained</h3>
        <Button 
          onClick={handleExport} 
          variant="outline" 
          size="sm" 
          className="gap-2"
          data-testid="button-export-quartiles"
        >
          <Download className="w-4 h-4" />
          Export Image
        </Button>
      </div>

      <div ref={graphicRef} className="p-4 bg-white">
        <div className="mb-6">
          <div className="flex h-12 rounded-lg overflow-hidden border border-slate-200">
            <div className="flex-1 bg-rose-100 flex items-center justify-center border-r border-slate-200">
              <span className="text-xs font-medium text-rose-700 text-center px-1">Below Lower Quartile</span>
            </div>
            <div className="flex-1 flex items-center justify-center border-r border-slate-200" style={{ backgroundColor: 'rgba(212, 160, 83, 0.15)' }}>
              <span className="text-xs font-medium text-center px-1" style={{ color: '#9a7530' }}>LQ → Median</span>
            </div>
            <div className="flex-1 bg-teal-100 flex items-center justify-center border-r border-slate-200">
              <span className="text-xs font-medium text-teal-700 text-center px-1">Median → UQ</span>
            </div>
            <div className="flex-1 bg-sky-100 flex items-center justify-center">
              <span className="text-xs font-medium text-sky-700 text-center px-1">Above Upper Quartile</span>
            </div>
          </div>

          <div className="relative h-8 mt-1">
            <div className="absolute left-0 right-0 top-0 h-px bg-slate-300" />
            
            <div className="absolute" style={{ left: "25%" }}>
              <div className="w-px h-3 bg-slate-400 -translate-x-1/2" />
              <p className="text-xs text-slate-600 font-medium mt-1 -translate-x-1/2 whitespace-nowrap">Lower Quartile</p>
            </div>
            
            <div className="absolute" style={{ left: "50%" }}>
              <div className="w-px h-3 bg-slate-600 -translate-x-1/2" />
              <p className="text-xs text-slate-800 font-semibold mt-1 -translate-x-1/2">Median</p>
            </div>
            
            <div className="absolute" style={{ left: "75%" }}>
              <div className="w-px h-3 bg-slate-400 -translate-x-1/2" />
              <p className="text-xs text-slate-600 font-medium mt-1 -translate-x-1/2 whitespace-nowrap">Upper Quartile</p>
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">
          <strong>Market data points:</strong> We use three standard reference points — Lower Quartile (LQ), Median, and Upper Quartile (UQ). 
          <strong> Position bands:</strong> Each role's salary is categorised into one of four bands based on where it falls relative to these reference points.
        </p>
      </div>
    </Card>
  );
}

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

export function Benchmarking() {
  const positionColors: Record<string, string> = {
    below: "bg-rose-500/90",
    lower: "bg-amber-500/90",
    upper: "bg-teal-500/90",
    above: "bg-sky-500/90",
  };

  const downloadCSV = () => {
    const headers = ["Role", "Function", "Current Salary", "Lower Quartile", "Median", "Upper Quartile", "Position"];
    const rows = marketData.map(role => {
      const pos = getPositioning(role.currentSalary, role.lowerQuartile, role.median, role.upperQuartile);
      return [
        role.role,
        role.function,
        role.currentSalary,
        role.lowerQuartile,
        role.median,
        role.upperQuartile,
        pos.label
      ].join(",");
    });
    
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "market_data_results.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="page-header">
        <p className="page-badge">Salary Analysis</p>
        <h1>Pay Benchmarking Overview</h1>
        <p className="page-subtitle">Overview of all roles with market ranges.</p>
      </div>

      <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-700/50" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}>
        <div className="flex items-center justify-between px-6 py-5">
          <h3 className="font-display font-bold text-xl text-white">Summary of Market Data & Position</h3>
          <Button onClick={downloadCSV} variant="outline" className="gap-2 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white" data-testid="button-download">
            <Download className="w-4 h-4" />
            Download CSV
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-600/50" style={{ background: 'rgba(15, 23, 42, 0.6)' }}>
                <th className="text-left py-4 px-4 font-semibold text-slate-300 text-xs uppercase tracking-wider">Role</th>
                <th className="text-left py-4 px-4 font-semibold text-slate-300 text-xs uppercase tracking-wider">Function</th>
                <th className="text-left py-4 px-4 font-semibold text-slate-300 text-xs uppercase tracking-wider">Career Level</th>
                <th className="text-right py-4 px-4 font-semibold text-slate-300 text-xs uppercase tracking-wider">Current</th>
                <th className="text-right py-4 px-4 font-semibold text-xs uppercase tracking-wider" style={{ color: '#d4a053' }}>LQ</th>
                <th className="text-right py-4 px-4 font-semibold text-xs uppercase tracking-wider" style={{ color: '#5eead4' }}>Median</th>
                <th className="text-right py-4 px-4 font-semibold text-xs uppercase tracking-wider" style={{ color: '#7dd3fc' }}>UQ</th>
                <th className="text-center py-4 px-4 font-semibold text-slate-300 text-xs uppercase tracking-wider">Position</th>
              </tr>
            </thead>
            <tbody>
              {marketData.map((role, i) => {
                const pos = getPositioning(role.currentSalary, role.lowerQuartile, role.median, role.upperQuartile);
                return (
                  <tr 
                    key={role.id} 
                    className={cn(
                      "border-b border-slate-700/40 transition-colors hover:bg-white/5",
                      i % 2 === 0 ? "" : "bg-white/[0.02]"
                    )}
                  >
                    <td className="py-3.5 px-4 font-medium text-white">{role.role}</td>
                    <td className="py-3.5 px-4 text-slate-400">{role.function}</td>
                    <td className="py-3.5 px-4 text-slate-400">{careerLevels[role.role] || "—"}</td>
                    <td className="py-3.5 px-4 text-right font-semibold text-white">£{role.currentSalary.toLocaleString()}</td>
                    <td className="py-3.5 px-4 text-right font-medium" style={{ color: '#d4a053' }}>£{role.lowerQuartile.toLocaleString()}</td>
                    <td className="py-3.5 px-4 text-right font-medium" style={{ color: '#5eead4' }}>£{role.median.toLocaleString()}</td>
                    <td className="py-3.5 px-4 text-right font-medium" style={{ color: '#7dd3fc' }}>£{role.upperQuartile.toLocaleString()}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex justify-center">
                        <span
                          className={cn(
                            "px-2.5 py-1 rounded-full text-xs font-semibold text-white whitespace-nowrap",
                            positionColors[pos.position]
                          )}
                        >
                          {pos.label}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap gap-5 justify-center px-6 py-4 border-t border-slate-700/40">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/90" />
            <span className="text-xs text-slate-400">Below LQ</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/90" />
            <span className="text-xs text-slate-400">LQ to Median</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-teal-500/90" />
            <span className="text-xs text-slate-400">Median to UQ</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-sky-500/90" />
            <span className="text-xs text-slate-400">Above UQ</span>
          </div>
        </div>
      </div>

      <QuartilesExplained />
    </div>
  );
}
