import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { useAuth } from "@/hooks/use-auth";
import NotFound from "@/pages/not-found";
import LandingPage from "@/pages/LandingPage";
import Dashboard from "@/pages/Dashboard";
import Blog from "@/pages/Blog";
import SizingTool from "@/pages/SizingTool";
import Catalog from "@/pages/Catalog";
import FuelCellCatalog from "@/pages/FuelCellCatalog";
import ProjectDetails from "@/pages/ProjectDetails";
import Settings from "@/pages/Settings";
import AssetOptimizer from "@/pages/AssetOptimizer";
import RemoteMonitoring from "@/pages/RemoteMonitoring";
import H2Strategy from "@/pages/H2Strategy";
import CaseStudies from "@/pages/CaseStudies";
import StrategicVision from "@/pages/StrategicVision";
import VisionArticle from "@/pages/VisionArticle";
import AdminApproval from "@/pages/AdminApproval";

function AppRoutes() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LandingPage />;
  }
  
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:id" component={Blog} />
      <Route path="/sizing" component={SizingTool} />
      <Route path="/case-studies" component={CaseStudies} />
      <Route path="/optimizer" component={AssetOptimizer} />
      <Route path="/catalog" component={Catalog} />
      <Route path="/fuel-cells" component={FuelCellCatalog} />
      <Route path="/monitoring" component={RemoteMonitoring} />
      <Route path="/remote-monitoring" component={RemoteMonitoring} />
      <Route path="/h2-strategy" component={H2Strategy} />
      <Route path="/projects/:id" component={ProjectDetails} />
      <Route path="/settings" component={Settings} />
      <Route path="/admin" component={AdminApproval} />
      <Route path="/strategic-vision" component={StrategicVision} />
      <Route path="/vision/:id" component={VisionArticle} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SettingsProvider>
          <Toaster />
          <AppRoutes />
        </SettingsProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
