import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { 
  TrendingUp, 
  Lightbulb, 
  Zap, 
  Activity, 
  Globe, 
  ArrowUpRight, 
  Factory, 
  LineChart,
  ShieldCheck,
  Quote,
  Target,
  Leaf,
  Coins
} from "lucide-react";
import { motion } from "framer-motion";
import { useSettings } from "@/contexts/SettingsContext";

const strategicVisionText = {
  en: {
    executiveMessage: "Executive Message: The Path to Energy Sovereignty",
    executiveQuote: "\"Gentlemen, we are the largest diesel consumer in the country",
    countryName: "Sudan",
    executiveQuote2: ", and we own the largest geographically distributed asset network. If we invest part of the OpEx budget wasted on diesel and transform it into CapEx for hydrogen production units, we will become an",
    infraCoName: "Energy and Telecom company (InfraCo)",
    executiveQuote3: " within 10 years. This will skyrocket the company's value and assets.\"",
    strategicDirective: "Strategic Board Directive",
    vision2035: "Vision 2035",
    infraCoTransformation: "The InfraCo Transformation",
    infraCoDescription: "Integration of hydrogen production at every tower site, turning cost centers into energy assets.",
    realityCheck: "THE REALITY CHECK",
    realityCheckAr: "(المصارحة)",
    realityCheckDesc: "Starting with absolute transparency: acknowledging that being the \"largest diesel consumer\" is our greatest liability—and our greatest opportunity for scale.",
    financialReallocation: "FINANCIAL REALLOCATION",
    financialReallocationAr: "(الحل المالي)",
    financialReallocationDesc: "We are not asking for new capital. We are \"redirecting\" the existing OpEx (waste) into CapEx (value-generating assets). This is self-funding sovereignty.",
    infraCoPromise: "THE INFRACO PROMISE",
    infraCoPromiseAr: "(الوعد الكبير)",
    infraCoPromiseDesc: "By 2035, we won't just sell minutes and gigabytes. We will be the region's most reliable green energy provider, leveraging our distributed network to serve industry and transport.",
    evolutionStrategy: "Evolution Strategy",
    integratedRoadmap: "Integrated Investment Roadmap",
    roadmapSubtitle: "A three-tier approach to transforming telecom infrastructure from a power consumer into a strategic energy producer.",
    strategicInsights: "Strategic Insights",
    coreConcept: "1. THE CORE CONCEPT",
    coreConceptSubtitle: "Paradigm shift from consumer to producer.",
    coreConceptDesc: "We aim to transform from an energy-dependent Telecom Operator into an Energy Service Company (ESCO).",
    passiveAsset: "Passive Asset",
    passiveAssetDesc: "Traditional towers that only incur fuel and maintenance costs.",
    activeHub: "Active Production Hub",
    activeHubDesc: "Strategic nodes that generate power and hydrogen for internal and external use.",
    hydrogenAsset: "2. HYDROGEN AS AN ASSET",
    hydrogenAssetSubtitle: "Turning every site into a fuel production station.",
    hydrogenPoint1: "Produce Green Hydrogen locally using electrolyzers powered by surplus solar, eliminating logistics risks.",
    hydrogenPoint2: "Gain Energy Sovereignty, protecting operations from global oil price volatility and local shortages.",
    newRevenue: "3. NEW REVENUE STREAMS",
    newRevenueSubtitle: "Monetizing surplus production and carbon credits.",
    marketSales: "Market Sales",
    marketSalesDesc: "Sell surplus H2 to transport sectors.",
    carbonCredits: "Carbon Credits",
    carbonCreditsDesc: "Trade emissions reductions globally.",
    gridServices: "Grid Services",
    gridServicesDesc: "Provide stability to local grids.",
    executionRoadmap: "Execution Roadmap",
    phase1Phase: "Phase 1: Vision on Site",
    phase1Title: "Local Implementation",
    phase1Focus: "Deploying ethanol fuel cells directly at telecom tower locations to replace diesel dependency.",
    phase1Result: "Immediate energy stability and carbon reduction.",
    phase2Phase: "Phase 2: Tactical Goal",
    phase2Title: "Operational Independence",
    phase2Focus: "Integrating solar PV with electrolysis for on-site hydrogen production and storage.",
    phase2Result: "Total freedom from fuel logistics and price fluctuations.",
    phase3Phase: "Phase 3: Strategic Goal",
    phase3Title: "Energy Leadership",
    phase3Focus: "Scaling production to sell surplus green hydrogen and power to the regional market.",
    phase3Result: "Transforming cost centers into high-profit energy hubs.",
    strategicTransformation: "Strategic Transformation",
    strategicTransformationDesc: "\"The transition from a passive infrastructure owner to an active energy producer is our most significant strategic lever for long-term profitability and regional leadership.\""
  },
  ar: {
    executiveMessage: "الرسالة التنفيذية: الطريق إلى السيادة على الطاقة",
    executiveQuote: "\"سادتي، نحن أكبر مستهلك للديزل في البلاد",
    countryName: "السودان",
    executiveQuote2: "، ونمتلك أكبر شبكة أصول موزعة جغرافياً. إذا استثمرنا جزءاً من ميزانية النفقات التشغيلية المهدرة على الديزل وحولناها إلى نفقات رأسمالية لوحدات إنتاج الهيدروجين، سنصبح",
    infraCoName: "شركة طاقة واتصالات (إنفراكو)",
    executiveQuote3: " خلال 10 سنوات. هذا سيرفع قيمة الشركة وأصولها بشكل كبير.\"",
    strategicDirective: "التوجيه الاستراتيجي لمجلس الإدارة",
    vision2035: "رؤية 2035",
    infraCoTransformation: "تحول شركة البنية التحتية",
    infraCoDescription: "دمج إنتاج الهيدروجين في كل موقع برج، وتحويل مراكز التكلفة إلى أصول طاقة.",
    realityCheck: "المصارحة",
    realityCheckAr: "",
    realityCheckDesc: "البدء بالشفافية المطلقة: الاعتراف بأن كوننا \"أكبر مستهلك للديزل\" هو أكبر مسؤوليتنا - وأعظم فرصة للتوسع.",
    financialReallocation: "الحل المالي",
    financialReallocationAr: "",
    financialReallocationDesc: "نحن لا نطلب رأس مال جديد. نحن \"نعيد توجيه\" النفقات التشغيلية الحالية (الهدر) إلى نفقات رأسمالية (أصول مولدة للقيمة). هذه سيادة ذاتية التمويل.",
    infraCoPromise: "الوعد الكبير",
    infraCoPromiseAr: "",
    infraCoPromiseDesc: "بحلول 2035، لن نبيع فقط الدقائق والجيجابايت. سنكون مزود الطاقة الخضراء الأكثر موثوقية في المنطقة، مستفيدين من شبكتنا الموزعة لخدمة الصناعة والنقل.",
    evolutionStrategy: "استراتيجية التطور",
    integratedRoadmap: "خارطة طريق الاستثمار المتكاملة",
    roadmapSubtitle: "نهج من ثلاث مراحل لتحويل البنية التحتية للاتصالات من مستهلك للطاقة إلى منتج استراتيجي للطاقة.",
    strategicInsights: "الرؤى الاستراتيجية",
    coreConcept: "1. المفهوم الأساسي",
    coreConceptSubtitle: "تحول النموذج من مستهلك إلى منتج.",
    coreConceptDesc: "نهدف إلى التحول من مشغل اتصالات معتمد على الطاقة إلى شركة خدمات طاقة (ESCO).",
    passiveAsset: "الأصل السلبي",
    passiveAssetDesc: "الأبراج التقليدية التي تتحمل فقط تكاليف الوقود والصيانة.",
    activeHub: "مركز الإنتاج النشط",
    activeHubDesc: "عقد استراتيجية تولد الطاقة والهيدروجين للاستخدام الداخلي والخارجي.",
    hydrogenAsset: "2. الهيدروجين كأصل",
    hydrogenAssetSubtitle: "تحويل كل موقع إلى محطة إنتاج وقود.",
    hydrogenPoint1: "إنتاج الهيدروجين الأخضر محلياً باستخدام المحللات الكهربائية التي تعمل بالطاقة الشمسية الفائضة، مما يلغي مخاطر اللوجستيات.",
    hydrogenPoint2: "تحقيق السيادة على الطاقة، وحماية العمليات من تقلبات أسعار النفط العالمية والنقص المحلي.",
    newRevenue: "3. مصادر إيرادات جديدة",
    newRevenueSubtitle: "تحقيق الدخل من الإنتاج الفائض وأرصدة الكربون.",
    marketSales: "مبيعات السوق",
    marketSalesDesc: "بيع الهيدروجين الفائض لقطاعات النقل.",
    carbonCredits: "أرصدة الكربون",
    carbonCreditsDesc: "تداول تخفيضات الانبعاثات عالمياً.",
    gridServices: "خدمات الشبكة",
    gridServicesDesc: "توفير الاستقرار للشبكات المحلية.",
    executionRoadmap: "خارطة طريق التنفيذ",
    phase1Phase: "المرحلة 1: الرؤية في الموقع",
    phase1Title: "التنفيذ المحلي",
    phase1Focus: "نشر خلايا وقود الإيثانول مباشرة في مواقع أبراج الاتصالات لاستبدال الاعتماد على الديزل.",
    phase1Result: "استقرار فوري للطاقة وتقليل الكربون.",
    phase2Phase: "المرحلة 2: الهدف التكتيكي",
    phase2Title: "الاستقلال التشغيلي",
    phase2Focus: "دمج الطاقة الشمسية الكهروضوئية مع التحليل الكهربائي لإنتاج وتخزين الهيدروجين في الموقع.",
    phase2Result: "حرية كاملة من لوجستيات الوقود وتقلبات الأسعار.",
    phase3Phase: "المرحلة 3: الهدف الاستراتيجي",
    phase3Title: "القيادة في مجال الطاقة",
    phase3Focus: "توسيع الإنتاج لبيع الهيدروجين الأخضر الفائض والطاقة للسوق الإقليمي.",
    phase3Result: "تحويل مراكز التكلفة إلى مراكز طاقة عالية الربح.",
    strategicTransformation: "التحول الاستراتيجي",
    strategicTransformationDesc: "\"الانتقال من مالك بنية تحتية سلبي إلى منتج طاقة نشط هو أهم رافعة استراتيجية لدينا للربحية طويلة المدى والريادة الإقليمية.\""
  }
};

