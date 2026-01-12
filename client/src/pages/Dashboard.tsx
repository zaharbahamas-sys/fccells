import { Sidebar } from "@/components/Sidebar";
import { FloatingContactButton } from "@/components/ContactComments";
import { useSettings } from "@/contexts/SettingsContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  ArrowRight,
  Zap,
  Battery,
  Fuel,
  TrendingUp,
  Globe,
  Radio,
  Leaf,
  DollarSign,
  Clock,
  Shield,
  Lightbulb,
  BookOpen,
  ChevronRight,
  Target,
  BarChart3,
  Info,
  Award,
  CheckCircle,
  FileText,
  Database,
  ShieldCheck,
  Quote,
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { useProjects } from "@/hooks/use-projects";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { GuidedTour } from "@/components/GuidedTour";
import { ResearchDatabase } from "@/components/ResearchDatabase";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { MeroeNileSilhouette } from "@/components/CinematicBackgrounds";
import { DramaticHero } from "@/components/DramaticHero";
import heroCover from "@assets/hero-cover.jpg";
import fcpmsLogo from "@/lib/logo";

const fuelCellTypes = [
  {
    name: "PEM (Proton Exchange Membrane)",
    efficiency: "40-60%",
    temp: "60-80°C",
    power: "1-500 kW",
    pros: ["Quick startup", "High power density", "Low operating temp"],
    cons: ["Requires pure hydrogen", "Expensive catalysts"],
    telecomUse: "Primary choice for telecom backup power",
    color: "bg-blue-500",
  },
  {
    name: "SOFC (Solid Oxide)",
    efficiency: "50-65%",
    temp: "600-1000°C",
    power: "1-200 kW",
    pros: ["Fuel flexible", "High efficiency", "CHP capable"],
    cons: ["Slow startup", "High operating temp"],
    telecomUse: "Suitable for continuous baseload power",
    color: "bg-orange-500",
  },
  {
    name: "AFC (Alkaline)",
    efficiency: "50-70%",
    temp: "60-90°C",
    power: "1-100 kW",
    pros: ["Low cost materials", "High efficiency"],
    cons: ["CO2 sensitive", "Electrolyte management"],
    telecomUse: "Limited telecom applications",
    color: "bg-green-500",
  },
  {
    name: "DMFC (Direct Methanol)",
    efficiency: "20-40%",
    temp: "60-130°C",
    power: "1-5 kW",
    pros: ["Liquid fuel", "Simple design"],
    cons: ["Lower efficiency", "Methanol crossover"],
    telecomUse: "Small remote sites and sensors",
    color: "bg-purple-500",
  },
];

const adoptionData = [
  { year: "2020", telecom: 2.5, dataCenter: 1.8, industrial: 3.2 },
  { year: "2021", telecom: 3.8, dataCenter: 2.5, industrial: 4.1 },
  { year: "2022", telecom: 5.2, dataCenter: 3.8, industrial: 5.5 },
  { year: "2023", telecom: 7.1, dataCenter: 5.2, industrial: 7.2 },
  { year: "2024", telecom: 9.5, dataCenter: 7.1, industrial: 9.0 },
  { year: "2025", telecom: 12.8, dataCenter: 9.5, industrial: 11.2 },
];

const costTrendData = [
  { year: "2015", fuelCell: 8500, diesel: 1200, battery: 1500 },
  { year: "2018", fuelCell: 5200, diesel: 1300, battery: 1100 },
  { year: "2021", fuelCell: 3100, diesel: 1400, battery: 800 },
  { year: "2024", fuelCell: 1800, diesel: 1500, battery: 600 },
  { year: "2027", fuelCell: 1100, diesel: 1600, battery: 500 },
];

const efficiencyComparison = [
  { name: "PEM FC", value: 55, fill: "#3b82f6" },
  { name: "SOFC", value: 60, fill: "#f97316" },
  { name: "Diesel Gen", value: 35, fill: "#64748b" },
  { name: "Grid + Battery", value: 85, fill: "#22c55e" },
];

