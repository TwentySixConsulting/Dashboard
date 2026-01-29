import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  FileText,
  TrendingUp,
  Building2,
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
} from "lucide-react";
import logoImage from "@/assets/twentysix-logo.png";

const navItems = [
  { path: "/", label: "Dashboard", icon: Home },
  { path: "/market-context", label: "Market Context", icon: TrendingUp },
  { path: "/sector-insight", label: "Sector Insight", icon: Building2 },
  { path: "/market-data", label: "Market Data Results", icon: BarChart3 },
  { path: "/role-details", label: "Role-by-Role Detail", icon: Users },
  { path: "/risks", label: "Strengths & Risks", icon: AlertTriangle },
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
      {/* Sidebar */}
      <aside className="w-72 bg-sidebar text-sidebar-foreground fixed h-screen overflow-y-auto">
        <div className="p-5 border-b border-sidebar-border">
          <img 
            src={logoImage} 
            alt="TwentySix" 
            className="h-10 w-auto brightness-0 invert"
            style={{ opacity: 1 }}
          />
        </div>

        <div className="p-4">
          <p className="text-xs uppercase tracking-wider text-sidebar-foreground/40 mb-3 px-3">
            Dashboard Sections
          </p>
          <nav className="space-y-0.5">
            {navItems.map((item) => {
              const isActive = location === item.path;
              return (
                <Link key={item.path} href={item.path}>
                  <div
                    data-testid={`nav-${item.path.replace("/", "") || "home"}`}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer group",
                      isActive
                        ? "bg-sidebar-primary text-white"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                    )}
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
                    <span className="text-sm font-medium flex-1 leading-tight">{item.label}</span>
                    <ChevronRight
                      className={cn(
                        "w-4 h-4 opacity-0 transition-all shrink-0",
                        isActive ? "opacity-100" : "group-hover:opacity-50"
                      )}
                    />
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border bg-sidebar">
          <div className="bg-sidebar-accent/50 rounded-lg p-4">
            <p className="text-xs text-sidebar-foreground/60 mb-1">Prepared for</p>
            <p className="font-semibold text-sm">Saffron Housing</p>
            <p className="text-xs text-sidebar-foreground/60 mt-1">January 2026</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72">
        {/* Top Navigation Bar */}
        <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-8 py-3">
          <nav className="flex items-center gap-1">
            <Link href="/">
              <span className={cn(
                "px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer",
                location === "/" ? "bg-primary text-white" : "text-slate-600 hover:bg-slate-100"
              )}>
                Dashboard
              </span>
            </Link>
            {topNavItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <span className={cn(
                  "px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer",
                  location === item.path ? "bg-primary text-white" : "text-slate-600 hover:bg-slate-100"
                )}>
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="min-h-screen p-8 lg:p-12">
          {children}
        </div>
      </main>
    </div>
  );
}
