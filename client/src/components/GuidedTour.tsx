import { useState, useEffect } from "react";
import Joyride, { CallBackProps, STATUS, Step } from "react-joyride";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, Play } from "lucide-react";

const TOUR_STORAGE_KEY = "fcpms_tour_completed";
const PAGE_TOUR_KEYS: Record<string, string> = {
  main: "fcpms_tour_main",
  sizing: "fcpms_tour_sizing",
  optimizer: "fcpms_tour_optimizer",
  catalog: "fcpms_tour_catalog",
  monitoring: "fcpms_tour_monitoring",
};

const tourSteps: Step[] = [
  {
    target: "body",
    content: "Welcome to FCPMS - Fuel Cell Power Management System! This tool helps you design, compare, and optimize power systems for telecom sites. Let me show you the key features.",
    placement: "center",
    disableBeacon: true,
  },
  {
    target: '[data-testid="nav-dashboard"]',
    content: "The Learning Hub is your starting point. It provides educational content about fuel cell technology, telecom trends, industry analytics, and access to your saved projects.",
    placement: "right",
  },
  {
    target: '[data-testid="nav-sizing"]',
    content: "The Sizing Tool is the core feature. Design complete power systems by comparing diesel generators vs fuel cells, calculate battery requirements, hydrogen consumption, and generate reports.",
    placement: "right",
  },
  {
    target: '[data-testid="nav-optimizer"]',
    content: "The Asset Optimizer evaluates your existing diesel generators. It detects wet stacking issues, calculates wasted fuel, and recommends whether to Keep, Relocate, Replace, or Hybridize each unit.",
    placement: "right",
  },
  {
    target: '[data-testid="nav-catalog"]',
    content: "The Equipment Catalog contains fuel cell models from leading manufacturers like Ballard, Plug Power, Bloom Energy, and SFC. Compare specifications and add new models.",
    placement: "right",
  },
  {
    target: "body",
    content: "Ready to start? Click the help button anytime to replay this tour. Begin by exploring the Learning Hub or jump straight into the Sizing Tool!",
    placement: "center",
  },
];

const sizingTourSteps: Step[] = [
  {
    target: "body",
    content: "Welcome to the Sizing Tool! This is where you design complete fuel cell power systems. Let's walk through the process step by step.",
    placement: "center",
    disableBeacon: true,
  },
  {
    target: '[data-testid="input-project-name"]',
    content: "Start by naming your project. Use a descriptive name like 'Site Alpha - Remote Tower' to easily identify it later.",
    placement: "right",
  },
  {
    target: '[data-testid="slider-load"]',
    content: "Set your critical load requirement in kilowatts (kW). This is the continuous power your telecom equipment needs. Typical values range from 2-20 kW.",
    placement: "right",
  },
  {
    target: '[data-testid="slider-autonomy"]',
    content: "Define your backup autonomy in hours. This determines how long the system runs without grid power. 8-24 hours is common for telecom sites.",
    placement: "right",
  },
  {
    target: '[data-testid="select-voltage"]',
    content: "Select your DC system voltage. 48V is standard for telecom, but 24V is used for smaller sites.",
    placement: "right",
  },
  {
    target: '[data-testid="select-fuel-cell"]',
    content: "Choose a fuel cell from the catalog. The system will calculate if the selected model can handle your load. Match power capacity to your requirements.",
    placement: "right",
  },
  {
    target: '[data-testid="input-dg-capacity"]',
    content: "Enter your existing diesel generator's capacity in kVA. This enables side-by-side comparison of operational costs and emissions.",
    placement: "right",
  },
  {
    target: '[data-testid="input-diesel-price"]',
    content: "Set the local diesel fuel price per liter. This affects the total cost of ownership comparison between diesel and fuel cell systems.",
    placement: "right",
  },
  {
    target: '[data-testid="button-calculate"]',
    content: "Click Calculate to run the full analysis. Results include DG vs FC comparison, sizing specifications, battery requirements, and financial projections.",
    placement: "top",
  },
  {
    target: '[data-testid="button-download-pdf"]',
    content: "After calculating, export a professional PDF report with all specifications and comparisons. Perfect for presentations and approvals.",
    placement: "top",
  },
  {
    target: '[data-testid="button-ai-analysis"]',
    content: "Get AI-powered insights! The consultant analyzes your system and provides engineering recommendations, manager emails, or action plans in English or Arabic.",
    placement: "top",
  },
];

const optimizerTourSteps: Step[] = [
  {
    target: "body",
    content: "Welcome to the Asset Optimizer! This tool analyzes your existing diesel generator fleet and provides actionable recommendations.",
    placement: "center",
    disableBeacon: true,
  },
  {
    target: '[data-testid="slider-dg-rating"]',
    content: "Enter your diesel generator's rated capacity in kVA. This is the nameplate rating from the manufacturer.",
    placement: "right",
  },
  {
    target: '[data-testid="slider-site-load"]',
    content: "Set the actual site load in kW. The load factor is calculated automatically - values below 30% indicate potential wet stacking issues.",
    placement: "right",
  },
  {
    target: '[data-testid="slider-dg-age"]',
    content: "Enter the generator's age in years. Older units (10+ years) typically have higher maintenance costs and lower efficiency.",
    placement: "right",
  },
  {
    target: '[data-testid="slider-runtime"]',
    content: "Specify annual runtime hours. High runtime (>4000 hrs/year) increases wear and makes replacement more attractive.",
    placement: "right",
  },
  {
    target: '[data-testid="slider-fuel-cost"]',
    content: "Enter monthly fuel costs. The system calculates yearly waste from inefficient operation due to undersized loads.",
    placement: "right",
  },
  {
    target: '[data-testid="button-analyze"]',
    content: "Click Analyze to get a recommendation. The system evaluates all factors and suggests: Keep (maintain current), Relocate (move to higher-load site), Replace (with fuel cell), or Hybridize (add fuel cell backup).",
    placement: "top",
  },
];

