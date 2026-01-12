import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Globe, Target, ArrowLeft, Info, Activity, 
  Map as MapIcon, Compass, Zap, Droplets, Shield
} from "lucide-react";
import { Link } from "wouter";
import { 
  ComposableMap, 
  Geographies, 
  Geography, 
  Marker,
  ZoomableGroup
} from "react-simple-maps";
import { TaharqaBarkalSilhouette } from "@/components/CinematicBackgrounds";
import { useSettings } from "@/contexts/SettingsContext";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const pageText = {
  en: {
    title: "Global H2 Strategy & Opportunity Map",
    subtitle: "IEA 2025 & IRENA Strategic Alignment Portfolio",
    liveIntel: "2025 Live Intelligence",
    mapTitle: "The Global Hydrogen Production Map",
    mapDesc: "Visualizing 1,200+ projects and strategic production hotspots identified by IEA Global Review.",
    mapEngine: "Map Engine: Live",
    openTracker: "Open Live IEA Tracker",
    legend: "Legend",
    productionHubs: "Production Hubs",
    targetMarkets: "Target Markets",
    sudanOpportunity: "Sudan Opportunity",
    sudanDesc: "Ranked by World Bank as top-tier GHI zone. Strategic proximity to Red Sea shipping lanes allows for localized consumption and future export scalability.",
    costTrajectory: "Cost Trajectory",
    costDesc: "IEA 2025 Review projects electrolyzer costs to drop by 45% by 2030, making green H2 cost-competitive with diesel in remote telecom deployments.",
    securityTitle: "Security & Sovereignty",
    securityDesc: "Local H2 production eliminates dependency on volatile global fuel markets, providing 99.999% energy availability for critical telecom infrastructure.",
  },
  ar: {
    title: "خريطة استراتيجية الهيدروجين العالمية والفرص",
    subtitle: "محفظة التوافق الاستراتيجي لوكالة الطاقة الدولية 2025 وإيرينا",
    liveIntel: "معلومات حية 2025",
    mapTitle: "خريطة إنتاج الهيدروجين العالمية",
    mapDesc: "تصور أكثر من 1,200 مشروع ومواقع إنتاج استراتيجية حددتها المراجعة العالمية لوكالة الطاقة الدولية.",
    mapEngine: "محرك الخريطة: مباشر",
    openTracker: "فتح متتبع وكالة الطاقة المباشر",
    legend: "دليل الألوان",
    productionHubs: "مراكز الإنتاج",
    targetMarkets: "الأسواق المستهدفة",
    sudanOpportunity: "فرصة السودان",
    sudanDesc: "مصنف من البنك الدولي كمنطقة GHI من الدرجة الأولى. القرب الاستراتيجي من ممرات الشحن في البحر الأحمر يسمح بالاستهلاك المحلي وقابلية التصدير المستقبلية.",
    costTrajectory: "مسار التكلفة",
    costDesc: "تتوقع مراجعة وكالة الطاقة الدولية 2025 انخفاض تكاليف المحلل الكهربائي بنسبة 45% بحلول 2030، مما يجعل الهيدروجين الأخضر منافساً للديزل في عمليات الاتصالات النائية.",
    securityTitle: "الأمن والسيادة",
    securityDesc: "يزيل إنتاج الهيدروجين المحلي الاعتماد على أسواق الوقود العالمية المتقلبة، مما يوفر توافر طاقة بنسبة 99.999% للبنية التحتية الحيوية للاتصالات.",
  },
};

const h2Hotspots = [
  { name: "NEOM Green Hydrogen", coordinates: [34.9, 28.5], power: "600 t/day H2", status: "Under Construction" },
  { name: "AM Green Ammonia", coordinates: [82.2, 16.9], power: "1 Mt/year Ammonia", status: "Under Construction" },
  { name: "Dutch Hydrogen Backbone", coordinates: [4.9, 52.3], power: "1200km Pipeline", status: "Active" },
  { name: "German Hydrogen Network", coordinates: [13.4, 52.5], power: "9040km Network", status: "FID Reached" },
  { name: "Sudan (Red Sea Hub)", coordinates: [37.2, 19.6], power: "2400 kWh/m² Solar", status: "Strategic Priority" },
  { name: "Atacama (Chile)", coordinates: [-69.1, -23.8], power: "Solar Export", status: "Pre-FID" },
  { name: "Pilbara (Australia)", coordinates: [118.6, -21.6], power: "Wind/Solar Mega-scale", status: "Early Stage" }
];

