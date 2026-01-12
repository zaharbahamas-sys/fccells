import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSettings } from "@/contexts/SettingsContext";
import { 
  Wifi, 
  Activity, 
  ShieldCheck, 
  Cpu, 
  Zap,
  BarChart3,
  Globe,
  Bell,
  Smartphone,
  HardDriveDownload,
  Database,
  Satellite,
  Radio,
  AlertTriangle,
  ExternalLink,
  TrendingUp,
  Lightbulb,
  Search,
  Filter,
  Activity as ActivityIcon,
  Shield,
  Settings,
  CheckCircle,
  Terminal,
  Network,
  Plus,
  ArrowRight
} from "lucide-react";
import { TelecomGreenEnergySilhouette } from "@/components/CinematicBackgrounds";

const monitoringText = {
  en: {
    pageTitle: "Smart Monitoring & Redundancy",
    pageSubtitle: "Advanced system oversight with multi-protocol support and network resilience.",
    realTimeTelemetry: "Real-Time Telemetry",
    realTimeTelemetryDesc: "Live tracking of fuel cell status, battery SOC, and fuel levels across all sites.",
    predictiveMaintenance: "Predictive Maintenance",
    predictiveMaintenanceDesc: "AI-driven alerts identify potential issues before they cause site downtime.",
    multiChannelConnectivity: "Multi-Channel Connectivity",
    multiChannelConnectivityDesc: "Fallback mechanisms ensuring data transmission even in network-deprived areas.",
    hybridCommunicationArchitecture: "Hybrid Communication Architecture",
    whyHybridCritical: "Why Hybrid Architecture is Critical for Fuel Cells?",
    whyHybridDesc: "Unlike traditional generators, fuel cells are chemically sensitive precision instruments. Continuous data flow allows the system to balance fuel-to-oxygen ratios and manage stack temperature in real-time. A \"blind\" fuel cell cannot optimize its lifespan; hybrid communication ensures the AI-brain is always connected to the hardware-heart, regardless of local outages.",
    highSpeed: "High Speed",
    fiberOpticPrimary: "Fiber Optic (Primary)",
    fiberOpticDesc: "Utilizes the site's fiber backhaul for zero-latency, high-bandwidth telemetry. Ideal for real-time diagnostics and high-definition system monitoring where infrastructure is available.",
    mobileData: "Mobile Data",
    gsmLteStandard: "GSM / LTE (Standard)",
    gsmLteDesc: "The standard industry connection using global GSM/LTE networks. Integrated with GPS for mobile asset tracking and fleet management.",
    globalReach: "Global Reach",
    satelliteFailSafe: "Satellite (Fail-Safe)",
    satelliteDesc: "Fallback mechanism for remote off-grid sites without fiber or GSM coverage. Uses LEO satellite modules to ensure 100% uptime for critical status reports.",
    whatIfGsmDisappears: "What if GSM disappears? (Resilience Mode)",
    resilienceModeIntro: "In regions where GSM/LTE signal is unstable or completely absent, the system doesn't stop monitoring. It switches to **Resilience Mode**:",
    localBlackboxRecording: "Local Blackbox Recording:",
    localBlackboxRecordingDesc: "The controller stores up to 10 years of granular data on its internal encrypted storage.",
    satelliteFallback: "Satellite Fallback:",
    satelliteFallbackDesc: "Optional integration with Low-Earth-Orbit (LEO) satellite modules for 100% global coverage.",
    manualBatchUpload: "Manual Batch Upload:",
    manualBatchUploadDesc: "Field technicians can sync data via Bluetooth/Wi-Fi during routine site visits for historical analysis.",
    fiberOpticConnection: "Fiber Optic Connection:",
    fiberOpticConnectionDesc: "Direct integration with site fiber backhaul for zero-latency, high-bandwidth telemetry where available.",
    continuousProtection: "Continuous Protection",
    offlineFirstDesign: "Unlike standard cloud-only systems, our hardware is \"Offline-First\" by design.",
    comparisonTitle: "Comparison: DSE Gateway vs. Custom Smart Gateway",
    dseGatewayTitle: "DSE Gateway (Industry Standard)",
    legacyStyle: "Legacy Style",
    dseGatewayDesc: "Standard deep sea electronics module used for basic generator monitoring.",
    dataType: "Data Type",
    summaryAlerts: "Summary Alerts",
    protocol: "Protocol",
    proprietaryDSEWebNet: "Proprietary DSEWebNet",
    offlineStorage: "Offline Storage",
    limitedVolatile: "Limited / Volatile",
    aiAnalysis: "AI Analysis",
    notSupported: "Not Supported",
    smartFCMSGateway: "Smart FCMS Gateway",
    nextGen: "Next-Gen",
    smartGatewayDesc: "Advanced IoT controller designed specifically for fuel cell & hybrid energy assets.",
    fullTelemetry: "Full Telemetry (1s samples)",
    openProtocols: "Open SNMP / MQTT / REST",
    highCapacitySSD: "High-Capacity SSD (Years)",
    edgeAIPredictive: "Edge AI Predictive Models",
    infrastructureComparison: "Infrastructure Comparison",
    parameter: "Parameter",
    legacyDSEGate: "Legacy DSE Gate",
    noSignalOperation: "No Signal Operation",
    blindNoData: "Blind / No Data",
    resilienceModeActive: "Resilience Mode Active",
    protocolOpenness: "Protocol Openness",
    closedEcosystem: "Closed Ecosystem",
    standardOpenAPIs: "Standard Open APIs",
    monitoringCost: "Monitoring Cost",
    monthlySubscriptions: "Monthly Subscriptions",
    zeroLowOwnInfra: "Zero/Low (Own Infra)",
    seamlessIntegration: "Seamless System Integration & Connectivity",
    directControllerIntegration: "Direct Controller Integration",
    nativeCANbus: "Native CANbus (J1939)",
    nativeCANbusDesc: "Direct engine-level communication providing thousands of data points without external sensors. This is the \"nervous system\" of our fuel cells.",
    modbusTCPRTU: "Modbus TCP/RTU Gateway",
    modbusTCPRTUDesc: "Standard industrial integration allowing our fuel cells to \"talk\" directly to site inverters and rectifiers for automated load management.",
    snmpV3Security: "SNMP v3 Security",
    snmpV3SecurityDesc: "The industry standard for telecom NOCs. Our systems integrate natively with Nagios, Zabbix, and PRTG with full encryption.",
    whatMakesUsDifferent: "What Makes Us Different?",
    feature: "Feature",
    plugAndPlayRectifierSync: "Plug-and-Play Rectifier Sync",
    plugAndPlayDesc: "Unlike diesel generators that require complex external ATS and wiring, our fuel cells integrate directly with the DC bus, mimicking a battery pack.",
    switchTime: "Switch Time",
    dcInterface: "DC Interface",
    single: "Single",
    eliminatesNote: "*This eliminates the need for expensive AC transfer switches and reduces installation time by 70%.",
    controlCommunicationScenarios: "Control & Communication Scenarios",
    scenarioA: "Scenario A",
    hybridGridOptimization: "Hybrid Grid Optimization",
    hybridGridOptimizationDesc: "The system detects peak electricity rates from the grid and automatically triggers the fuel cell to take over the load, saving on power costs.",
    controlAction: "Control Action:",
    scenarioAAction: "Automated switching via Modbus TCP commands to the inverter, prioritizing fuel cell power during high-tariff periods.",
    scenarioB: "Scenario B",
    emergencyLoadShedding: "Emergency Load Shedding",
    emergencyLoadSheddingDesc: "During a severe fuel shortage or system malfunction, the gateway communicates with the NOC to prioritize critical telecom traffic.",
    scenarioBAction: "SNMP Trap triggers the site manager to disconnect non-essential loads (e.g., cooling in non-critical zones) to extend autonomy.",
    scenarioC: "Scenario C",
    predictiveHydrogenRefill: "Predictive Hydrogen Refill",
    predictiveHydrogenRefillDesc: "AI analysis of historical consumption patterns predicts a fuel outage 72 hours in advance based on current site traffic.",
    scenarioCAction: "MQTT-based automated logistics ticket creation, alerting the supply chain team to schedule a refill before the threshold is hit."
  },
  ar: {
    pageTitle: "المراقبة الذكية والتكرار",
    pageSubtitle: "إشراف متقدم على النظام مع دعم البروتوكولات المتعددة ومرونة الشبكة.",
    realTimeTelemetry: "القياس عن بُعد في الوقت الفعلي",
    realTimeTelemetryDesc: "تتبع مباشر لحالة خلايا الوقود ونسبة شحن البطارية ومستويات الوقود عبر جميع المواقع.",
    predictiveMaintenance: "الصيانة التنبؤية",
    predictiveMaintenanceDesc: "تنبيهات مدعومة بالذكاء الاصطناعي تحدد المشكلات المحتملة قبل أن تسبب توقف الموقع.",
    multiChannelConnectivity: "الاتصال متعدد القنوات",
    multiChannelConnectivityDesc: "آليات احتياطية تضمن نقل البيانات حتى في المناطق المحرومة من الشبكة.",
    hybridCommunicationArchitecture: "بنية الاتصالات الهجينة",
    whyHybridCritical: "لماذا البنية الهجينة ضرورية لخلايا الوقود؟",
    whyHybridDesc: "على عكس المولدات التقليدية، خلايا الوقود هي أدوات دقيقة حساسة كيميائياً. يسمح تدفق البيانات المستمر للنظام بموازنة نسب الوقود إلى الأكسجين وإدارة درجة حرارة المكدس في الوقت الفعلي. خلية الوقود \"العمياء\" لا يمكنها تحسين عمرها؛ الاتصال الهجين يضمن أن عقل الذكاء الاصطناعي متصل دائماً بقلب الأجهزة، بغض النظر عن الانقطاعات المحلية.",
    highSpeed: "سرعة عالية",
    fiberOpticPrimary: "الألياف الضوئية (الأساسي)",
    fiberOpticDesc: "يستخدم الوصلة الخلفية للألياف في الموقع للقياس عن بُعد بدون تأخير وعرض نطاق عالي. مثالي للتشخيص في الوقت الفعلي ومراقبة النظام عالية الدقة حيث تتوفر البنية التحتية.",
    mobileData: "بيانات الجوال",
    gsmLteStandard: "GSM / LTE (القياسي)",
    gsmLteDesc: "الاتصال القياسي في الصناعة باستخدام شبكات GSM/LTE العالمية. متكامل مع GPS لتتبع الأصول المتنقلة وإدارة الأسطول.",
    globalReach: "التغطية العالمية",
    satelliteFailSafe: "الأقمار الصناعية (الاحتياطي)",
    satelliteDesc: "آلية احتياطية للمواقع البعيدة خارج الشبكة بدون تغطية ألياف أو GSM. تستخدم وحدات أقمار صناعية LEO لضمان وقت تشغيل 100% للتقارير الحرجة.",
    whatIfGsmDisappears: "ماذا لو اختفت شبكة GSM؟ (وضع المرونة)",
    resilienceModeIntro: "في المناطق التي تكون فيها إشارة GSM/LTE غير مستقرة أو غائبة تماماً، لا يتوقف النظام عن المراقبة. ينتقل إلى **وضع المرونة**:",
    localBlackboxRecording: "تسجيل الصندوق الأسود المحلي:",
    localBlackboxRecordingDesc: "يخزن المتحكم ما يصل إلى 10 سنوات من البيانات الدقيقة على وحدة التخزين المشفرة الداخلية.",
    satelliteFallback: "الاحتياطي عبر الأقمار الصناعية:",
    satelliteFallbackDesc: "تكامل اختياري مع وحدات أقمار صناعية في المدار الأرضي المنخفض (LEO) للتغطية العالمية 100%.",
    manualBatchUpload: "التحميل اليدوي على دفعات:",
    manualBatchUploadDesc: "يمكن للفنيين الميدانيين مزامنة البيانات عبر Bluetooth/Wi-Fi أثناء زيارات الموقع الروتينية للتحليل التاريخي.",
    fiberOpticConnection: "اتصال الألياف الضوئية:",
    fiberOpticConnectionDesc: "تكامل مباشر مع الوصلة الخلفية للألياف في الموقع للقياس عن بُعد بدون تأخير وعرض نطاق عالي حيثما يتوفر.",
    continuousProtection: "الحماية المستمرة",
    offlineFirstDesign: "على عكس الأنظمة السحابية فقط، أجهزتنا مصممة \"للعمل بدون اتصال أولاً\".",
    comparisonTitle: "المقارنة: بوابة DSE مقابل البوابة الذكية المخصصة",
    dseGatewayTitle: "بوابة DSE (المعيار الصناعي)",
    legacyStyle: "النمط القديم",
    dseGatewayDesc: "وحدة إلكترونيات بحرية عميقة قياسية تستخدم لمراقبة المولدات الأساسية.",
    dataType: "نوع البيانات",
    summaryAlerts: "تنبيهات ملخصة",
    protocol: "البروتوكول",
    proprietaryDSEWebNet: "DSEWebNet خاص",
    offlineStorage: "التخزين بدون اتصال",
    limitedVolatile: "محدود / متقلب",
    aiAnalysis: "تحليل الذكاء الاصطناعي",
    notSupported: "غير مدعوم",
    smartFCMSGateway: "بوابة FCMS الذكية",
    nextGen: "الجيل القادم",
    smartGatewayDesc: "متحكم IoT متقدم مصمم خصيصاً لأصول خلايا الوقود والطاقة الهجينة.",
    fullTelemetry: "قياس كامل (عينات كل ثانية)",
    openProtocols: "SNMP / MQTT / REST مفتوح",
    highCapacitySSD: "SSD عالي السعة (سنوات)",
    edgeAIPredictive: "نماذج تنبؤية بالذكاء الاصطناعي الحافي",
    infrastructureComparison: "مقارنة البنية التحتية",
    parameter: "المعلمة",
    legacyDSEGate: "بوابة DSE القديمة",
    noSignalOperation: "التشغيل بدون إشارة",
    blindNoData: "أعمى / بدون بيانات",
    resilienceModeActive: "وضع المرونة نشط",
    protocolOpenness: "انفتاح البروتوكول",
    closedEcosystem: "نظام بيئي مغلق",
    standardOpenAPIs: "واجهات برمجة مفتوحة قياسية",
    monitoringCost: "تكلفة المراقبة",
    monthlySubscriptions: "اشتراكات شهرية",
    zeroLowOwnInfra: "صفر/منخفض (بنية تحتية خاصة)",
    seamlessIntegration: "التكامل السلس للنظام والاتصال",
    directControllerIntegration: "تكامل المتحكم المباشر",
    nativeCANbus: "CANbus الأصلي (J1939)",
    nativeCANbusDesc: "اتصال مباشر على مستوى المحرك يوفر آلاف نقاط البيانات بدون مستشعرات خارجية. هذا هو \"الجهاز العصبي\" لخلايا الوقود لدينا.",
    modbusTCPRTU: "بوابة Modbus TCP/RTU",
    modbusTCPRTUDesc: "تكامل صناعي قياسي يسمح لخلايا الوقود لدينا \"بالتحدث\" مباشرة مع محولات الموقع والمقومات لإدارة الحمل الآلي.",
    snmpV3Security: "أمان SNMP v3",
    snmpV3SecurityDesc: "المعيار الصناعي لمراكز عمليات الشبكة للاتصالات. تتكامل أنظمتنا بشكل أصلي مع Nagios وZabbix وPRTG مع تشفير كامل.",
    whatMakesUsDifferent: "ما الذي يميزنا؟",
    feature: "ميزة",
    plugAndPlayRectifierSync: "مزامنة المقوم التوصيل والتشغيل",
    plugAndPlayDesc: "على عكس مولدات الديزل التي تتطلب ATS خارجي معقد وتوصيلات، تتكامل خلايا الوقود لدينا مباشرة مع ناقل التيار المستمر، محاكية حزمة البطارية.",
    switchTime: "وقت التبديل",
    dcInterface: "واجهة التيار المستمر",
    single: "واحدة",
    eliminatesNote: "*هذا يلغي الحاجة إلى مفاتيح نقل التيار المتردد المكلفة ويقلل وقت التركيب بنسبة 70%.",
    controlCommunicationScenarios: "سيناريوهات التحكم والاتصال",
    scenarioA: "السيناريو أ",
    hybridGridOptimization: "تحسين الشبكة الهجينة",
    hybridGridOptimizationDesc: "يكتشف النظام معدلات الكهرباء القصوى من الشبكة ويطلق تلقائياً خلية الوقود لتحمل الحمل، مما يوفر تكاليف الطاقة.",
    controlAction: "إجراء التحكم:",
    scenarioAAction: "التبديل الآلي عبر أوامر Modbus TCP للمحول، مع إعطاء الأولوية لطاقة خلايا الوقود خلال فترات التعريفة العالية.",
    scenarioB: "السيناريو ب",
    emergencyLoadShedding: "تخفيف الحمل الطارئ",
    emergencyLoadSheddingDesc: "أثناء نقص حاد في الوقود أو عطل في النظام، تتواصل البوابة مع مركز عمليات الشبكة لإعطاء الأولوية لحركة الاتصالات الحرجة.",
    scenarioBAction: "يطلق SNMP Trap مدير الموقع لفصل الأحمال غير الأساسية (مثل التبريد في المناطق غير الحرجة) لتمديد الاستقلالية.",
    scenarioC: "السيناريو ج",
    predictiveHydrogenRefill: "إعادة تعبئة الهيدروجين التنبؤية",
    predictiveHydrogenRefillDesc: "يتنبأ تحليل الذكاء الاصطناعي لأنماط الاستهلاك التاريخية بانقطاع الوقود قبل 72 ساعة بناءً على حركة الموقع الحالية.",
    scenarioCAction: "إنشاء تذكرة لوجستية آلية قائمة على MQTT، لتنبيه فريق سلسلة التوريد لجدولة إعادة التعبئة قبل الوصول إلى الحد الأدنى."
  }
};

