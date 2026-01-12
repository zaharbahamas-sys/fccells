import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Zap, 
  Radio, 
  Server, 
  Fuel, 
  ExternalLink
} from "lucide-react";

export interface SiteTemplate {
  name: string;
  loadKw: number;
  description: string;
  autonomyHours: number;
  voltage: number;
  source: string;
  sourceUrl: string;
}

// Standard telecom site load profiles based on GSMA Tower Power Africa report
const siteTemplates: SiteTemplate[] = [
  { 
    name: "Micro BTS (Rural 2G)", 
    loadKw: 0.5, 
    description: "Rural off-grid 2G site (GSMA typical range: 0.3-0.8 kW)", 
    autonomyHours: 8, 
    voltage: 48,
    source: "GSMA Tower Power Africa",
    sourceUrl: "https://www.gsma.com/solutions-and-impact/connectivity-for-good/mobile-for-development/uncategorized/tower-power-africa-energy-challenges-and-opportunities/"
  },
  { 
    name: "Small Cell (Urban)", 
    loadKw: 1.5, 
    description: "Urban small cell (GSMA typical range: 1-2 kW)", 
    autonomyHours: 4, 
    voltage: 48,
    source: "GSMA Tower Power Africa",
    sourceUrl: "https://www.gsma.com/solutions-and-impact/connectivity-for-good/mobile-for-development/uncategorized/tower-power-africa-energy-challenges-and-opportunities/"
  },
  { 
    name: "Macro BTS 2G/3G", 
    loadKw: 3, 
    description: "Standard macro site (GSMA typical range: 2-4 kW)", 
    autonomyHours: 8, 
    voltage: 48,
    source: "GSMA Tower Power Africa",
    sourceUrl: "https://www.gsma.com/solutions-and-impact/connectivity-for-good/mobile-for-development/uncategorized/tower-power-africa-energy-challenges-and-opportunities/"
  },
  { 
    name: "Macro BTS 4G/LTE", 
    loadKw: 5, 
    description: "LTE macro with cooling (GSMA typical range: 4-7 kW)", 
    autonomyHours: 8, 
    voltage: 48,
    source: "GSMA Tower Power Africa",
    sourceUrl: "https://www.gsma.com/solutions-and-impact/connectivity-for-good/mobile-for-development/uncategorized/tower-power-africa-energy-challenges-and-opportunities/"
  },
];

const globalBenchmarks = {
  siteCount: {
    africa: 240000,
    global: 5200000,
    offGrid: 45000,
  },
  powerProfile: {
    avgSiteLoad: 4.2,
    peakFactor: 1.3,
    coolingPct: 35,
  },
  dieselStats: {
    avgConsumption: 2.5,
    avgRunHours: 12,
    maintenance: 0.15,
  }
};

interface TelecomReferenceProps {
  onApplyTemplate?: (template: SiteTemplate) => void;
}

export function TelecomReference({ onApplyTemplate }: TelecomReferenceProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Radio className="w-5 h-5" />
          Telecom Site Reference Data
        </CardTitle>
        <CardDescription>
          Industry benchmarks from GSMA Mobile for Development reports
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="templates" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="templates">
              <Server className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Site Types</span>
            </TabsTrigger>
            <TabsTrigger value="benchmarks">
              <Zap className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Benchmarks</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="space-y-3">
            <p className="text-sm text-muted-foreground mb-3">
              Standard telecom site load profiles from industry research and GSMA reports
            </p>
            <div className="grid gap-2">
              {siteTemplates.map((template) => (
                <div 
                  key={template.name}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800 hover:shadow-sm transition-shadow cursor-pointer group/item border border-slate-100 dark:border-slate-800"
                  onClick={() => onApplyTemplate?.(template)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{template.name}</p>
                      <p className="text-xs text-muted-foreground">{template.description}</p>
                      <a 
                        href={template.sourceUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-primary flex items-center gap-1 mt-1 hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="w-3 h-3" />
                        {template.source}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{template.loadKw} kW</Badge>
                    <Badge variant="outline">{template.autonomyHours}h</Badge>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="benchmarks" className="space-y-4">
            <p className="text-sm text-muted-foreground mb-3">
              Global telecom infrastructure statistics and power benchmarks
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800">
                <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                  <Radio className="w-4 h-4" />
                  Site Counts
                </h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Africa Sites</span>
                    <span className="font-mono">{globalBenchmarks.siteCount.africa.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Global Sites</span>
                    <span className="font-mono">{globalBenchmarks.siteCount.global.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Off-Grid (Africa)</span>
                    <span className="font-mono">{globalBenchmarks.siteCount.offGrid.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800">
                <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Power Profile
                </h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Avg Site Load</span>
                    <span className="font-mono">{globalBenchmarks.powerProfile.avgSiteLoad} kW</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Peak Factor</span>
                    <span className="font-mono">{globalBenchmarks.powerProfile.peakFactor}x</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cooling Load</span>
                    <span className="font-mono">{globalBenchmarks.powerProfile.coolingPct}%</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800">
                <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                  <Fuel className="w-4 h-4" />
                  Diesel Baseline
                </h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Avg L/h per kW</span>
                    <span className="font-mono">{globalBenchmarks.dieselStats.avgConsumption}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Avg Run Hours/Day</span>
                    <span className="font-mono">{globalBenchmarks.dieselStats.avgRunHours}h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Maintenance Cost</span>
                    <span className="font-mono">${globalBenchmarks.dieselStats.maintenance}/kWh</span>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800">
              <h4 className="font-medium text-sm mb-2">Industry References</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>
                  <a href="https://www.gsma.com/solutions-and-impact/connectivity-for-good/mobile-for-development/uncategorized/tower-power-africa-energy-challenges-and-opportunities/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    GSMA: Tower Power Africa
                  </a>
                </li>
                <li>
                  <a href="https://techblog.comsoc.org/2024/02/28/highlights-of-gsma-study-mobile-net-zero-2024-state-of-the-industry-on-climate-action/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    GSMA: Mobile Net Zero 2024
                  </a>
                </li>
                <li>
                  <a href="https://www.gsma.com/solutions-and-impact/connectivity-for-good/mobile-economy/wp-content/uploads/2025/02/030325-The-Mobile-Economy-2025.pdf" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    GSMA: The Mobile Economy 2025
                  </a>
                </li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export { siteTemplates, globalBenchmarks };
