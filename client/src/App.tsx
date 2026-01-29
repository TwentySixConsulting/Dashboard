import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { Layout } from "@/components/Layout";
import { ExecutiveSummary } from "@/pages/ExecutiveSummary";
import { MarketOverview } from "@/pages/MarketOverview";
import { Benchmarking } from "@/pages/Benchmarking";
import { RoleDetails } from "@/pages/RoleDetails";
import { Risks } from "@/pages/Risks";
import { MarketComparison } from "@/pages/MarketComparison";
import { Benefits } from "@/pages/Benefits";
import { BenefitsTrends } from "@/pages/BenefitsTrends";
import { Bonus } from "@/pages/Bonus";
import { NextSteps } from "@/pages/NextSteps";
import { DataSources } from "@/pages/DataSources";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={ExecutiveSummary} />
        <Route path="/market-data" component={Benchmarking} />
        <Route path="/role-details" component={RoleDetails} />
        <Route path="/risks" component={Risks} />
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

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
