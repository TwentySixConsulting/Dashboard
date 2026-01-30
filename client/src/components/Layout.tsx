import { useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { usePageEditor } from "@/contexts/PageEditorContext";
import { GlobalEditToolbar } from "@/components/GlobalEditToolbar";
import { LoginModal } from "@/components/LoginModal";
import { AddNavButton } from "@/components/AddNavButton";
import { EditableText } from "@/components/EditableText";
import { isSupabaseConfigured } from "@/lib/supabase";
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
  Lock,
  Pencil,
  FileText,
  Star,
  Heart,
  Briefcase,
  Calendar,
  Clock,
  Globe,
  Mail,
  Phone,
  Shield,
  Zap,
  Target,
  Settings,
  GripVertical,
  Trash2,
} from "lucide-react";
import logoImage from "@/assets/twentysix-logo.png";

const iconMap: Record<string, any> = {
  Home, TrendingUp, BarChart3, Users, AlertTriangle, LineChart, Percent, Gift, Lightbulb, ArrowRight, Database,
  FileText, Star, Heart, Briefcase, Calendar, Clock, Globe, Mail, Phone, Shield, Zap, Target, Settings,
};

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
  const { user, isEditMode, setEditMode, trackChange, pendingChanges } = useAuth();
  const { addNavItem, navItems: customNavItems } = usePageEditor();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);

  const handleAddNav = (newNav: { path: string; label: string; icon: string }) => {
    addNavItem({
      path: newNav.path,
      label: newNav.label,
      icon: newNav.icon,
      visible: true,
    });
  };

  const allNavItems = [
    ...navItems.map((item, idx) => ({
      ...item,
      id: `static-${idx}`,
      order: idx,
      visible: true,
      iconName: item.icon.displayName || 'FileText',
    })),
    ...customNavItems.filter(c => c.visible).map(c => ({
      path: c.path,
      label: c.label,
      icon: iconMap[c.icon] || FileText,
      id: c.id,
      order: navItems.length + c.order,
      visible: c.visible,
      iconName: c.icon,
    }))
  ].sort((a, b) => a.order - b.order);

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
          {isEditMode ? (
            <EditableText
              contentKey="sidebar-section-label"
              defaultValue="Dashboard Sections"
              className="text-xs uppercase tracking-wider text-sidebar-foreground/40 mb-3 px-3 block"
              as="p"
              page="layout"
            />
          ) : (
            <p className="text-xs uppercase tracking-wider text-sidebar-foreground/40 mb-3 px-3">
              Dashboard Sections
            </p>
          )}
          <nav className="space-y-0.5">
            {allNavItems.map((item) => {
              const isActive = location === item.path;
              const navKey = `nav-label-${item.path.replace("/", "") || "home"}`;
              const hasChange = pendingChanges.has(navKey);
              const IconComponent = item.icon;
              return (
                <div
                  key={item.id}
                  className="relative group/nav"
                  onMouseEnter={() => setHoveredNav(item.path)}
                  onMouseLeave={() => setHoveredNav(null)}
                >
                  {isEditMode && hoveredNav === item.path && (
                    <div className="absolute -left-6 top-1/2 -translate-y-1/2">
                      <GripVertical className="w-4 h-4 text-sidebar-foreground/30 cursor-grab" />
                    </div>
                  )}
                  <Link href={item.path}>
                    <div
                      data-testid={`nav-${item.path.replace("/", "") || "home"}`}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer group",
                        isActive
                          ? "bg-sidebar-primary text-white"
                          : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                        hasChange && "ring-1 ring-amber-400"
                      )}
                    >
                      <IconComponent className="w-4 h-4 shrink-0" />
                      {isEditMode ? (
                        <EditableText
                          contentKey={navKey}
                          defaultValue={item.label}
                          className="text-sm font-medium flex-1 leading-tight"
                          as="span"
                          page="layout"
                        />
                      ) : (
                        <span className="text-sm font-medium flex-1 leading-tight">{item.label}</span>
                      )}
                      <ChevronRight
                        className={cn(
                          "w-4 h-4 opacity-0 transition-all shrink-0",
                          isActive ? "opacity-100" : "group-hover:opacity-50"
                        )}
                      />
                    </div>
                  </Link>
                </div>
              );
            })}
            
            {isEditMode && (
              <div className="pt-2">
                <AddNavButton onAddNav={handleAddNav} />
              </div>
            )}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border bg-sidebar">
          <div className="bg-sidebar-accent/50 rounded-lg p-4 mb-3">
            {isEditMode ? (
              <>
                <EditableText
                  contentKey="sidebar-prepared-label"
                  defaultValue="Prepared for"
                  className="text-xs text-sidebar-foreground/60 mb-1 block"
                  as="p"
                  page="layout"
                />
                <EditableText
                  contentKey="sidebar-client-name"
                  defaultValue="Saffron Housing"
                  className="font-semibold text-sm block"
                  as="p"
                  page="layout"
                />
                <EditableText
                  contentKey="sidebar-date"
                  defaultValue="January 2026"
                  className="text-xs text-sidebar-foreground/60 mt-1 block"
                  as="p"
                  page="layout"
                />
              </>
            ) : (
              <>
                <p className="text-xs text-sidebar-foreground/60 mb-1">Prepared for</p>
                <p className="font-semibold text-sm">Saffron Housing</p>
                <p className="text-xs text-sidebar-foreground/60 mt-1">January 2026</p>
              </>
            )}
          </div>
          
          <div className="pt-2 border-t border-sidebar-border">
            {!user ? (
              <button
                onClick={() => setShowLoginModal(true)}
                className="flex items-center gap-2 text-xs text-sidebar-foreground/50 hover:text-sidebar-foreground/80 transition-colors w-full px-2 py-1"
                data-testid="button-edit-as-admin"
              >
                <Lock className="w-3 h-3" />
                <span>Edit as Admin</span>
              </button>
            ) : !isEditMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center gap-2 text-xs text-indigo-400 hover:text-indigo-300 transition-colors w-full px-2 py-1"
                data-testid="button-enter-edit-mode"
              >
                <Pencil className="w-3 h-3" />
                <span>Enter Edit Mode</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 text-xs text-green-400 px-2 py-1">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span>Edit Mode Active</span>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72">
        {/* Edit Mode Banner */}
        {isEditMode && (
          <div className="bg-indigo-600 text-white px-8 py-2 text-sm">
            <div className="flex items-center gap-2">
              <Pencil className="w-4 h-4" />
              <span className="font-medium">Edit Mode Active</span>
              <span className="text-indigo-200">— Click on any text to edit it, drag cards to reorder</span>
            </div>
          </div>
        )}

        {/* Top Navigation Bar */}
        <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-8 py-3">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-1">
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
            </div>
            
            <div>
              {!user ? (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
                  data-testid="button-edit-as-admin"
                >
                  <Lock className="w-4 h-4" />
                  <span>Edit as Admin</span>
                </button>
              ) : !isEditMode ? (
                <button
                  onClick={() => setEditMode(true)}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                  data-testid="button-enter-edit-mode"
                >
                  <Pencil className="w-4 h-4" />
                  <span>Enter Edit Mode</span>
                </button>
              ) : (
                <div className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-green-600">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span>Edit Mode Active</span>
                </div>
              )}
            </div>
          </nav>
        </div>

        <div className="min-h-screen p-8 lg:p-12 pb-24">
          {children}
        </div>
      </main>

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      <GlobalEditToolbar />
    </div>
  );
}
