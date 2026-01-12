import { Sidebar } from "@/components/Sidebar";
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { 
  RefreshCw, CheckCircle2, Truck, 
  Trash2, Zap, Battery, Gauge, Flame,
  ArrowRight, TrendingDown, Sun, Leaf, TreeDeciduous, Info, ChevronDown, ChevronUp
} from "lucide-react";
import { GuidedTour } from "@/components/GuidedTour";
import { TelecomGreenEnergySilhouette } from "@/components/CinematicBackgrounds";
import { useSettings } from "@/contexts/SettingsContext";

type RecommendationType = "relocate" | "replace" | "keep" | "support";

interface AnalysisResult {
  status: string;
  statusArabic: string;
  color: "red" | "green" | "orange";
  recommendation: RecommendationType;
  recommendationTitle: string;
  recommendationTitleArabic: string;
  actionPlan: string[];
  actionPlanArabic: string[];
}

const assetOptimizerText = {
  en: {
    pageTitle: "Smart Asset Optimizer",
    pageSubtitle: "Analyze generator efficiency and get recommendations: Keep - Relocate - Replace - Hybridize",
    currentSiteData: "Current Site Data",
    enterSpecs: "Enter your existing generator specifications",
    generatorCapacity: "Generator Capacity (kVA)",
    actualSiteLoad: "Actual Site Load (kW)",
    generatorAge: "Generator Age (Years)",
    loadFactor: "Load Factor",
    optimalRange: "Optimal range: 30-70%. Below 30% causes wet stacking.",
    analysisDecision: "Analysis & Decision",
    annualWaste: "Annual Waste Due to Misallocation",
    oversizedGenerator: "Using an oversized generator at this site causes unnecessary fuel burn:",
    currentUtilization: "Current Utilization",
    wastedCapacity: "The remaining {percent}% represents wasted capacity and fuel.",
    annualLoss: "Annual Loss",
    seeCalculation: "See Calculation Logic",
    calculationBreakdown: "Calculation Breakdown",
    inefficiency: "Inefficiency",
    inefficiencyDesc: "Current generator consumes ~{consumption} L/hr at {load}% load (High waste).",
    optimal: "Optimal",
    optimalDesc: "Right-sized solution would consume ~{consumption} L/hr.",
    totalWaste: "Total Waste",
    totalWasteDesc: "Difference of ~{hourly} L/hr x {annual} hours = ~{yearly} Liters/Year.",
    calculationNote: "Calculated based on delivered fuel price of ${base}/Liter + {penalty}% maintenance penalty = ${effective}/Liter effective cost.",
    environmentalImpact: "Environmental Impact",
    carbonFootprint: "Carbon footprint from wasted fuel due to generator inefficiency",
    unnecessaryCO2: "Unnecessary CO2 Emissions",
    treesRequired: "Trees Required to Offset",
    treesAbsorb: "Each tree absorbs ~{kg} kg CO2/year",
    switchingMessage: "Switching to fuel cells or solar hybrid would eliminate these emissions entirely, contributing to your sustainability goals and reducing environmental footprint.",
    relocateMessage: "This generator should leave this site immediately to save fuel and maintenance costs.",
    replaceMessage: "This generator has reached end-of-life. Continuing with it is a financial loss.",
    keepMessage: "Consider adding batteries to reduce runtime and extend generator life.",
    solarHybridTitle: "Strategic Alternative: Solar Hybrid System",
    solarHybridDesc: "Given the low load ({load} kW), replacing this generator with a Solar PV + Li-ion Battery solution is the most efficient strategy.",
    roi: "ROI: 18-24 Months",
    years: "years",
    kva: "kVA",
    kw: "kW",
    tons: "tons",
    litersPerLiter: "liters x {kg} kg/L",
    statusCritical: "CRITICAL UNDER-LOADING",
    statusHealthy: "HEALTHY RANGE",
    statusOverload: "OVERLOAD RISK",
    statusCriticalDesc: "Carbon Buildup / Wet Stacking",
    statusHealthyDesc: "Good Operating Zone",
    statusOverloadDesc: "High Load Warning",
    scrapReplace: "Scrap & Replace",
    relocateAsset: "Relocate Asset",
    keepHybridize: "Keep & Hybridize",
    addSupport: "Add Support",
    actionReplace1: "Generator is running at catastrophic efficiency, causing massive fuel waste.",
    actionReplace2: "Age ({years} years) exceeds 10 years - maintenance costs exceed value.",
    actionReplace3: "Decision: Full replacement with Fuel Cell system recommended.",
    actionRelocate1: "This generator is healthy but mismatched for this site.",
    actionRelocate2: "Decision: Relocate immediately to a Hub site with 10-15 kW load.",
    actionRelocate3: "Install a small fuel cell at this location instead.",
    actionKeep1: "Generator size is appropriate for the load.",
    actionKeep2: "To reduce running hours, add a battery system (Hybrid).",
    actionKeep3: "No fuel cell needed here currently (unless for environmental goals).",
    actionSupport1: "Generator is running at maximum capacity.",
    actionSupport2: "Any load increase will cause site failure.",
    actionSupport3: "Decision: Add fuel cell for parallel operation (Peak Shaving) or battery charging.",
  },
  ar: {
    pageTitle: "محسن الأصول الذكي",
    pageSubtitle: "تحليل كفاءة المولد والحصول على التوصيات: إبقاء - نقل - استبدال - تهجين",
    currentSiteData: "بيانات الموقع الحالي",
    enterSpecs: "أدخل مواصفات المولد الموجود لديك",
    generatorCapacity: "سعة المولد (كيلو فولت أمبير)",
    actualSiteLoad: "حمل الموقع الفعلي (كيلوواط)",
    generatorAge: "عمر المولد (سنوات)",
    loadFactor: "معامل الحمل",
    optimalRange: "النطاق الأمثل: 30-70%. أقل من 30% يسبب تراكم الكربون.",
    analysisDecision: "التحليل والقرار",
    annualWaste: "الهدر السنوي بسبب سوء التخصيص",
    oversizedGenerator: "استخدام مولد كبير الحجم في هذا الموقع يسبب حرق وقود غير ضروري:",
    currentUtilization: "الاستخدام الحالي",
    wastedCapacity: "النسبة المتبقية {percent}% تمثل سعة ووقود مهدر.",
    annualLoss: "الخسارة السنوية",
    seeCalculation: "عرض منطق الحساب",
    calculationBreakdown: "تفصيل الحساب",
    inefficiency: "عدم الكفاءة",
    inefficiencyDesc: "المولد الحالي يستهلك ~{consumption} لتر/ساعة عند حمل {load}% (هدر عالي).",
    optimal: "الأمثل",
    optimalDesc: "الحل المناسب سيستهلك ~{consumption} لتر/ساعة.",
    totalWaste: "إجمالي الهدر",
    totalWasteDesc: "الفرق ~{hourly} لتر/ساعة x {annual} ساعة = ~{yearly} لتر/سنة.",
    calculationNote: "محسوب بناءً على سعر الوقود المسلم ${base}/لتر + {penalty}% غرامة صيانة = ${effective}/لتر التكلفة الفعلية.",
    environmentalImpact: "الأثر البيئي",
    carbonFootprint: "البصمة الكربونية من الوقود المهدر بسبب عدم كفاءة المولد",
    unnecessaryCO2: "انبعاثات CO2 غير ضرورية",
    treesRequired: "الأشجار المطلوبة للتعويض",
    treesAbsorb: "كل شجرة تمتص ~{kg} كجم CO2/سنة",
    switchingMessage: "التحول إلى خلايا الوقود أو النظام الهجين الشمسي سيقضي على هذه الانبعاثات بالكامل، مما يساهم في أهداف الاستدامة وتقليل البصمة البيئية.",
    relocateMessage: "يجب أن يغادر هذا المولد هذا الموقع فوراً لتوفير تكاليف الوقود والصيانة.",
    replaceMessage: "وصل هذا المولد إلى نهاية عمره الافتراضي. الاستمرار به خسارة مالية.",
    keepMessage: "فكر في إضافة بطاريات لتقليل وقت التشغيل وإطالة عمر المولد.",
    solarHybridTitle: "البديل الاستراتيجي: نظام الطاقة الشمسية الهجين",
    solarHybridDesc: "نظراً للحمل المنخفض ({load} كيلوواط)، استبدال هذا المولد بنظام الطاقة الشمسية + بطارية ليثيوم أيون هو الاستراتيجية الأكثر كفاءة.",
    roi: "عائد الاستثمار: 18-24 شهر",
    years: "سنة",
    kva: "كيلو فولت أمبير",
    kw: "كيلوواط",
    tons: "طن",
    litersPerLiter: "لتر x {kg} كجم/لتر",
    statusCritical: "حمل منخفض حرج",
    statusHealthy: "نطاق صحي",
    statusOverload: "خطر الحمل الزائد",
    statusCriticalDesc: "تراكم الكربون / التكثيف الرطب",
    statusHealthyDesc: "منطقة تشغيل جيدة",
    statusOverloadDesc: "تحذير الحمل العالي",
    scrapReplace: "تخريد واستبدال",
    relocateAsset: "نقل الأصل",
    keepHybridize: "إبقاء وتهجين",
    addSupport: "إضافة دعم",
    actionReplace1: "المولد يعمل بكفاءة كارثية، مما يسبب هدراً هائلاً للوقود.",
    actionReplace2: "العمر ({years} سنة) يتجاوز 10 سنوات - تكاليف الصيانة تتجاوز القيمة.",
    actionReplace3: "القرار: يوصى بالاستبدال الكامل بنظام خلايا الوقود.",
    actionRelocate1: "هذا المولد سليم لكنه غير متوافق مع هذا الموقع.",
    actionRelocate2: "القرار: النقل فوراً إلى موقع محور بحمل 10-15 كيلوواط.",
    actionRelocate3: "تركيب خلية وقود صغيرة في هذا الموقع بدلاً منه.",
    actionKeep1: "حجم المولد مناسب للحمل.",
    actionKeep2: "لتقليل ساعات التشغيل، أضف نظام بطارية (هجين).",
    actionKeep3: "لا حاجة لخلية وقود حالياً (إلا للأهداف البيئية).",
    actionSupport1: "المولد يعمل بأقصى طاقته.",
    actionSupport2: "أي زيادة في الحمل ستسبب فشل الموقع.",
    actionSupport3: "القرار: إضافة خلية وقود للتشغيل المتوازي (تقليل الذروة) أو شحن البطارية.",
  }
};

