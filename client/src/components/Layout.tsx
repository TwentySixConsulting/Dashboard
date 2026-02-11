import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  TrendingUp,
  Users,
  BarChart3,
  AlertTriangle,
  Gift,
  ArrowRight,
  ChevronRight,
  Lightbulb,
  Percent,
  Database,
  Home,
  LineChart,
} from "lucide-react";
import logoImage from "@/assets/twentysix-logo.png";

const navItems = [
  { path: "/", label: "Dashboard", icon: Home },
  { path: "/market-context", label: "Market Context", icon: TrendingUp },
  { path: "/market-data", label: "Market Data Results", icon: BarChart3 },
  { path: "/role-details", label: "Role-by-Role Detail", icon: Users },
  { path: "/risks", label: "Strengths & Risks", icon: AlertTriangle },
  { path: "/market-comparison", label: "Market Comparison", icon: LineChart },
  { path: "/bonus", label: "Bonus Potential", icon: Percent },
  { path: "/benefits", label: "Benefits", icon: Gift },
  { path: "/benefits-trends", label: "Benefits Trends & Ideas", icon: Lightbulb },
  { path: "/next-steps", label: "Next Steps", icon: ArrowRight },
  { path: "/data-sources", label: "Data Sources", icon: Database },
];

const topNavItems = [
  { path: "/market-data", label: "Market Data" },
  { path: "/role-details", label: "Role Details" },
  { path: "/risks", label: "Strengths & Risks" },
  { path: "/market-context", label: "Market Context" },
  { path: "/benefits", label: "Benefits" },
  { path: "/next-steps", label: "Next Steps" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="flex min-h-screen">
      <aside className="w-72 bg-sidebar text-sidebar-foreground fixed h-screen overflow-y-auto flex flex-col">
        <div className="p-5 border-b border-sidebar-border">
          <p className="text-sm font-semibold text-sidebar-foreground/80 tracking-wide uppercase">Pay & Benefits</p>
        </div>

        <div className="p-4 flex-1">
          <p className="text-[10px] uppercase tracking-[0.15em] text-sidebar-foreground/40 mb-3 px-3 font-medium">
            Dashboard Sections
          </p>
          <nav className="space-y-0.5">
            {navItems.map((item) => {
              const isActive = location === item.path;
              const IconComponent = item.icon;
              return (
                <Link key={item.path} href={item.path}>
                  <div
                    data-testid={`nav-${item.path.replace("/", "") || "home"}`}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 cursor-pointer group",
                      isActive
                        ? "bg-sidebar-primary text-white shadow-lg shadow-sidebar-primary/20"
                        : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                    )}
                  >
                    <IconComponent className={cn("w-4 h-4 shrink-0", isActive && "drop-shadow-sm")} />
                    <span className="text-sm font-medium flex-1 leading-tight">{item.label}</span>
                    <ChevronRight
                      className={cn(
                        "w-3.5 h-3.5 opacity-0 transition-all shrink-0",
                        isActive ? "opacity-100" : "group-hover:opacity-40"
                      )}
                    />
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-sidebar-border">
          <div className="bg-sidebar-accent/50 rounded-xl p-4">
            <p className="text-[10px] uppercase tracking-[0.15em] text-sidebar-foreground/40 mb-1 font-medium">Prepared for</p>
            <p className="font-semibold text-sm">Brighton Demo Technologies</p>
            <p className="text-xs text-sidebar-foreground/50 mt-1">2026: Quarter 1</p>
          </div>
        </div>
      </aside>

      <main className="flex-1 ml-72">
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-slate-200/80">
          <div className="px-8 py-3">
            <nav className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Link href="/">
                  <span className={cn(
                    "px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer",
                    location === "/" ? "bg-primary text-white shadow-sm" : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                  )}>
                    Dashboard
                  </span>
                </Link>
                {topNavItems.map((item) => (
                  <Link key={item.path} href={item.path}>
                    <span className={cn(
                      "px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer",
                      location === item.path ? "bg-primary text-white shadow-sm" : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                    )}>
                      {item.label}
                    </span>
                  </Link>
                ))}
              </div>

              <img
                src={logoImage}
                alt="TwentySix"
                className="h-8 w-auto"
              />
            </nav>
          </div>
        </div>

        <div className="min-h-screen p-8 lg:p-12 pb-24">
          {children}
        </div>
      </main>
    </div>
  );
}