export default function H2Strategy() {
  const { settings } = useSettings();
  const language = settings.preferences.language;
  const txt = pageText[language];
  const isRTL = language === 'ar';

  return (
    <div className={`min-h-screen bg-[#1E293B] flex relative overflow-hidden text-slate-200`} dir={isRTL ? 'rtl' : 'ltr'}>
      <TaharqaBarkalSilhouette />
      <Sidebar />

      <main className="flex-1 overflow-y-auto lg:ml-20 relative z-10">
        <header className="p-10 border-b border-[#22C55E]/20 bg-[#1E293B]/80 backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800">
                  <ArrowLeft className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-black text-white flex items-center gap-3">
                  <Globe className="w-6 h-6 text-emerald-500" />
                  {txt.title}
                </h1>
                <p className="text-sm text-slate-400 font-medium">{txt.subtitle}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-3 py-1">
                {txt.liveIntel}
              </Badge>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto space-y-8">
          {/* World Map Section */}
          <Card className="bg-slate-900 border-slate-800 shadow-2xl overflow-hidden rounded-3xl">
            <CardHeader className="border-b border-slate-800/50 bg-slate-900/80 p-8">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl font-bold text-white mb-2">{txt.mapTitle}</CardTitle>
                  <CardDescription className="text-slate-400">
                    {txt.mapDesc}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-950 rounded-xl border border-slate-800">
                  <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{txt.mapEngine}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 relative">
              <div className="h-[600px] bg-slate-950 flex items-center justify-center">
                <ComposableMap projection="geoMercator" style={{ width: "100%", height: "100%" }}>
                  <ZoomableGroup zoom={1}>
                    <Geographies geography={geoUrl}>
                      {({ geographies }: { geographies: any[] }) =>
                        geographies.map((geo: any) => (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            fill="#1e293b"
                            stroke="#0f172a"
                            strokeWidth={0.5}
                            style={{
                              default: { outline: "none" },
                              hover: { fill: "#334155", outline: "none" },
                              pressed: { outline: "none" }
                            }}
                          />
                        ))
                      }
                    </Geographies>
                    {h2Hotspots.map(({ name, coordinates }) => (
                      <Marker key={name} coordinates={coordinates as [number, number]}>
                        <circle r={6} fill="#10b981" stroke="#064e3b" strokeWidth={2} className="animate-pulse cursor-pointer" />
                        <text
                          textAnchor="middle"
                          y={-15}
                          style={{ fontFamily: "Inter", fill: "#94a3b8", fontSize: "10px", fontWeight: "bold" }}
                        >
                          {name}
                        </text>
                      </Marker>
                    ))}
                  </ZoomableGroup>
                </ComposableMap>
                
                {/* Map Overlay Controls */}
                <div className="absolute bottom-8 right-8 space-y-3">
                  <Button 
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-xl shadow-emerald-900/20"
                    onClick={() => window.open("https://www.iea.org/data-and-statistics/data-tools/hydrogen-tracker", "_blank")}
                  >
                    <Activity className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {txt.openTracker}
                  </Button>
                  <div className="bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-slate-700 shadow-2xl">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">{txt.legend}</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                        <span className="text-xs text-slate-300">{txt.productionHubs}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-slate-700" />
                        <span className="text-xs text-slate-300">{txt.targetMarkets}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Opportunities Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-slate-900 border-slate-800 p-6 rounded-2xl hover:border-emerald-500/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Compass className="w-6 h-6 text-emerald-500" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{txt.sudanOpportunity}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {txt.sudanDesc}
              </p>
            </Card>
            
            <Card className="bg-slate-900 border-slate-800 p-6 rounded-2xl hover:border-emerald-500/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-emerald-500" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{txt.costTrajectory}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {txt.costDesc}
              </p>
            </Card>

            <Card className="bg-slate-900 border-slate-800 p-6 rounded-2xl hover:border-emerald-500/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6 text-emerald-500" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{txt.securityTitle}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {txt.securityDesc}
              </p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