const catalogTourSteps: Step[] = [
  {
    target: "body",
    content: "Welcome to the Equipment Catalog! Browse and manage fuel cell models from leading manufacturers worldwide.",
    placement: "center",
    disableBeacon: true,
  },
  {
    target: '[data-testid="button-add-fuel-cell"]',
    content: "Add new fuel cell models to expand your catalog. Enter manufacturer details, power ratings, efficiency, and costs.",
    placement: "bottom",
  },
  {
    target: '[data-testid="input-search-catalog"]',
    content: "Search the catalog by manufacturer name or model number to quickly find specific equipment.",
    placement: "bottom",
  },
];

const monitoringTourSteps: Step[] = [
  {
    target: "body",
    content: "Welcome to Remote Monitoring! Learn how to integrate fuel cell systems with your existing telecom monitoring infrastructure.",
    placement: "center",
    disableBeacon: true,
  },
  {
    target: '[data-testid="section-integration-options"]',
    content: "Explore different integration options including cloud platforms (NetCo), industrial controllers (DSE), SNMP for telecom NOC, and IoT gateways for remote sites.",
    placement: "bottom",
  },
  {
    target: '[data-testid="section-solutions"]',
    content: "Our complete solutions include turnkey monitoring packages, system integration services, analytics platforms, and 24/7 alert response services.",
    placement: "top",
  },
];

interface GuidedTourProps {
  page?: "main" | "sizing" | "optimizer" | "catalog" | "monitoring";
  autoStart?: boolean;
}

export function GuidedTour({ page = "main", autoStart = false }: GuidedTourProps) {
  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [showPulse, setShowPulse] = useState(false);

  const steps = page === "sizing" ? sizingTourSteps : 
                page === "optimizer" ? optimizerTourSteps : 
                page === "catalog" ? catalogTourSteps :
                page === "monitoring" ? monitoringTourSteps :
                tourSteps;

  const pageTourKey = PAGE_TOUR_KEYS[page] || TOUR_STORAGE_KEY;

  useEffect(() => {
    const hasCompletedPageTour = localStorage.getItem(pageTourKey);
    if (!hasCompletedPageTour) {
      setShowPulse(true);
      if (autoStart) {
        setTimeout(() => setRun(true), 800);
      }
    }
  }, [autoStart, pageTourKey]);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, index, type } = data;
    
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setRun(false);
      setStepIndex(0);
      setShowPulse(false);
      localStorage.setItem(pageTourKey, "true");
      if (page === "main") {
        localStorage.setItem(TOUR_STORAGE_KEY, "true");
      }
    } else if (type === "step:after") {
      setStepIndex(index + 1);
    }
  };

  const startTour = () => {
    setStepIndex(0);
    setRun(true);
    setShowPulse(false);
  };

  return (
    <>
      <div className="relative">
        <Button
          variant="outline"
          size="sm"
          onClick={startTour}
          title="Start guided tour"
          data-testid="button-start-tour"
          className={`gap-2 ${showPulse ? 'ring-2 ring-primary ring-offset-2 animate-pulse' : ''}`}
        >
          {showPulse ? <Play className="h-4 w-4" /> : <HelpCircle className="h-4 w-4" />}
          <span className="hidden sm:inline">{showPulse ? 'Take Tour' : 'Help'}</span>
        </Button>
        {showPulse && (
          <Badge 
            variant="default" 
            className="absolute -top-2 -right-2 text-xs px-1.5 py-0.5 animate-bounce"
          >
            New
          </Badge>
        )}
      </div>

      <Joyride
        steps={steps}
        run={run}
        stepIndex={stepIndex}
        continuous
        showProgress
        showSkipButton
        scrollToFirstStep
        disableScrolling={false}
        callback={handleJoyrideCallback}
        floaterProps={{
          disableAnimation: true,
        }}
        styles={{
          options: {
            primaryColor: "#2563eb",
            zIndex: 10000,
            arrowColor: "#fff",
            backgroundColor: "#fff",
            textColor: "#1e293b",
          },
          tooltip: {
            borderRadius: 12,
            padding: 20,
            boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
          },
          tooltipContainer: {
            textAlign: "left",
          },
          tooltipTitle: {
            fontSize: 16,
            fontWeight: 600,
          },
          tooltipContent: {
            fontSize: 14,
            lineHeight: 1.6,
          },
          buttonNext: {
            borderRadius: 8,
            padding: "8px 16px",
            fontWeight: 500,
          },
          buttonBack: {
            borderRadius: 8,
            marginRight: 8,
          },
          buttonSkip: {
            borderRadius: 8,
            color: "#64748b",
          },
          spotlight: {
            borderRadius: 8,
          },
        }}
        locale={{
          back: "Back",
          close: "Close",
          last: "Get Started",
          next: "Next",
          skip: "Skip Tour",
        }}
      />
    </>
  );
}

export function resetTour() {
  localStorage.removeItem(TOUR_STORAGE_KEY);
}