export default function AssetOptimizer() {
  const { language, isRTL } = useSettings();
  const txt = assetOptimizerText[language];
  
  const [dgRatingKva, setDgRatingKva] = useState(20);
  const [siteLoadKw, setSiteLoadKw] = useState(3);
  const [dgAgeYears, setDgAgeYears] = useState(8);
  const [showCalculationBreakdown, setShowCalculationBreakdown] = useState(false);

  const analysis = useMemo<AnalysisResult>(() => {
    const dgRatingKw = dgRatingKva * 0.8;
    const loadFactor = (siteLoadKw / dgRatingKw) * 100;

    if (loadFactor < 30) {
      if (dgAgeYears > 10) {
        return {
          status: txt.statusCritical,
          statusArabic: txt.statusCriticalDesc,
          color: "red",
          recommendation: "replace",
          recommendationTitle: txt.scrapReplace,
          recommendationTitleArabic: assetOptimizerText.ar.scrapReplace,
          actionPlan: [
            txt.actionReplace1,
            txt.actionReplace2.replace("{years}", String(dgAgeYears)),
            txt.actionReplace3
          ],
          actionPlanArabic: [
            assetOptimizerText.ar.actionReplace1,
            assetOptimizerText.ar.actionReplace2.replace("{years}", String(dgAgeYears)),
            assetOptimizerText.ar.actionReplace3
          ]
        };
      } else {
        return {
          status: txt.statusCritical,
          statusArabic: txt.statusCriticalDesc,
          color: "red",
          recommendation: "relocate",
          recommendationTitle: txt.relocateAsset,
          recommendationTitleArabic: assetOptimizerText.ar.relocateAsset,
          actionPlan: [
            txt.actionRelocate1,
            txt.actionRelocate2,
            txt.actionRelocate3
          ],
          actionPlanArabic: [
            assetOptimizerText.ar.actionRelocate1,
            assetOptimizerText.ar.actionRelocate2,
            assetOptimizerText.ar.actionRelocate3
          ]
        };
      }
    } else if (loadFactor <= 70) {
      return {
        status: txt.statusHealthy,
        statusArabic: txt.statusHealthyDesc,
        color: "green",
        recommendation: "keep",
        recommendationTitle: txt.keepHybridize,
        recommendationTitleArabic: assetOptimizerText.ar.keepHybridize,
        actionPlan: [
          txt.actionKeep1,
          txt.actionKeep2,
          txt.actionKeep3
        ],
        actionPlanArabic: [
          assetOptimizerText.ar.actionKeep1,
          assetOptimizerText.ar.actionKeep2,
          assetOptimizerText.ar.actionKeep3
        ]
      };
    } else {
      return {
        status: txt.statusOverload,
        statusArabic: txt.statusOverloadDesc,
        color: "orange",
        recommendation: "support",
        recommendationTitle: txt.addSupport,
        recommendationTitleArabic: assetOptimizerText.ar.addSupport,
        actionPlan: [
          txt.actionSupport1,
          txt.actionSupport2,
          txt.actionSupport3
        ],
        actionPlanArabic: [
          assetOptimizerText.ar.actionSupport1,
          assetOptimizerText.ar.actionSupport2,
          assetOptimizerText.ar.actionSupport3
        ]
      };
    }
  }, [dgRatingKva, siteLoadKw, dgAgeYears, txt]);

  const dgRatingKw = dgRatingKva * 0.8;
  const loadFactor = Math.min(100, Math.round((siteLoadKw / dgRatingKw) * 100));
  
  const excessCapacity = Math.max(0, dgRatingKw - (siteLoadKw * 1.5));
  const wastedFuelHourly = excessCapacity * 0.06;
  const wastedMoneyYearly = Math.round(wastedFuelHourly * 24 * 365 * 1.2);

  const annualHours = 8760;
  const baseFuelPricePerLiter = 1.00;
  const maintenancePenaltyPct = 20;
  const effectiveCostPerLiter = baseFuelPricePerLiter * (1 + maintenancePenaltyPct / 100);
  
  const wastedLitersPerYear = Math.round(wastedFuelHourly * annualHours);
  
  const estimatedCurrentConsumption = (wastedFuelHourly + (siteLoadKw * 0.25)).toFixed(1);
  const estimatedOptimalConsumption = (siteLoadKw * 0.25).toFixed(1);
  
  const co2PerLiter = 2.68;
  const co2Emissions = wastedLitersPerYear * co2PerLiter;
  const co2Tons = co2Emissions / 1000;
  const treesPerKgCO2 = 22;
  const treesEquivalent = Math.round(co2Emissions / treesPerKgCO2);

  const getStatusBadge = () => {
    const variants: Record<string, "destructive" | "default" | "secondary"> = {
      red: "destructive",
      orange: "secondary",
      green: "default"
    };
    return variants[analysis.color] || "default";
  };

  const getRecommendationIcon = () => {
    const icons: Record<RecommendationType, JSX.Element> = {
      relocate: <Truck className="w-6 h-6" />,
      replace: <Trash2 className="w-6 h-6" />,
      keep: <CheckCircle2 className="w-6 h-6" />,
      support: <Zap className="w-6 h-6" />
    };
    return icons[analysis.recommendation];
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex relative overflow-hidden" dir={isRTL ? "rtl" : "ltr"}>
      <TelecomGreenEnergySilhouette />
      <Sidebar />
      <main className={`flex-1 p-4 sm:p-6 lg:p-8 ${isRTL ? 'lg:mr-20' : 'lg:ml-20'} relative z-10`}>
        <header className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <RefreshCw className="w-6 h-6 text-primary" />
              {txt.pageTitle}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              {txt.pageSubtitle}
            </p>
          </div>
          <GuidedTour page="optimizer" />
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gauge className="w-5 h-5" /> {txt.currentSiteData}
              </CardTitle>
              <CardDescription>{txt.enterSpecs}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium">{txt.generatorCapacity}</label>
                  <span className="text-sm font-mono text-primary">{dgRatingKva} {txt.kva}</span>
                </div>
                <Slider
                  min={5}
                  max={100}
                  step={1}
                  value={[dgRatingKva]}
                  onValueChange={v => setDgRatingKva(v[0])}
                  data-testid="slider-dg-rating"
                />
                <p className="text-xs text-muted-foreground mt-1">= {dgRatingKw.toFixed(1)} {txt.kw} @ 0.8 PF</p>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium">{txt.actualSiteLoad}</label>
                  <span className="text-sm font-mono text-primary">{siteLoadKw} {txt.kw}</span>
                </div>
                <Slider
                  min={0.5}
                  max={50}
                  step={0.5}
                  value={[siteLoadKw]}
                  onValueChange={v => setSiteLoadKw(v[0])}
                  data-testid="slider-site-load"
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium">{txt.generatorAge}</label>
                  <span className="text-sm font-mono text-primary">{dgAgeYears} {txt.years}</span>
                </div>
                <Slider
                  min={1}
                  max={20}
                  step={1}
                  value={[dgAgeYears]}
                  onValueChange={v => setDgAgeYears(v[0])}
                  data-testid="slider-dg-age"
                />
              </div>

              <Separator />

              <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{txt.loadFactor}</span>
                  <Badge variant={getStatusBadge()}>{loadFactor}%</Badge>
                </div>
                <Progress value={loadFactor} className="h-3" />
                <p className="text-xs text-muted-foreground mt-2">
                  {txt.optimalRange}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className={`border-2 ${
            analysis.color === 'red' ? 'border-red-300 dark:border-red-800' :
            analysis.color === 'orange' ? 'border-orange-300 dark:border-orange-800' :
            'border-green-300 dark:border-green-800'
          }`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getRecommendationIcon()}
                {txt.analysisDecision}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className={`rounded-lg p-4 ${
                analysis.color === 'red' ? 'bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300' :
                analysis.color === 'orange' ? 'bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-300' :
                'bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300'
              }`}>
                <p className="font-bold text-lg">{analysis.status}</p>
                <p className="text-sm opacity-80">{analysis.statusArabic}</p>
              </div>

              <div className="flex items-center gap-2 py-2">
                <ArrowRight className={`w-5 h-5 text-primary ${isRTL ? 'rotate-180' : ''}`} />
                <span className="text-lg font-bold">{analysis.recommendationTitle}</span>
              </div>

              <div className="space-y-3">
                {analysis.actionPlan.map((step, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">{i + 1}</span>
                    </div>
                    <p className="text-sm">{step}</p>
                  </div>
                ))}
              </div>

              {analysis.recommendation === 'relocate' && (
                <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex items-center gap-3">
                  <Truck className="w-8 h-8 text-blue-500" />
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    {txt.relocateMessage}
                  </p>
                </div>
              )}

              {analysis.recommendation === 'replace' && (
                <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center gap-3">
                  <Trash2 className="w-8 h-8 text-red-500" />
                  <p className="text-sm text-red-700 dark:text-red-300">
                    {txt.replaceMessage}
                  </p>
                </div>
              )}

              {analysis.recommendation === 'keep' && (
                <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center gap-3">
                  <Battery className="w-8 h-8 text-green-500" />
                  <p className="text-sm text-green-700 dark:text-green-300">
                    {txt.keepMessage}
                  </p>
                </div>
              )}

              {siteLoadKw < 5 && (
                <div 
                  className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4"
                  data-testid="card-solar-hybrid-recommendation"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Sun className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    <span className="font-bold text-amber-700 dark:text-amber-300">
                      {txt.solarHybridTitle}
                    </span>
                  </div>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    {txt.solarHybridDesc.replace("{load}", String(siteLoadKw))}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant="outline" className="bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700">
                      {txt.roi}
                    </Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {wastedMoneyYearly > 100 && (
          <Card className="mt-6 border-amber-200 dark:border-amber-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                <Flame className="w-5 h-5" />
                {txt.annualWaste}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {txt.oversizedGenerator}
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{txt.currentUtilization}</span>
                      <span className="font-mono">{loadFactor}%</span>
                    </div>
                    <Progress value={loadFactor} className="h-4" />
                    <p className="text-xs text-muted-foreground">
                      {txt.wastedCapacity.replace("{percent}", String(100 - loadFactor))}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col items-center justify-center bg-red-50 dark:bg-red-950 rounded-lg p-6">
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mb-2">
                    <TrendingDown className="w-5 h-5" />
                    <span className="text-sm font-medium">{txt.annualLoss}</span>
                  </div>
                  <p className="text-4xl font-bold text-red-600 dark:text-red-400">
                    ${wastedMoneyYearly.toLocaleString()}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowCalculationBreakdown(!showCalculationBreakdown)}
                    className="mt-2 text-xs text-muted-foreground"
                    data-testid="button-see-calculation-logic"
                  >
                    <Info className={`w-3 h-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                    {txt.seeCalculation}
                    {showCalculationBreakdown ? <ChevronUp className={`w-3 h-3 ${isRTL ? 'mr-1' : 'ml-1'}`} /> : <ChevronDown className={`w-3 h-3 ${isRTL ? 'mr-1' : 'ml-1'}`} />}
                  </Button>
                </div>
              </div>

              {showCalculationBreakdown && (
                <div 
                  className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 mt-4 space-y-3"
                  data-testid="section-calculation-breakdown"
                >
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    <Info className="w-4 h-4 text-primary" />
                    {txt.calculationBreakdown}
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <Badge variant="destructive" className="text-xs shrink-0">{txt.inefficiency}</Badge>
                      <span>{txt.inefficiencyDesc.replace("{consumption}", estimatedCurrentConsumption).replace("{load}", String(loadFactor))}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Badge variant="default" className="text-xs shrink-0">{txt.optimal}</Badge>
                      <span>{txt.optimalDesc.replace("{consumption}", estimatedOptimalConsumption)}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Badge variant="secondary" className="text-xs shrink-0">{txt.totalWaste}</Badge>
                      <span>{txt.totalWasteDesc.replace("{hourly}", wastedFuelHourly.toFixed(1)).replace("{annual}", annualHours.toLocaleString()).replace("{yearly}", wastedLitersPerYear.toLocaleString())}</span>
                    </div>
                    <Separator className="my-2" />
                    <p className="text-xs text-muted-foreground italic">
                      {txt.calculationNote.replace("{base}", baseFuelPricePerLiter.toFixed(2)).replace("{penalty}", String(maintenancePenaltyPct)).replace("{effective}", effectiveCostPerLiter.toFixed(2))}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {wastedMoneyYearly > 100 && (
          <Card className="mt-6 border-green-200 dark:border-green-800" data-testid="card-environmental-impact">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                <Leaf className="w-5 h-5" />
                {txt.environmentalImpact}
              </CardTitle>
              <CardDescription>
                {txt.carbonFootprint}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 dark:bg-green-950 rounded-lg p-6 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Flame className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="text-sm font-medium text-green-700 dark:text-green-300">{txt.unnecessaryCO2}</span>
                  </div>
                  <p className="text-4xl font-bold text-green-700 dark:text-green-300" data-testid="text-co2-tons">
                    {co2Tons.toFixed(1)} {txt.tons}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {wastedLitersPerYear.toLocaleString()} {txt.litersPerLiter.replace("{kg}", String(co2PerLiter))}
                  </p>
                </div>
                
                <div className="bg-green-50 dark:bg-green-950 rounded-lg p-6 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <TreeDeciduous className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="text-sm font-medium text-green-700 dark:text-green-300">{txt.treesRequired}</span>
                  </div>
                  <p className="text-4xl font-bold text-green-700 dark:text-green-300" data-testid="text-trees-equivalent">
                    {treesEquivalent.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {txt.treesAbsorb.replace("{kg}", String(treesPerKgCO2))}
                  </p>
                </div>
              </div>
              
              <div className="mt-4 bg-green-100 dark:bg-green-900 rounded-lg p-3 flex items-center gap-3">
                <Leaf className="w-6 h-6 text-green-600 dark:text-green-400 shrink-0" />
                <p className="text-sm text-green-700 dark:text-green-300">
                  {txt.switchingMessage}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
