import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { marketData, getPositioning } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Download } from "lucide-react";
import logoImage from "@/assets/twentysix-logo.png";

export function Benchmarking() {
  const positionColors: Record<string, string> = {
    below: "bg-red-500",
    lower: "bg-amber-500",
    lowerMid: "bg-yellow-500",
    median: "bg-green-500",
    upperMid: "bg-teal-500",
    upper: "bg-accent",
    above: "bg-purple-500",
  };

  const downloadCSV = () => {
    const headers = ["Role", "Function", "Current Salary", "Lower Quartile", "Lower-Mid", "Median", "Upper-Mid", "Upper Quartile", "Position"];
    const rows = marketData.map(role => {
      const pos = getPositioning(role.currentSalary, role.lowerQuartile, role.median, role.upperQuartile);
      return [
        role.role,
        role.function,
        role.currentSalary,
        role.lowerQuartile,
        role.lowerMid,
        role.median,
        role.upperMid,
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
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-sm font-medium text-accent uppercase tracking-wider mb-2">
            Salary Analysis
          </p>
          <h1 className="text-4xl lg:text-5xl font-display font-bold text-primary mb-4">
            Market Data Results
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Overview of all roles with market ranges.
          </p>
        </div>
        <img src={logoImage} alt="TwentySix" className="h-10 w-auto hidden lg:block" />
      </div>

      <Card className="p-6 bg-white border-0 shadow-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display font-bold text-xl">Summary of Market Data & Position</h3>
          <Button onClick={downloadCSV} variant="outline" className="gap-2" data-testid="button-download">
            <Download className="w-4 h-4" />
            Download CSV
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left py-4 px-3 font-semibold">Role</th>
                <th className="text-left py-4 px-3 font-semibold">Function</th>
                <th className="text-right py-4 px-3 font-semibold">Current</th>
                <th className="text-right py-4 px-3 font-semibold text-amber-600">LQ</th>
                <th className="text-right py-4 px-3 font-semibold text-yellow-600">L-Mid</th>
                <th className="text-right py-4 px-3 font-semibold text-green-600">Median</th>
                <th className="text-right py-4 px-3 font-semibold text-teal-600">U-Mid</th>
                <th className="text-right py-4 px-3 font-semibold text-blue-600">UQ</th>
                <th className="text-center py-4 px-3 font-semibold">Position</th>
              </tr>
            </thead>
            <tbody>
              {marketData.map((role, i) => {
                const pos = getPositioning(role.currentSalary, role.lowerQuartile, role.median, role.upperQuartile);
                return (
                  <tr 
                    key={role.id} 
                    className={cn(
                      "border-b transition-colors hover:bg-muted/20",
                      i % 2 === 0 ? "bg-white" : "bg-muted/10"
                    )}
                  >
                    <td className="py-3 px-3 font-medium">{role.role}</td>
                    <td className="py-3 px-3 text-muted-foreground">{role.function}</td>
                    <td className="py-3 px-3 text-right font-semibold text-primary">£{role.currentSalary.toLocaleString()}</td>
                    <td className="py-3 px-3 text-right text-muted-foreground">£{role.lowerQuartile.toLocaleString()}</td>
                    <td className="py-3 px-3 text-right text-muted-foreground">£{role.lowerMid.toLocaleString()}</td>
                    <td className="py-3 px-3 text-right text-muted-foreground">£{role.median.toLocaleString()}</td>
                    <td className="py-3 px-3 text-right text-muted-foreground">£{role.upperMid.toLocaleString()}</td>
                    <td className="py-3 px-3 text-right text-muted-foreground">£{role.upperQuartile.toLocaleString()}</td>
                    <td className="py-3 px-3">
                      <div className="flex justify-center">
                        <span
                          className={cn(
                            "px-2.5 py-1 rounded-full text-xs font-medium text-white whitespace-nowrap",
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
      </Card>

      <div className="flex flex-wrap gap-3 justify-center p-4 bg-white rounded-xl shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-sm text-muted-foreground">Below Market</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <span className="text-sm text-muted-foreground">Lower Quartile</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <span className="text-sm text-muted-foreground">Lower-Mid</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-sm text-muted-foreground">At Median</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-teal-500" />
          <span className="text-sm text-muted-foreground">Upper-Mid</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-accent" />
          <span className="text-sm text-muted-foreground">Upper Quartile</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-500" />
          <span className="text-sm text-muted-foreground">Above Market</span>
        </div>
      </div>
    </div>
  );
}
