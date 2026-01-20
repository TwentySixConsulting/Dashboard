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
} from "lucide-react";

const navItems = [
  { path: "/", label: "Executive Summary", icon: FileText },
  { path: "/market-overview", label: "Market Overview", icon: TrendingUp },
  { path: "/sector-insight", label: "Sector Insight", icon: Building2 },
  { path: "/market-data", label: "Market Data Results", icon: BarChart3 },
  { path: "/role-details", label: "Role Details", icon: Users },
  { path: "/risks", label: "Strengths & Risks", icon: AlertTriangle },
  { path: "/benefits", label: "Benefits Overview", icon: Gift },
  { path: "/next-steps", label: "Next Steps", icon: ArrowRight },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="flex min-h-screen">
      <aside className="w-72 bg-sidebar text-sidebar-foreground fixed h-screen overflow-y-auto">
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-sidebar-primary flex items-center justify-center">
              <span className="text-white font-bold text-lg">26</span>
            </div>
            <div>
              <h1 className="font-display font-bold text-lg">TwentySix</h1>
              <p className="text-xs text-sidebar-foreground/60">Reward Consultancy</p>
            </div>
          </div>
        </div>

        <div className="p-4">
          <p className="text-xs uppercase tracking-wider text-sidebar-foreground/40 mb-3 px-3">
            Report Sections
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = location === item.path;
              return (
                <Link key={item.path} href={item.path}>
                  <div
                    data-testid={`nav-${item.path.replace("/", "") || "home"}`}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 cursor-pointer group",
                      isActive
                        ? "bg-sidebar-primary text-white"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="text-sm font-medium flex-1">{item.label}</span>
                    <ChevronRight
                      className={cn(
                        "w-4 h-4 opacity-0 transition-all",
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
          <div className="glass-card bg-sidebar-accent/50 rounded-lg p-4">
            <p className="text-xs text-sidebar-foreground/60 mb-1">Prepared for</p>
            <p className="font-semibold text-sm">Saffron Housing</p>
            <p className="text-xs text-sidebar-foreground/60 mt-1">January 2026</p>
          </div>
        </div>
      </aside>

      <main className="flex-1 ml-72">
        <div className="min-h-screen p-8 lg:p-12">
          {children}
        </div>
      </main>
    </div>
  );
}