export default function StrategicVision() {
  const { language, isRTL } = useSettings();
  const txt = strategicVisionText[language];

  const roadmapSteps = [
    {
      phase: txt.phase1Phase,
      title: txt.phase1Title,
      focus: txt.phase1Focus,
      result: txt.phase1Result,
      color: "bg-blue-500",
      icon: Zap
    },
    {
      phase: txt.phase2Phase,
      title: txt.phase2Title,
      focus: txt.phase2Focus,
      result: txt.phase2Result,
      color: "bg-orange-500",
      icon: Activity
    },
    {
      phase: txt.phase3Phase,
      title: txt.phase3Title,
      focus: txt.phase3Focus,
      result: txt.phase3Result,
      color: "bg-green-600",
      icon: Factory
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex" dir={isRTL ? "rtl" : "ltr"}>
      <Sidebar />
      <main className={`flex-1 p-4 sm:p-6 lg:p-8 ${isRTL ? 'lg:mr-20' : 'lg:ml-20'}`}>
        {/* Intro Message Section */}
        <motion.section 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden border border-slate-800">
            <div className={`absolute top-0 ${isRTL ? 'left-0' : 'right-0'} w-64 h-64 bg-primary/20 rounded-full blur-3xl ${isRTL ? '-ml-32' : '-mr-32'} -mt-32`} />
            <div className={`absolute bottom-0 ${isRTL ? 'right-0' : 'left-0'} w-48 h-48 bg-blue-500/10 rounded-full blur-3xl ${isRTL ? '-mr-24' : '-ml-24'} -mb-24`} />
            
            <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 rounded-full text-primary text-xs font-bold uppercase tracking-widest border border-primary/30">
                <ShieldCheck className="w-4 h-4" />
                {txt.executiveMessage}
              </div>
              
              <blockquote className="text-2xl md:text-3xl lg:text-4xl font-serif italic leading-tight text-slate-100">
                {txt.executiveQuote} <span className="text-primary not-italic font-sans font-bold">"{txt.countryName}"</span>{txt.executiveQuote2} <span className="text-blue-400 not-italic font-sans font-bold">{txt.infraCoName}</span>{txt.executiveQuote3}
              </blockquote>
              
              <div className="flex flex-col items-center gap-2 pt-4">
                <div className="w-12 h-1 bg-primary rounded-full" />
                <p className="text-slate-400 text-sm uppercase tracking-widest font-bold">{txt.strategicDirective}</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Strategic Analysis & Visual Enhancement */}
        <section className="mb-16 grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          <div className="relative rounded-3xl overflow-hidden shadow-xl group min-h-[400px]">
            <img 
              src="https://images.unsplash.com/photo-1544654803-b69140b285a1?auto=format&fit=crop&q=80&w=2070" 
              alt="Hybrid Telecom Infrastructure"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
            <div className={`absolute bottom-0 ${isRTL ? 'right-0' : 'left-0'} p-8`}>
              <Badge className="bg-primary text-white mb-3">{txt.vision2035}</Badge>
              <h3 className="text-2xl font-bold text-white mb-2">{txt.infraCoTransformation}</h3>
              <p className="text-slate-200 text-sm max-w-md">
                {txt.infraCoDescription}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <Card className="flex-1 bg-white dark:bg-slate-800 border-none shadow-md overflow-hidden relative">
              <div className={`absolute top-0 ${isRTL ? 'left-0' : 'right-0'} p-4 opacity-10`}>
                <ShieldCheck className="w-20 h-20 text-primary" />
              </div>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 text-primary font-bold text-sm">
                  <Activity className="w-4 h-4" />
                  {txt.realityCheck} {txt.realityCheckAr}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  {txt.realityCheckDesc}
                </p>
              </CardContent>
            </Card>

            <Card className="flex-1 bg-white dark:bg-slate-800 border-none shadow-md overflow-hidden relative">
              <div className={`absolute top-0 ${isRTL ? 'left-0' : 'right-0'} p-4 opacity-10`}>
                <Coins className="w-20 h-20 text-emerald-500" />
              </div>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                  <TrendingUp className="w-4 h-4" />
                  {txt.financialReallocation} {txt.financialReallocationAr}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  {txt.financialReallocationDesc}
                </p>
              </CardContent>
            </Card>

            <Card className="flex-1 bg-primary text-white border-none shadow-md overflow-hidden relative">
              <div className={`absolute top-0 ${isRTL ? 'left-0' : 'right-0'} p-4 opacity-20`}>
                <Globe className="w-20 h-20 text-white" />
              </div>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 text-white/90 font-bold text-sm">
                  <Zap className="w-4 h-4" />
                  {txt.infraCoPromise} {txt.infraCoPromiseAr}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-white/80 text-sm leading-relaxed font-medium">
                  {txt.infraCoPromiseDesc}
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <header className={`mb-12 ${isRTL ? 'border-r-4 pr-6' : 'border-l-4 pl-6'} border-primary`}>
          <Badge className="mb-4 bg-primary/10 text-primary border-none px-4 py-1">
            {txt.evolutionStrategy}
          </Badge>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
            {txt.integratedRoadmap}
          </h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 mt-4 max-w-3xl leading-relaxed">
            {txt.roadmapSubtitle}
          </p>
        </header>

        {/* Detailed Insights Section (Combined from Vision Article) */}
        <section className="mb-16 max-w-5xl">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
            <Target className="w-6 h-6 text-primary" />
            {txt.strategicInsights}
          </h2>
          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="philosophy" className="border-none">
              <AccordionTrigger className="hover:no-underline p-6 bg-slate-100 dark:bg-slate-800 rounded-t-xl">
                <div className={`flex items-center gap-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                  <Globe className="w-5 h-5 text-primary" />
                  <div>
                    <h3 className="text-lg font-bold">{txt.coreConcept}</h3>
                    <p className="text-sm text-slate-500 font-normal">{txt.coreConceptSubtitle}</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-6 bg-white dark:bg-slate-900 border-x border-b border-slate-100 dark:border-slate-800 rounded-b-xl">
                <p className="text-slate-600 dark:text-slate-300 mb-4">
                  {txt.coreConceptDesc}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">{txt.passiveAsset}</h4>
                    <p className="text-xs text-slate-500">{txt.passiveAssetDesc}</p>
                  </div>
                  <div className={`p-4 bg-primary/5 rounded-lg ${isRTL ? 'border-r-4' : 'border-l-4'} border-primary`}>
                    <h4 className="font-bold text-primary text-sm mb-1">{txt.activeHub}</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{txt.activeHubDesc}</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="hydrogen" className="border-none">
              <AccordionTrigger className="hover:no-underline p-6 bg-slate-100 dark:bg-slate-800 rounded-t-xl">
                <div className={`flex items-center gap-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                  <Zap className="w-5 h-5 text-yellow-500" />
                  <div>
                    <h3 className="text-lg font-bold">{txt.hydrogenAsset}</h3>
                    <p className="text-sm text-slate-500 font-normal">{txt.hydrogenAssetSubtitle}</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-6 bg-white dark:bg-slate-900 border-x border-b border-slate-100 dark:border-slate-800 rounded-b-xl">
                <div className="space-y-4 text-slate-600 dark:text-slate-300">
                  <div className="flex items-start gap-3">
                    <Leaf className="w-5 h-5 text-green-500 mt-1" />
                    <p className="text-sm">{txt.hydrogenPoint1}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-blue-500 mt-1" />
                    <p className="text-sm">{txt.hydrogenPoint2}</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="revenue" className="border-none">
              <AccordionTrigger className="hover:no-underline p-6 bg-slate-100 dark:bg-slate-800 rounded-t-xl">
                <div className={`flex items-center gap-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                  <Coins className="w-5 h-5 text-green-600" />
                  <div>
                    <h3 className="text-lg font-bold">{txt.newRevenue}</h3>
                    <p className="text-sm text-slate-500 font-normal">{txt.newRevenueSubtitle}</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-6 bg-white dark:bg-slate-900 border-x border-b border-slate-100 dark:border-slate-800 rounded-b-xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-center">
                    <TrendingUp className="w-6 h-6 text-primary mx-auto mb-2" />
                    <h5 className="font-bold text-xs">{txt.marketSales}</h5>
                    <p className="text-[10px] text-slate-500">{txt.marketSalesDesc}</p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-center">
                    <Globe className="w-6 h-6 text-primary mx-auto mb-2" />
                    <h5 className="font-bold text-xs">{txt.carbonCredits}</h5>
                    <p className="text-[10px] text-slate-500">{txt.carbonCreditsDesc}</p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-center">
                    <Zap className="w-6 h-6 text-primary mx-auto mb-2" />
                    <h5 className="font-bold text-xs">{txt.gridServices}</h5>
                    <p className="text-[10px] text-slate-500">{txt.gridServicesDesc}</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* Execution Roadmap */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-yellow-500" />
            {txt.executionRoadmap}
          </h2>
          
          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-slate-200 dark:bg-slate-800 -translate-x-1/2 hidden md:block" />
            
            <div className="space-y-12">
              {roadmapSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className={`flex flex-col md:flex-row items-center gap-8 ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
                  >
                    <div className="flex-1 w-full">
                      <Card className={`border-none shadow-lg ${index % 2 === 0 ? (isRTL ? 'text-right' : 'text-left') : (isRTL ? 'text-left' : 'text-right')}`}>
                        <CardHeader className="pb-2">
                          <Badge className={`${step.color} text-white mb-2`}>{step.phase}</Badge>
                          <CardTitle className="text-2xl font-bold">{step.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <p className="font-medium text-slate-700 dark:text-slate-200">{step.focus}</p>
                          <div className={`flex items-center gap-2 text-green-600 font-bold ${index % 2 === 0 ? (isRTL ? 'justify-end' : 'justify-start') : (isRTL ? 'justify-start' : 'justify-end')}`}>
                            <ArrowUpRight className="w-4 h-4" />
                            <span>{step.result}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="z-10 w-12 h-12 rounded-full bg-white dark:bg-slate-800 border-4 border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-xl">
                      <Icon className={`w-6 h-6 ${step.color.replace('bg-', 'text-')}`} />
                    </div>

                    <div className="flex-1 hidden md:block" />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Strategic Conclusion */}
        <Card className="bg-slate-900 text-white border-none shadow-2xl relative overflow-hidden">
          <div className={`absolute top-0 ${isRTL ? 'left-0' : 'right-0'} w-64 h-64 bg-primary/20 rounded-full blur-3xl ${isRTL ? '-ml-32' : '-mr-32'} -mt-32`} />
          <CardContent className="p-10 text-center relative z-10">
            <h2 className="text-3xl font-bold mb-4">{txt.strategicTransformation}</h2>
            <p className="text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
              {txt.strategicTransformationDesc}
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