const telecomTrends = [
  {
    title: "5G Power Demands",
    description:
      "5G base stations consume 2-3x more power than 4G, driving need for efficient backup solutions",
    icon: Radio,
    stat: "3x",
    statLabel: "Power increase",
  },
  {
    title: "Net Zero Targets",
    description:
      "Major telecom operators committed to carbon neutrality by 2030-2040",
    icon: Target,
    stat: "2030",
    statLabel: "Target year",
  },
  {
    title: "Hydrogen Infrastructure",
    description: "Green hydrogen production costs dropping 50% by 2030",
    icon: Fuel,
    stat: "50%",
    statLabel: "Cost reduction",
  },
  {
    title: "Hybrid Systems",
    description:
      "Fuel cell + battery hybrid systems offer optimal reliability and efficiency",
    icon: Battery,
    stat: "99.999%",
    statLabel: "Uptime achieved",
  },
];

const industryFacts = [
  {
    label: "Global telecom fuel cell market",
    value: "$2.8B",
    growth: "+18% CAGR",
  },
  {
    label: "Sites using fuel cells (2024)",
    value: "45,000+",
    growth: "+25% YoY",
  },
  { label: "Average diesel savings", value: "40-60%", growth: "vs generators" },
  { label: "Carbon reduction potential", value: "85%", growth: "per site" },
];

const executiveSummary = {
  title: "Strategic Energy Intelligence & AI-Driven Infrastructure Suite",
  subtitle:
    "Advanced Operational Excellence Framework for Decentralized Power Assets",
  description:
    "As diesel costs escalate, the financial burden of our geographically distributed network is no longer sustainable. Beyond the economic drain, this fossil fuel dependency directly impacts Sudan's biodiversity and land health. We must stop following outdated energy models and start building upon modern global transitions. By converting operational waste into capital assets for hydrogen production, we transform from the nation's largest diesel consumer into an integrated Energy & Telecom InfraCo within 10 years.",
  descriptionAr:
    "مع تصاعد تكاليف الديزل، أصبح العبء المالي لشبكتنا الموزعة جغرافياً غير مستدام. بعيداً عن الاستنزاف الاقتصادي، فإن هذا الاعتماد على الوقود الأحفوري يؤثر بشكل مباشر على التنوع البيولوجي وصحة الأراضي في السودان. يجب أن نتوقف عن اتباع نماذج الطاقة القديمة ونبدأ في البناء من حيث انتهى الآخرون. من خلال تحويل النفايات التشغيلية إلى أصول رأسمالية لإنتاج الهيدروجين، سنتحول من أكبر مستهلك للديزل في البلاد إلى شركة متكاملة للطاقة والاتصالات في غضون 10 سنوات.",
  architect: "Eng. Mohamed Abbas",
  role: "Energy Systems Strategist & Senior Maintenance Engineer",
  pillars: [
    {
      title: "Precision Fuel Analytics",
      titleAr: "تحليلات الوقود الدقيقة",
      description:
        "Utilizing non-linear load profile mapping to resolve discrepancies in fuel consumption. This module replaces heuristic estimations with Data-Driven Quantitative Analysis.",
      icon: BarChart3,
    },
    {
      title: "Sustainable Energy Transition (SET)",
      titleAr: "التحول المستدام للطاقة",
      description:
        "A sophisticated feasibility engine designed to assess the integration of Zero-Emission Fuel Cells. Specifically engineered for remote, low-load infrastructure.",
      icon: Leaf,
    },
    {
      title: "Predictive AI Diagnostics",
      titleAr: "التشخيص بالذكاء الاصطناعي",
      description:
        "Leveraging Machine Learning to provide diagnostic insights for high-capacity power units, ensuring grid stability and asset longevity.",
      icon: Lightbulb,
    },
    {
      title: "Strategic Deliverables",
      titleAr: "المخرجات الاستراتيجية",
      description:
        "Automated generation of boardroom-ready insights, bridging the gap between field engineering and executive decision-making.",
      icon: FileText,
    },
  ],
  valueProposition: [
    {
      title: "Economic Sovereignty",
      description:
        "Direct impact on the bottom line by identifying hidden losses in fuel logistics and thermal inefficiencies.",
    },
    {
      title: "Infrastructure Scalability",
      description:
        "Designed with modular logic that allows seamless adaptation across all geographic regions in Sudan.",
    },
    {
      title: "Bio-Regenerative Energy Ecosystem",
      description:
        "Accelerating the shift to pure hydrogen ecosystems while protecting local biodiversity through non-invasive energy infrastructure.",
    },
    {
      title: "Modernization Roadmap",
      description:
        "Integrated execution framework including site assessment, procurement timelines, and staff technical training.",
    },
  ],
  standards: "Cross-referenced with ISO 8528 and IEC Standards.",
};