export default function RemoteMonitoring() {
  const { language, isRTL } = useSettings();
  const txt = monitoringText[language];

  const monitoringFeatures = [
    {
      title: txt.realTimeTelemetry,
      description: txt.realTimeTelemetryDesc,
      icon: Activity,
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
      title: txt.predictiveMaintenance,
      description: txt.predictiveMaintenanceDesc,
      icon: ShieldCheck,
      color: "text-emerald-500",
      bg: "bg-emerald-50 dark:bg-emerald-900/20"
    },
    {
      title: txt.multiChannelConnectivity,
      description: txt.multiChannelConnectivityDesc,
      icon: Radio,
      color: "text-purple-500",
      bg: "bg-purple-50 dark:bg-purple-900/20"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex relative overflow-hidden" dir={isRTL ? "rtl" : "ltr"}>
      <TelecomGreenEnergySilhouette />
      <Sidebar />
      <main className={`flex-1 ${isRTL ? 'lg:mr-20' : 'lg:ml-20'} relative z-10`}>
        <header className="bg-slate-900 text-white p-8 lg:p-12 border-b border-primary/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-[160px] translate-x-1/2 -translate-y-1/2" />
          </div>
          
          <div className="relative z-10 max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-10">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary rounded-xl text-white shadow-lg shadow-primary/20">
                    <Wifi className="w-8 h-8" />
                  </div>
                  <h1 className="text-4xl font-black tracking-tight">{txt.pageTitle}</h1>
                </div>
                <p className="text-xl text-slate-400 max-w-2xl font-medium">
                  {txt.pageSubtitle}
                </p>
              </div>

              <div className="flex flex-wrap lg:flex-nowrap gap-4">
                {monitoringFeatures.map((feature, idx) => {
                  const Icon = feature.icon;
                  return (
                    <div key={idx} className="flex-1 min-w-[200px] bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl hover:bg-white/10 transition-colors">
                      <div className={`w-10 h-10 ${feature.bg} rounded-xl flex items-center justify-center mb-3`}>
                        <Icon className={`w-5 h-5 ${feature.color}`} />
                      </div>
                      <h3 className="font-bold text-sm mb-1">{feature.title}</h3>
                      <p className="text-[11px] text-slate-400 leading-tight">
                        {feature.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-8 max-w-7xl mx-auto">
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
              <Radio className="w-6 h-6 text-primary" />
              {txt.hybridCommunicationArchitecture}
            </h2>
            
            <div className="mb-8 p-6 bg-slate-900 text-slate-100 rounded-2xl shadow-xl border border-slate-800 relative overflow-hidden">
              <div className={`absolute top-0 ${isRTL ? 'left-0' : 'right-0'} w-32 h-32 bg-primary/20 rounded-full blur-3xl ${isRTL ? '-ml-16' : '-mr-16'} -mt-16`} />
              <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center">
                <div className="p-4 bg-primary/20 rounded-xl">
                  <Lightbulb className="w-8 h-8 text-primary" />
                </div>
                <div className={`space-y-2 text-center ${isRTL ? 'md:text-right' : 'md:text-left'}`}>
                  <h3 className="text-lg font-bold">{txt.whyHybridCritical}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed max-w-3xl">
                    {txt.whyHybridDesc}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-none shadow-md bg-white dark:bg-slate-800">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 text-primary mb-1">
                    <Zap className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-wider">{txt.highSpeed}</span>
                  </div>
                  <CardTitle className="text-xl">{txt.fiberOpticPrimary}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-slate-600 dark:text-slate-400">
                  {txt.fiberOpticDesc}
                </CardContent>
              </Card>

              <Card className="border-none shadow-md bg-white dark:bg-slate-800">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 text-blue-500 mb-1">
                    <Smartphone className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-wider">{txt.mobileData}</span>
                  </div>
                  <CardTitle className="text-xl">{txt.gsmLteStandard}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-slate-600 dark:text-slate-400">
                  {txt.gsmLteDesc}
                </CardContent>
              </Card>

              <Card className="border-none shadow-md bg-white dark:bg-slate-800">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 text-purple-500 mb-1">
                    <Satellite className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-wider">{txt.globalReach}</span>
                  </div>
                  <CardTitle className="text-xl">{txt.satelliteFailSafe}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-slate-600 dark:text-slate-400">
                  {txt.satelliteDesc}
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="mb-12">
            <div className={`bg-amber-50 dark:bg-amber-950/20 ${isRTL ? 'border-r-4' : 'border-l-4'} border-amber-500 p-6 ${isRTL ? 'rounded-l-xl' : 'rounded-r-xl'}`}>
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
                <h2 className="text-xl font-bold text-amber-900 dark:text-amber-100 italic">
                  {txt.whatIfGsmDisappears}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                    {txt.resilienceModeIntro}
                  </p>
                  <ul className="space-y-3">
                    <li className="flex gap-3 text-sm">
                      <HardDriveDownload className="w-5 h-5 text-amber-600 shrink-0" />
                      <span><strong>{txt.localBlackboxRecording}</strong> {txt.localBlackboxRecordingDesc}</span>
                    </li>
                    <li className="flex gap-3 text-sm">
                      <Satellite className="w-5 h-5 text-amber-600 shrink-0" />
                      <span><strong>{txt.satelliteFallback}</strong> {txt.satelliteFallbackDesc}</span>
                    </li>
                    <li className="flex gap-3 text-sm">
                      <Database className="w-5 h-5 text-amber-600 shrink-0" />
                      <span><strong>{txt.manualBatchUpload}</strong> {txt.manualBatchUploadDesc}</span>
                    </li>
                    <li className="flex gap-3 text-sm">
                      <Zap className="w-5 h-5 text-primary shrink-0" />
                      <span><strong>{txt.fiberOpticConnection}</strong> {txt.fiberOpticConnectionDesc}</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-amber-100 dark:border-amber-900 shadow-sm self-center">
                  <div className="text-center space-y-2">
                    <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Radio className="w-8 h-8 text-amber-600 animate-pulse" />
                    </div>
                    <h4 className="font-bold">{txt.continuousProtection}</h4>
                    <p className="text-xs text-slate-500">{txt.offlineFirstDesign}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
              <Cpu className="w-6 h-6 text-primary" />
              {txt.comparisonTitle}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-slate-200 dark:border-slate-800">
                <CardHeader className="bg-slate-100 dark:bg-slate-800/50">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">{txt.dseGatewayTitle}</CardTitle>
                    <Badge variant="outline">{txt.legacyStyle}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400">{txt.dseGatewayDesc}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs py-2 border-b">
                      <span>{txt.dataType}</span>
                      <span className="font-medium">{txt.summaryAlerts}</span>
                    </div>
                    <div className="flex justify-between text-xs py-2 border-b">
                      <span>{txt.protocol}</span>
                      <span className="font-medium">{txt.proprietaryDSEWebNet}</span>
                    </div>
                    <div className="flex justify-between text-xs py-2 border-b">
                      <span>{txt.offlineStorage}</span>
                      <span className="font-medium text-amber-600">{txt.limitedVolatile}</span>
                    </div>
                    <div className="flex justify-between text-xs py-2">
                      <span>{txt.aiAnalysis}</span>
                      <span className="font-medium text-red-500 text-[10px] uppercase">{txt.notSupported}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary/50 bg-primary/5">
                <CardHeader className="bg-primary/10">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg text-primary">{txt.smartFCMSGateway}</CardTitle>
                    <Badge className="bg-primary text-white">{txt.nextGen}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">{txt.smartGatewayDesc}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs py-2 border-b border-primary/10">
                      <span>{txt.dataType}</span>
                      <span className="font-medium text-primary">{txt.fullTelemetry}</span>
                    </div>
                    <div className="flex justify-between text-xs py-2 border-b border-primary/10">
                      <span>{txt.protocol}</span>
                      <span className="font-medium text-primary">{txt.openProtocols}</span>
                    </div>
                    <div className="flex justify-between text-xs py-2 border-b border-primary/10">
                      <span>{txt.offlineStorage}</span>
                      <span className="font-medium text-primary">{txt.highCapacitySSD}</span>
                    </div>
                    <div className="flex justify-between text-xs py-2">
                      <span>{txt.aiAnalysis}</span>
                      <span className="font-medium text-emerald-600 text-[10px] uppercase font-bold">{txt.edgeAIPredictive}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              {txt.infrastructureComparison}
            </h2>
            <div className="overflow-x-auto">
              <table className={`w-full ${isRTL ? 'text-right' : 'text-left'} border-collapse`}>
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <th className="py-4 font-bold text-slate-400 text-sm">{txt.parameter}</th>
                    <th className="py-4 font-bold text-slate-400 text-sm">{txt.legacyDSEGate}</th>
                    <th className="py-4 font-bold text-slate-900 dark:text-white text-sm">{txt.smartFCMSGateway}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-100 dark:border-slate-800/50">
                    <td className="py-4 font-medium text-sm">{txt.noSignalOperation}</td>
                    <td className="py-4 text-slate-500 text-sm">{txt.blindNoData}</td>
                    <td className="py-4 text-emerald-600 font-bold text-sm italic">{txt.resilienceModeActive}</td>
                  </tr>
                  <tr className="border-b border-slate-100 dark:border-slate-800/50">
                    <td className="py-4 font-medium text-sm">{txt.protocolOpenness}</td>
                    <td className="py-4 text-slate-500 text-sm">{txt.closedEcosystem}</td>
                    <td className="py-4 text-blue-600 font-bold text-sm">{txt.standardOpenAPIs}</td>
                  </tr>
                  <tr>
                    <td className="py-4 font-medium text-sm">{txt.monitoringCost}</td>
                    <td className="py-4 text-slate-500 text-sm">{txt.monthlySubscriptions}</td>
                    <td className="py-4 text-emerald-600 font-bold text-sm">{txt.zeroLowOwnInfra}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
              <Zap className="w-6 h-6 text-primary" />
              {txt.seamlessIntegration}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white border-b pb-2">{txt.directControllerIntegration}</h3>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                      <Cpu className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{txt.nativeCANbus}</h4>
                      <p className="text-xs text-slate-500">{txt.nativeCANbusDesc}</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center shrink-0">
                      <Database className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{txt.modbusTCPRTU}</h4>
                      <p className="text-xs text-slate-500">{txt.modbusTCPRTUDesc}</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{txt.snmpV3Security}</h4>
                      <p className="text-xs text-slate-500">{txt.snmpV3SecurityDesc}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white border-b pb-2">{txt.whatMakesUsDifferent}</h3>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
                  <div className="flex items-center gap-3">
                    <Badge className="bg-emerald-500 text-white">{txt.feature}</Badge>
                    <h4 className="font-bold">{txt.plugAndPlayRectifierSync}</h4>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {txt.plugAndPlayDesc}
                  </p>
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="text-center p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                      <p className="text-xl font-bold text-primary">0 ms</p>
                      <p className="text-[10px] uppercase text-slate-500">{txt.switchTime}</p>
                    </div>
                    <div className="text-center p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                      <p className="text-xl font-bold text-primary">{txt.single}</p>
                      <p className="text-[10px] uppercase text-slate-500">{txt.dcInterface}</p>
                    </div>
                  </div>
                  <p className="text-[11px] italic text-slate-500">
                    {txt.eliminatesNote}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
              <Activity className="w-6 h-6 text-primary" />
              {txt.controlCommunicationScenarios}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-none shadow-md bg-white dark:bg-slate-800">
                <CardHeader className="bg-slate-50 dark:bg-slate-800/50 pb-4">
                  <div className="flex items-center gap-2 text-primary mb-1">
                    <Zap className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-wider">{txt.scenarioA}</span>
                  </div>
                  <CardTitle className="text-xl">{txt.hybridGridOptimization}</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {txt.hybridGridOptimizationDesc}
                  </p>
                  <div className={`p-3 bg-primary/5 rounded-lg ${isRTL ? 'border-r-4' : 'border-l-4'} border-primary`}>
                    <h5 className="text-xs font-bold text-primary mb-1">{txt.controlAction}</h5>
                    <p className="text-[11px] leading-relaxed">{txt.scenarioAAction}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md bg-white dark:bg-slate-800">
                <CardHeader className="bg-slate-50 dark:bg-slate-800/50 pb-4">
                  <div className="flex items-center gap-2 text-orange-500 mb-1">
                    <AlertTriangle className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-wider">{txt.scenarioB}</span>
                  </div>
                  <CardTitle className="text-xl">{txt.emergencyLoadShedding}</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {txt.emergencyLoadSheddingDesc}
                  </p>
                  <div className={`p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg ${isRTL ? 'border-r-4' : 'border-l-4'} border-orange-500`}>
                    <h5 className="text-xs font-bold text-orange-600 mb-1">{txt.controlAction}</h5>
                    <p className="text-[11px] leading-relaxed">{txt.scenarioBAction}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md bg-white dark:bg-slate-800">
                <CardHeader className="bg-slate-50 dark:bg-slate-800/50 pb-4">
                  <div className="flex items-center gap-2 text-emerald-500 mb-1">
                    <Activity className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-wider">{txt.scenarioC}</span>
                  </div>
                  <CardTitle className="text-xl">{txt.predictiveHydrogenRefill}</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {txt.predictiveHydrogenRefillDesc}
                  </p>
                  <div className={`p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg ${isRTL ? 'border-r-4' : 'border-l-4'} border-emerald-500`}>
                    <h5 className="text-xs font-bold text-emerald-600 mb-1">{txt.controlAction}</h5>
                    <p className="text-[11px] leading-relaxed">{txt.scenarioCAction}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
