import { useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/Layout";
import { ExecutiveSummary } from "@/pages/ExecutiveSummary";
import { MarketOverview } from "@/pages/MarketOverview";
import { Benchmarking } from "@/pages/Benchmarking";
import { RoleDetails } from "@/pages/RoleDetails";
import { MarketComparison } from "@/pages/MarketComparison";
import { Benefits } from "@/pages/Benefits";
import { BenefitsTrends } from "@/pages/BenefitsTrends";
import { Bonus } from "@/pages/Bonus";
import { NextSteps } from "@/pages/NextSteps";
import { DataSources } from "@/pages/DataSources";
import { Landing } from "@/pages/Landing";
import { Signup } from "@/pages/Signup";
import NotFound from "@/pages/not-found";
import { useAuth } from "@/hooks/useAuth";

function DashboardRouter() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={ExecutiveSummary} />
        <Route path="/market-data" component={Benchmarking} />
        <Route path="/role-details" component={RoleDetails} />
        <Route path="/market-comparison" component={MarketComparison} />
        <Route path="/market-context" component={MarketOverview} />
        <Route path="/bonus" component={Bonus} />
        <Route path="/benefits" component={Benefits} />
        <Route path="/benefits-trends" component={BenefitsTrends} />
        <Route path="/next-steps" component={NextSteps} />
        <Route path="/data-sources" component={DataSources} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function AuthGate() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [view, setView] = useState<"landing" | "signup">("landing");

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20 animate-pulse">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 20V10M12 20V4M6 20v-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="text-sm text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <DashboardRouter />;
  }

  if (view === "signup") {
    return (
      <Signup
        onComplete={() => window.location.reload()}
        onBack={() => setView("landing")}
      />
    );
  }

  return (
    <Landing
      onLogin={() => window.location.reload()}
      onStartToday={() => setView("signup")}
    />
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AuthGate />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
