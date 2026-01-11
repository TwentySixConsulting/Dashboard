import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/Layout";
import { ExecutiveSummary } from "@/pages/ExecutiveSummary";
import { MarketOverview } from "@/pages/MarketOverview";
import { SectorInsight } from "@/pages/SectorInsight";
import { Benchmarking } from "@/pages/Benchmarking";
import { RoleDetails } from "@/pages/RoleDetails";
import { Risks } from "@/pages/Risks";
import { Benefits } from "@/pages/Benefits";
import { NextSteps } from "@/pages/NextSteps";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={ExecutiveSummary} />
        <Route path="/market-overview" component={MarketOverview} />
        <Route path="/sector-insight" component={SectorInsight} />
        <Route path="/benchmarking" component={Benchmarking} />
        <Route path="/role-details" component={RoleDetails} />
        <Route path="/risks" component={Risks} />
        <Route path="/benefits" component={Benefits} />
        <Route path="/next-steps" component={NextSteps} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
