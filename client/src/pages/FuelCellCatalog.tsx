import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FuelCell3DViewer } from "@/components/FuelCell3DViewer";
import { 
  Fuel, Zap, Package, FileText, 
  ExternalLink, Battery, Box, Info,
  Search, ShieldCheck, CheckCircle2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { TelecomGreenEnergySilhouette } from "@/components/CinematicBackgrounds";
import { useSettings } from "@/contexts/SettingsContext";

const fuelCellCatalogText = {
  en: {
    pageTitle: "Product Catalog",
    pageSubtitle: "Explore verified fuel cell solutions for telecom and industrial power.",
    searchPlaceholder: "Search manufacturer or model...",
    solutions: "Solutions",
    models3D: "3D Models",
    datasheet: "Datasheet",
    features: "Features",
    type: "Type",
    power: "Power",
    efficiency: "Efficiency",
    voltage: "Voltage",
    fuel: "Fuel",
    needCustomSizing: "Need a custom sizing?",
    sizingToolDescription: "Use our Sizing Tool to calculate the exact power requirements for your specific site location and load profile.",
  },
  ar: {
    pageTitle: "كتالوج المنتجات",
    pageSubtitle: "استكشف حلول خلايا الوقود المُتحقق منها للاتصالات والطاقة الصناعية.",
    searchPlaceholder: "البحث بالشركة المصنعة أو الموديل...",
    solutions: "الحلول",
    models3D: "النماذج ثلاثية الأبعاد",
    datasheet: "ورقة البيانات",
    features: "الميزات",
    type: "النوع",
    power: "الطاقة",
    efficiency: "الكفاءة",
    voltage: "الجهد",
    fuel: "الوقود",
    needCustomSizing: "هل تحتاج إلى تحجيم مخصص؟",
    sizingToolDescription: "استخدم أداة التحجيم الخاصة بنا لحساب متطلبات الطاقة الدقيقة لموقعك المحدد وملف الحمل.",
  }
};

const fuelCellProducts = [
  {
    id: "ballard-electragen",
    manufacturer: "Ballard Power Systems",
    model: "ElectraGen-H2",
    type: "PEM Hydrogen",
    power: "5-10 kW",
    efficiency: "55%",
    voltage: "48V DC",
    fuel: "Hydrogen",
    features: ["Zero Emission", "Cold Weather Kit", "Compact Design"],
    datasheet: "https://www.ballard.com/markets/critical-infrastructure",
    color: "bg-blue-500"
  },
  {
    id: "plug-gensure",
    manufacturer: "Plug Power",
    model: "GenSure",
    type: "PEM Hydrogen",
    power: "5-10 kW",
    efficiency: "53%",
    voltage: "48V DC",
    fuel: "Hydrogen",
    features: ["7,600+ Deployed", "Predictive Maintenance", "Fast Refueling"],
    datasheet: "https://www.plugpower.com/applications/stationary-power/telecom/",
    color: "bg-green-500"
  },
  {
    id: "sfc-efoy",
    manufacturer: "SFC Energy",
    model: "EFOY Pro 12000",
    type: "Methanol",
    power: "0.5 kW",
    efficiency: "45%",
    voltage: "24V DC",
    fuel: "Methanol",
    features: ["Quiet Operation", "No H2 Needed", "Ultra-Portable"],
    datasheet: "https://www.sfc.com/en/products/efoy-pro/",
    color: "bg-orange-500"
  }
];

export default function FuelCellCatalog() {
  const [searchTerm, setSearchTerm] = useState("");
  const { language, isRTL } = useSettings();
  const txt = fuelCellCatalogText[language];

  const filteredProducts = fuelCellProducts.filter(p => 
    p.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex relative overflow-hidden" dir={isRTL ? "rtl" : "ltr"}>
      <TelecomGreenEnergySilhouette />
      <Sidebar />
      <main className={`flex-1 p-4 sm:p-6 lg:p-8 ${isRTL ? "lg:mr-20" : "lg:ml-20"} relative z-10`}>
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <Package className="w-8 h-8 text-primary" />
            {txt.pageTitle}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            {txt.pageSubtitle}
          </p>
        </header>

        <div className="relative mb-8 max-w-md">
          <Search className={`absolute ${isRTL ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400`} />
          <Input 
            placeholder={txt.searchPlaceholder}
            className={isRTL ? "pr-10" : "pl-10"}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Tabs defaultValue="list" className="space-y-6">
          <TabsList>
            <TabsTrigger value="list" className="gap-2"><Fuel className="w-4 h-4" /> {txt.solutions}</TabsTrigger>
            <TabsTrigger value="3d" className="gap-2"><Box className="w-4 h-4" /> {txt.models3D}</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div className={`w-10 h-10 ${product.color} rounded-lg flex items-center justify-center text-white`}>
                      <Zap className="w-5 h-5" />
                    </div>
                    <Badge variant="secondary">{product.power}</Badge>
                  </div>
                  <CardTitle className="mt-4">{product.model}</CardTitle>
                  <CardDescription>{product.manufacturer}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Battery className="w-4 h-4" /> {product.voltage}
                    </div>
                    <div className="flex items-center gap-2 text-slate-500">
                      <Fuel className="w-4 h-4" /> {product.fuel}
                    </div>
                  </div>
                  <div className="space-y-2">
                    {product.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" /> {feature}
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="bg-slate-50 dark:bg-slate-800/50 p-4">
                  <Button variant="outline" className="w-full gap-2" asChild>
                    <a href={product.datasheet} target="_blank" rel="noreferrer">
                      <FileText className="w-4 h-4" /> {txt.datasheet}
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="3d">
            <FuelCell3DViewer />
          </TabsContent>
        </Tabs>

        <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-800 flex items-start gap-4">
          <Info className="w-5 h-5 text-blue-500 mt-0.5" />
          <div>
            <h4 className="font-bold text-blue-900 dark:text-blue-100">{txt.needCustomSizing}</h4>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              {txt.sizingToolDescription}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