export default function Dashboard() {
  const { data: projects, isLoading } = useProjects();
  const [location] = useLocation();
  const { t, language, isRTL } = useSettings();

  const dashboardText = {
    en: {
      fcpms: "FCPMS",
      title: "Fuel Cells :  A Sustainable Horizon",
      tagline: "FCPMS represents the perfect synergy between technological precision and environmental harmony.",
      slogan: "Rooted in the Nile. Powered by Hydrogen.",
      strategicVision: "Strategic Vision",
      executiveSummary: "Executive Summary",
      operationalGoals: "Operational Goals",
      marketDynamics: "Market Dynamics & Local Opportunity",
      dieselHydrogen: "The Diesel-Hydrogen Divergence",
      economicRisk: "Economic risk vs. Future-proof investment",
      fossilFuel: "Fossil Fuel Vulnerability",
      greenHydrogen: "Green Hydrogen Opportunity",
      greenH2Matrix: "Green H2 Investment Matrix",
      tcoProjection: "TCO Projection & Local Ecosystem Growth",
      exploreStrategy: "Explore Global Strategy",
      globalTracker: "Global H2 Project Tracker",
      liveData: "Live 2025 Data",
      openTracker: "Open Tracker Map",
      localInvestment: "Local Investment",
      marketDependency: "Market Dependency",
      retainedValue: "100% Retained Value",
      capitalFlight: "90% Capital Flight",
      blueprintEnergySovereignty: "The Blueprint for Energy Sovereignty",
      exploreFullStrategy: "Explore Full Strategy",
      platformMessage: "Platform Message",
      strategicInfrastructureMandate: "Strategic Infrastructure Mandate",
      inclusivityFutureGovernance: "Inclusivity & Future Governance (Amanirenas Doctrine)",
      executiveQuote: "Gentlemen, we are the largest diesel consumer in Sudan, and we own the largest geographically distributed asset network. If we invest part of the OpEx budget wasted on diesel and transform it into CapEx for hydrogen production units, we will become an Energy and Telecom company (InfraCo) within 10 years.",
      economicSovereignty: "Economic Sovereignty",
      economicSovereigntyDesc: "Direct impact on the bottom line by identifying hidden losses in fuel logistics and thermal inefficiencies.",
      infrastructureScalability: "Infrastructure Scalability",
      infrastructureScalabilityDesc: "Designed with modular logic that allows seamless adaptation across all geographic regions in Sudan.",
      bioRegenerativeEcosystem: "Bio-Regenerative Energy Ecosystem",
      bioRegenerativeEcosystemDesc: "Accelerating the shift to pure hydrogen ecosystems while protecting local biodiversity through non-invasive energy infrastructure.",
      modernizationRoadmap: "Modernization Roadmap",
      modernizationRoadmapDesc: "Integrated execution framework including site assessment, procurement timelines, and staff technical training.",
      precisionFuelAnalytics: "Precision Fuel Analytics",
      precisionFuelAnalyticsDesc: "Utilizing non-linear load profile mapping to resolve discrepancies in fuel consumption. This module replaces heuristic estimations with Data-Driven Quantitative Analysis.",
      sustainableEnergyTransition: "Sustainable Energy Transition (SET)",
      sustainableEnergyTransitionDesc: "A sophisticated feasibility engine designed to assess the integration of Zero-Emission Fuel Cells. Specifically engineered for remote, low-load infrastructure.",
      predictiveAIDiagnostics: "Predictive AI Diagnostics",
      predictiveAIDiagnosticsDesc: "Leveraging Machine Learning to provide diagnostic insights for high-capacity power units, ensuring grid stability and asset longevity.",
      strategicDeliverables: "Strategic Deliverables",
      strategicDeliverablesDesc: "Automated generation of boardroom-ready insights, bridging the gap between field engineering and executive decision-making.",
      fossilFuelVulnerabilityDesc: "The diesel market is characterized by extreme volatility and supply chain insecurity. Each liter consumed represents a permanent operational loss and an irreversible carbon tax on Sudan's fragile ecosystems.",
      greenHydrogenOpportunityDesc: "Local H2 production transforms recurring OpEx into durable capital assets. By leveraging Sudan's solar abundance, we move from being price-takers in the global oil market to becoming energy self-sufficient producers.",
      netZeroQuote: "The world is accelerating toward Net-Zero. Following outdated diesel paths leaves us isolated; building local hydrogen infrastructure puts us at the forefront of the new energy economy.",
      interactiveGlobalMap: "Interactive Global Map: 1,200+ Projects Tracked in IEA 2025 Review",
      hydrogenCapex: "Hydrogen (CapEx View)",
      dieselOpex: "Diesel (OpEx Drain)",
      greenH2: "Green H2",
      globalOil: "Global Oil",
      energySystemsStrategist: "Energy Systems Strategist & Senior Maintenance Engineer",
    },
    ar: {
      fcpms: "FCPMS",
      title: "خلايا الوقود: أفق مستدام",
      tagline: "FCPMS تمثل التآزر المثالي بين الدقة التكنولوجية والتناغم البيئي.",
      slogan: "متجذرة في النيل. مدعومة بالهيدروجين.",
      strategicVision: "الرؤية الاستراتيجية",
      executiveSummary: "الملخص التنفيذي",
      operationalGoals: "الأهداف التشغيلية",
      marketDynamics: "ديناميكيات السوق والفرص المحلية",
      dieselHydrogen: "تباعد الديزل والهيدروجين",
      economicRisk: "المخاطر الاقتصادية مقابل الاستثمار المستدام",
      fossilFuel: "ضعف الوقود الأحفوري",
      greenHydrogen: "فرصة الهيدروجين الأخضر",
      greenH2Matrix: "مصفوفة استثمار الهيدروجين الأخضر",
      tcoProjection: "إسقاط التكلفة الإجمالية ونمو النظام البيئي المحلي",
      exploreStrategy: "استكشف الاستراتيجية العالمية",
      globalTracker: "متتبع مشاريع الهيدروجين العالمي",
      liveData: "بيانات 2025 المباشرة",
      openTracker: "فتح خريطة المتتبع",
      localInvestment: "الاستثمار المحلي",
      marketDependency: "الاعتماد على السوق",
      retainedValue: "100% قيمة محتفظ بها",
      capitalFlight: "90% هروب رأس المال",
      blueprintEnergySovereignty: "مخطط السيادة على الطاقة",
      exploreFullStrategy: "استكشف الاستراتيجية الكاملة",
      platformMessage: "رسالة المنصة",
      strategicInfrastructureMandate: "التفويض الاستراتيجي للبنية التحتية",
      inclusivityFutureGovernance: "الشمولية والحوكمة المستقبلية (مذهب أمانيريناس)",
      executiveQuote: "نحن أكبر مستهلك للديزل في السودان، ونمتلك أكبر شبكة أصول موزعة جغرافياً. إذا استثمرنا جزءاً من ميزانية التشغيل الضائعة على الديزل وحولناها إلى أصول رأسمالية لإنتاج الهيدروجين، فسنصبح شركة طاقة واتصالات في غضون 10 سنوات.",
      economicSovereignty: "السيادة الاقتصادية",
      economicSovereigntyDesc: "التأثير المباشر على النتائج النهائية من خلال تحديد الخسائر المخفية في لوجستيات الوقود وعدم الكفاءة الحرارية.",
      infrastructureScalability: "قابلية توسيع البنية التحتية",
      infrastructureScalabilityDesc: "مصمم بمنطق معياري يسمح بالتكيف السلس عبر جميع المناطق الجغرافية في السودان.",
      bioRegenerativeEcosystem: "نظام الطاقة الحيوي المتجدد",
      bioRegenerativeEcosystemDesc: "تسريع التحول إلى أنظمة الهيدروجين النقية مع حماية التنوع البيولوجي المحلي من خلال البنية التحتية للطاقة غير الغازية.",
      modernizationRoadmap: "خارطة طريق التحديث",
      modernizationRoadmapDesc: "إطار تنفيذ متكامل يشمل تقييم المواقع والجداول الزمنية للمشتريات والتدريب الفني للموظفين.",
      precisionFuelAnalytics: "تحليلات الوقود الدقيقة",
      precisionFuelAnalyticsDesc: "استخدام رسم خرائط ملف الحمل غير الخطي لحل التناقضات في استهلاك الوقود. يستبدل هذا النموذج التقديرات الاستدلالية بالتحليل الكمي المبني على البيانات.",
      sustainableEnergyTransition: "التحول المستدام للطاقة",
      sustainableEnergyTransitionDesc: "محرك جدوى متطور مصمم لتقييم تكامل خلايا الوقود عديمة الانبعاثات. مصمم خصيصاً للبنية التحتية البعيدة ذات الحمل المنخفض.",
      predictiveAIDiagnostics: "التشخيص التنبؤي بالذكاء الاصطناعي",
      predictiveAIDiagnosticsDesc: "الاستفادة من التعلم الآلي لتوفير رؤى تشخيصية لوحدات الطاقة عالية السعة، وضمان استقرار الشبكة وطول عمر الأصول.",
      strategicDeliverables: "المخرجات الاستراتيجية",
      strategicDeliverablesDesc: "توليد تلقائي لرؤى جاهزة لغرفة الاجتماعات، لسد الفجوة بين الهندسة الميدانية وصنع القرار التنفيذي.",
      fossilFuelVulnerabilityDesc: "يتميز سوق الديزل بتقلب شديد وعدم أمان سلسلة التوريد. كل لتر مستهلك يمثل خسارة تشغيلية دائمة وضريبة كربون لا رجعة فيها على النظم البيئية الهشة في السودان.",
      greenHydrogenOpportunityDesc: "إنتاج الهيدروجين المحلي يحول نفقات التشغيل المتكررة إلى أصول رأسمالية دائمة. من خلال الاستفادة من وفرة الطاقة الشمسية في السودان، ننتقل من متلقي الأسعار في سوق النفط العالمي إلى منتجين مكتفين ذاتياً بالطاقة.",
      netZeroQuote: "العالم يتسارع نحو صافي الصفر. اتباع مسارات الديزل القديمة يتركنا معزولين؛ بناء البنية التحتية المحلية للهيدروجين يضعنا في طليعة اقتصاد الطاقة الجديد.",
      interactiveGlobalMap: "خريطة عالمية تفاعلية: أكثر من 1,200 مشروع متتبع في مراجعة وكالة الطاقة الدولية 2025",
      hydrogenCapex: "الهيدروجين (رؤية رأس المال)",
      dieselOpex: "الديزل (استنزاف التشغيل)",
      greenH2: "الهيدروجين الأخضر",
      globalOil: "النفط العالمي",
      energySystemsStrategist: "استراتيجي أنظمة الطاقة ومهندس صيانة أول",
    },
  };

  const txt = dashboardText[language];

  const valuePropositionData = [
    {
      title: txt.economicSovereignty,
      description: txt.economicSovereigntyDesc,
    },
    {
      title: txt.infrastructureScalability,
      description: txt.infrastructureScalabilityDesc,
    },
    {
      title: txt.bioRegenerativeEcosystem,
      description: txt.bioRegenerativeEcosystemDesc,
    },
    {
      title: txt.modernizationRoadmap,
      description: txt.modernizationRoadmapDesc,
    },
  ];

  const pillarsData = [
    {
      title: txt.precisionFuelAnalytics,
      titleAr: "تحليلات الوقود الدقيقة",
      description: txt.precisionFuelAnalyticsDesc,
      icon: BarChart3,
    },
    {
      title: txt.sustainableEnergyTransition,
      titleAr: "التحول المستدام للطاقة",
      description: txt.sustainableEnergyTransitionDesc,
      icon: Leaf,
    },
    {
      title: txt.predictiveAIDiagnostics,
      titleAr: "التشخيص بالذكاء الاصطناعي",
      description: txt.predictiveAIDiagnosticsDesc,
      icon: Lightbulb,
    },
    {
      title: txt.strategicDeliverables,
      titleAr: "المخرجات الاستراتيجية",
      description: txt.strategicDeliverablesDesc,
      icon: FileText,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex relative overflow-hidden" dir={isRTL ? "rtl" : "ltr"}>
      <MeroeNileSilhouette />
      <Sidebar />
      <main className="flex-1 overflow-y-auto relative z-10 lg:ml-20">
        {/* Top Header Section with Original Background + Dramatic Animation Overlay */}
        <header className="text-white p-6 sm:p-10 lg:p-16 border-b border-[#22C55E]/30 relative overflow-hidden min-h-[350px] sm:min-h-[400px] lg:min-h-[500px]">
          {/* Original Background */}
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${heroCover})` }} />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1E293B]/70 via-[#1E293B]/50 to-[#1E293B]/90" />
          
          {/* Dramatic Animation Overlay */}
          <DramaticHero />
        </header>

        {/* Combined First 4 Menu Content Section */}
        <div className="p-4 sm:p-6 lg:p-8 space-y-8 sm:space-y-10 lg:space-y-12">
          <div className="max-w-7xl mx-auto space-y-10 sm:space-y-12 lg:space-y-16">
            {/* 1. Strategic Vision */}
            <section id="vision" className="scroll-mt-8">
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6 lg:mb-8">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500" />
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 drop-shadow-sm">
                  {txt.strategicVision}
                </h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                <Card className="border-none shadow-2xl bg-slate-900 text-white overflow-hidden relative min-h-[300px] sm:min-h-[350px] lg:min-h-[400px] flex flex-col justify-center rounded-2xl sm:rounded-3xl group">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072')] bg-cover bg-center opacity-20 transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
                  <div className="relative z-10 p-10">
                    <div className="w-16 h-1 bg-emerald-500 mb-6" />
                    <h3 className="text-3xl font-bold mb-4">
                      {txt.blueprintEnergySovereignty}
                    </h3>
                    <p className="text-lg leading-relaxed text-slate-300 italic mb-8">
                      "{language === 'ar' ? executiveSummary.descriptionAr : executiveSummary.description}"
                    </p>
                    <Link href="/remote-monitoring">
                      <Button
                        variant="outline"
                        className="border-emerald-500/50 hover:bg-emerald-500/10 text-emerald-400 hover:text-emerald-300 px-8 h-12 rounded-full"
                      >
                        {txt.exploreFullStrategy}{" "}
                        <ArrowRight className={`${isRTL ? 'ml-2 rotate-180' : 'mr-2'} w-4 h-4`} />
                      </Button>
                    </Link>
                  </div>
                </Card>
                <div className="space-y-4">
                  {valuePropositionData.map((vp, i) => (
                    <Card
                      key={i}
                      className="border-none shadow-lg bg-white/80 backdrop-blur-sm ring-1 ring-slate-100 hover:shadow-xl transition-all rounded-2xl"
                    >
                      <CardContent className="p-6 flex gap-6 items-center">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0">
                          <CheckCircle className="w-7 h-7 text-emerald-500" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg text-slate-900 mb-1">
                            {vp.title}
                          </h4>
                          <p className="text-sm text-slate-600 leading-relaxed font-medium">
                            {vp.description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </section>

            {/* 2. Executive Message */}
            <section id="message" className="scroll-mt-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                  <Quote className="w-6 h-6 text-emerald-500" />
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 drop-shadow-sm">
                  {txt.platformMessage}
                </h2>
              </div>
              <Card className="border-none shadow-2xl bg-white/95 backdrop-blur-md ring-1 ring-slate-100 overflow-hidden rounded-3xl">
                <div className="h-2 bg-gradient-to-l from-[#22C55E] to-blue-500" />
                <CardHeader className="p-10 pb-4">
                  <CardTitle className="text-3xl font-bold flex items-center gap-3">
                    <Quote className="w-8 h-8 text-[#22C55E]" />
                    {txt.strategicInfrastructureMandate}
                  </CardTitle>
                  <CardDescription className="text-slate-500 font-medium">
                    {txt.inclusivityFutureGovernance}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-10 pt-0 space-y-8 relative">
                  {/* Amanirenas Silhouette Mockup */}
                  <div className={`absolute top-0 ${isRTL ? 'left-10' : 'right-10'} w-48 h-48 opacity-[0.03] pointer-events-none`}>
                    <svg
                      viewBox="0 0 100 100"
                      className="w-full h-full fill-[#1E293B]"
                    >
                      <path d="M50,10 C30,10 20,40 20,60 C20,80 40,90 50,90 C60,90 80,80 80,60 C80,40 70,10 50,10 Z" />
                    </svg>
                  </div>
                  <div className="space-y-6">
                    <p className={`text-2xl font-semibold text-slate-800 leading-relaxed ${isRTL ? 'border-l-4 pl-6' : 'border-r-4 pr-6'} border-emerald-500`}>
                      {txt.executiveQuote}
                    </p>
                  </div>
                  <div className="pt-10 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-5">
                      <img 
                        src="/mohamed-abbas.jpg" 
                        alt="Mohamed Abbas"
                        className="w-16 h-16 rounded-2xl object-cover shadow-lg"
                      />
                      <div>
                        <p className="font-bold text-xl text-slate-900">
                          {executiveSummary.architect}
                        </p>
                        <p className="text-sm font-medium text-emerald-600 uppercase tracking-wider">
                          {txt.energySystemsStrategist}
                        </p>
                      </div>
                    </div>
                    <div className="hidden md:block">
                      <div className="text-[40px] font-serif text-slate-200 select-none">
                        Mohamed Abbas
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* 3. Operational Goals */}
            <section id="goals" className="scroll-mt-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                  <Target className="w-6 h-6 text-emerald-500" />
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 drop-shadow-sm">
                  {txt.operationalGoals}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {pillarsData.map((pillar, i) => {
                  const Icon = pillar.icon;
                  return (
                    <Card
                      key={i}
                      className="border-none shadow-xl bg-white/80 backdrop-blur-sm ring-1 ring-slate-100 hover:-translate-y-2 transition-all duration-500 group rounded-2xl"
                    >
                      <CardHeader className="pb-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-50 to-slate-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                          <Icon className="w-8 h-8 text-emerald-600" />
                        </div>
                        <CardTitle className="text-xl font-bold text-slate-900 mb-2">
                          {pillar.title}
                        </CardTitle>
                        {!isRTL && (
                          <Badge
                            variant="outline"
                            className="text-[10px] font-bold border-emerald-200 text-emerald-700 bg-emerald-50/50"
                          >
                            {pillar.titleAr}
                          </Badge>
                        )}
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-slate-600 leading-relaxed font-medium">
                          {pillar.description}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>

            {/* 4. Analytics & Cost Trajectory */}
            <section id="analytics" className="scroll-mt-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-emerald-500" />
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 drop-shadow-sm">
                  {txt.marketDynamics}
                </h2>
              </div>

              <div className="grid lg:grid-cols-2 gap-8 mb-8">
                <Card className="border-none shadow-2xl bg-white/90 backdrop-blur-sm ring-1 ring-slate-100 rounded-3xl overflow-hidden">
                  <CardHeader className="p-8">
                    <CardTitle className="text-2xl font-black text-slate-900">
                      {txt.dieselHydrogen}
                    </CardTitle>
                    <CardDescription>
                      {txt.economicRisk}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-8 pt-0 space-y-6">
                    <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
                      <h4 className="font-bold text-red-900 flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4" /> {txt.fossilFuel}
                      </h4>
                      <p className="text-sm text-red-700 leading-relaxed">
                        {txt.fossilFuelVulnerabilityDesc}
                      </p>
                    </div>
                    <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                      <h4 className="font-bold text-emerald-900 flex items-center gap-2 mb-2">
                        <Globe className="w-4 h-4" /> {txt.greenHydrogen}
                      </h4>
                      <p className="text-sm text-emerald-700 leading-relaxed mb-4">
                        {txt.greenHydrogenOpportunityDesc}
                      </p>
                      <div className="text-[10px] text-emerald-800/60 space-y-1">
                        <p>
                          •{" "}
                          <a
                            href="https://www.irena.org/publications/2024/Jan/World-Energy-Transitions-Outlook-2024"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-emerald-500 underline"
                          >
                            IRENA (2024)
                          </a>
                          : Solar-to-H2 costs projected to reach $1.5/kg by
                          2030.
                        </p>
                        <p>
                          •{" "}
                          <a
                            href="https://global-solar-atlas.info/map?c=15.584,32.533,6"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-emerald-500 underline"
                          >
                            World Bank
                          </a>
                          : Sudan's GHI (Global Horizontal Irradiance) exceeds
                          2400 kWh/m².
                        </p>
                        <p>
                          •{" "}
                          <a
                            href="https://www.iea.org/reports/world-energy-outlook-2024"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-emerald-500 underline"
                          >
                            IEA World Energy Outlook
                          </a>
                          : Fossil fuel volatility risk index increased by 40%.
                        </p>
                      </div>
                    </div>
                    <div className="pt-4">
                      <p className="text-sm text-slate-500 italic">
                        "{txt.netZeroQuote}"
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-2xl bg-white/90 backdrop-blur-sm ring-1 ring-slate-100 rounded-3xl overflow-hidden group">
                  <CardHeader className="p-8 pb-4 flex flex-row items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl font-black text-slate-900">
                        {txt.greenH2Matrix}
                      </CardTitle>
                      <CardDescription>
                        {txt.tcoProjection}
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 relative z-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = "/h2-strategy";
                      }}
                    >
                      <Globe className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      {txt.exploreStrategy}
                    </Button>
                  </CardHeader>
                  <CardContent className="p-8 pt-0">
                    <div className="mb-6 p-4 bg-slate-900 rounded-2xl border border-slate-800 relative overflow-hidden group/map">
                      <div className="flex items-center justify-between mb-3 relative z-10">
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-emerald-400" />
                          <span className="text-xs font-bold text-slate-200 tracking-wider uppercase">
                            {txt.globalTracker}
                          </span>
                        </div>
                        <Badge
                          variant="outline"
                          className="text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        >
                          {txt.liveData}
                        </Badge>
                      </div>

                      <div className="h-48 bg-slate-950 rounded-xl relative overflow-hidden flex items-center justify-center border border-slate-800/50">
                        {/* Mock Map Visualization */}
                        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')]" />
                        <div className="relative z-10 text-center px-6">
                          <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-3 animate-pulse">
                            <Target className="w-6 h-6 text-emerald-500" />
                          </div>
                          <p className="text-[11px] text-slate-400 font-medium max-w-[200px] mx-auto">
                            {txt.interactiveGlobalMap}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mt-4 text-[10px] text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/5 h-8 relative z-50"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(
                                "https://www.iea.org/data-and-statistics/data-tools/hydrogen-tracker",
                                "_blank",
                              );
                            }}
                          >
                            {txt.openTracker}{" "}
                            <ArrowRight className={`${isRTL ? 'mr-1 rotate-180' : 'ml-1'} w-3 h-3`} />
                          </Button>
                        </div>

                        {/* Simulated Data Points */}
                        <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-emerald-500 rounded-full blur-[2px] animate-ping" />
                        <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-blue-500 rounded-full blur-[1px]" />
                        <div className="absolute bottom-1/3 left-1/2 w-2 h-2 bg-emerald-500 rounded-full blur-[2px] animate-pulse" />
                      </div>
                    </div>

                    <div className="h-48 mb-6">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={costTrendData}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="#e2e8f0"
                          />
                          <XAxis
                            dataKey="year"
                            axisLine={false}
                            tickLine={false}
                          />
                          <YAxis axisLine={false} tickLine={false} />
                          <Tooltip
                            cursor={{ fill: "#f8fafc" }}
                            contentStyle={{
                              borderRadius: "16px",
                              border: "none",
                              boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
                            }}
                          />
                          <Legend />
                          <Bar
                            dataKey="fuelCell"
                            fill="#10b981"
                            name={txt.hydrogenCapex}
                            radius={[4, 4, 0, 0]}
                          />
                          <Bar
                            dataKey="diesel"
                            fill="#ef4444"
                            name={txt.dieselOpex}
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                        <p className="text-xs text-slate-500 uppercase font-bold mb-1">
                          {txt.localInvestment}
                        </p>
                        <p className="text-lg font-black text-slate-900">
                          {txt.greenH2}
                        </p>
                        <p className="text-[10px] text-emerald-600 font-medium">
                          {txt.retainedValue}
                        </p>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                        <p className="text-xs text-slate-500 uppercase font-bold mb-1">
                          {txt.marketDependency}
                        </p>
                        <p className="text-lg font-black text-slate-900">
                          {txt.globalOil}
                        </p>
                        <p className="text-[10px] text-red-600 font-medium">
                          {txt.capitalFlight}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>
          </div>
        </div>
      </main>
      <FloatingContactButton />
    </div>
  );
}
