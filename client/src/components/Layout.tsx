import { useEffect } from "react";
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
  LogOut,
} from "lucide-react";
import logoImage from "@/assets/zigbert-logo.png";
import { logout } from "@/lib/auth";
import { useAuth } from "@/hooks/useAuth";

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
  const { user } = useAuth();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const handleLogout = async () => {
    await logout();
    window.location.reload();
  };

  return (
    <div className="flex min-h-screen">
      <aside className="w-[270px] bg-sidebar text-sidebar-foreground fixed h-screen flex flex-col">
        <div className="px-6 pt-7 pb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-[13px] font-bold text-sidebar-foreground/90 tracking-tight leading-none">Pay & Benefits</p>
              <p className="text-[10px] text-sidebar-foreground/40 mt-0.5">Dashboard</p>
            </div>
          </div>
        </div>

        <div className="px-3 flex-1 overflow-y-auto">
          <p className="text-[9px] uppercase tracking-[0.2em] text-sidebar-foreground/30 mb-2 px-3 font-semibold">
            Sections
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
                      "flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 cursor-pointer group",
                      isActive
                        ? "bg-gradient-to-r from-sidebar-primary/90 to-sidebar-primary text-white shadow-md shadow-sidebar-primary/25"
                        : "text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-sidebar-foreground/80"
                    )}
                  >
                    <IconComponent className={cn("w-[15px] h-[15px] shrink-0", isActive && "drop-shadow-sm")} />
                    <span className="text-[13px] font-medium flex-1 leading-tight">{item.label}</span>
                    <ChevronRight
                      className={cn(
                        "w-3 h-3 opacity-0 transition-all shrink-0",
                        isActive ? "opacity-80" : "group-hover:opacity-30"
                      )}
                    />
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 space-y-3 shrink-0 border-t border-sidebar-border/20">
          <div className="bg-gradient-to-br from-sidebar-accent/80 to-sidebar-accent/40 rounded-xl p-4 border border-sidebar-border/30">
            <p className="text-[9px] uppercase tracking-[0.2em] text-sidebar-foreground/30 mb-1.5 font-semibold">Prepared for</p>
            <p className="font-bold text-[13px] text-sidebar-foreground/90">{user?.organisationName || "Brighton Demo"}</p>
            <p className="text-[11px] text-sidebar-foreground/40 mt-1">Q1: March 2026</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-4 py-3 rounded-xl bg-sidebar-accent/50 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-all text-[13px] font-medium"
            data-testid="button-logout"
          >
            <LogOut className="w-4 h-4" />
            Log out
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-[270px]">
        <div className="sticky top-0 z-10 bg-white/70 backdrop-blur-2xl border-b border-slate-100">
          <div className="px-8 py-2.5">
            <nav className="flex items-center justify-between">
              <div className="flex items-center gap-0.5">
                <Link href="/">
                  <span className={cn(
                    "px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-200 cursor-pointer",
                    location === "/" ? "bg-primary text-white shadow-sm shadow-primary/20" : "text-slate-400 hover:text-slate-700 hover:bg-slate-50"
                  )}>
                    Dashboard
                  </span>
                </Link>
                {topNavItems.map((item) => (
                  <Link key={item.path} href={item.path}>
                    <span className={cn(
                      "px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-200 cursor-pointer",
                      location === item.path ? "bg-primary text-white shadow-sm shadow-primary/20" : "text-slate-400 hover:text-slate-700 hover:bg-slate-50"
                    )}>
                      {item.label}
                    </span>
                  </Link>
                ))}
              </div>

              <img
                src={logoImage}
                alt="Zigbert"
                className="h-9 w-auto opacity-70 hover:opacity-100 transition-opacity"
              />
            </nav>
          </div>
        </div>

        <div className="min-h-screen p-8 lg:p-12 pb-24 dot-grid-bg">
          {children}
        </div>
      </main>
    </div>
  );
}
