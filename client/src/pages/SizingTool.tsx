import { Sidebar } from "@/components/Sidebar";
import { FloatingContactButton } from "@/components/ContactComments";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFuelCells } from "@/hooks/use-fuel-cells";
import { useCreateProject } from "@/hooks/use-projects";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useSettings } from "@/contexts/SettingsContext";
import { TelecomReference, type SiteTemplate } from "@/components/TelecomReference";
import { TelecomGreenEnergySilhouette } from "@/components/CinematicBackgrounds";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Loader2, Calculator, Save, Thermometer, MapPin, 
  Fuel, Battery, Cable, TrendingUp, Leaf, Package,
  AlertTriangle, CheckCircle2, Zap, DollarSign,
  FileDown, Sparkles, Network, ChevronDown, BookOpen
} from "lucide-react";
import { useState, useEffect } from "react";
import { usePythonServices, type AITaskType, type AILanguage } from "@/hooks/use-python-services";
import { GuidedTour } from "@/components/GuidedTour";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useLocation } from "wouter";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import type { CalculationResponse } from "@shared/schema";

const formSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
  loadKw: z.number().min(0.1),
  maxTemperature: z.number().min(-20).max(60),
  altitude: z.number().min(0).max(5000),
  fuelCellId: z.number(),
  autonomyHours: z.number().min(1),
  hoursPerYear: z.number().min(1),
  dgCapacityKva: z.number().min(1),
  dieselPrice: z.number().min(0),
  pilferageFactor: z.number().min(0).max(50),
  dgCapex: z.number().min(0),
  h2Price: z.number().min(0),
  logisticsCostPct: z.number().min(0).max(50),
  batteryBufferHours: z.number().min(1).max(24),
  batteryDod: z.number().min(0.5).max(1),
  systemVoltage: z.number(),
  refuelingCycleDays: z.number().min(1).max(60),
});

type FormData = z.infer<typeof formSchema>;

export default function SizingTool() {
  const { data: fuelCells } = useFuelCells();
  const createProjectMutation = useCreateProject();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [results, setResults] = useState<CalculationResponse | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [aiTaskType, setAiTaskType] = useState<AITaskType>('analysis');
  const [aiLanguage, setAiLanguage] = useState<AILanguage>('english');
  const [referenceOpen, setReferenceOpen] = useState(false);
  const { generatePDF, generateCSV, analyzeSystem, generateDiagram, isLoading: pythonLoading } = usePythonServices();
  const { settings, formatCurrency, language, isRTL } = useSettings();
  const { calculationDefaults } = settings;

  const sizingText = {
    en: {
      pageTitle: "EcoPower Engineering Tool",
      pageSubtitle: "Techno-Economic Analysis: Diesel Gen vs. Fuel Cell",
      modeBadge: "Mode: Real-World Engineering",
      telecomReference: "Telecom Site Reference Data (GSMA, Huawei Africa Studies)",
      siteConstraints: "Site Constraints",
      projectName: "Project Name",
      projectNamePlaceholder: "Site ID...",
      maxTemp: "Max Temp",
      celsius: "Celsius",
      altitude: "Altitude",
      meters: "meters",
      loadProfile: "Load Profile",
      criticalLoad: "Critical IT Load",
      autonomyRequired: "Autonomy Required",
      hrs: "hrs",
      fuelCellModel: "Fuel Cell Model",
      selectModel: "Select model...",
      dieselGenInfo: "Diesel Generator Info",
      capacityKva: "Capacity (kVA)",
      dieselPrice: "Diesel $/L",
      theftLossFactor: "Theft/Loss Factor",
      fuelPilferageLosses: "Fuel pilferage/logistic losses",
      hydrogenPrice: "Hydrogen Price ($/kg)",
      calculateAnalysis: "Calculate Analysis",
      configureInputs: "Configure inputs and click Calculate",
      dgVsFc: "DG vs FC",
      sizing: "Sizing",
      battery: "Battery",
      logistics: "Logistics",
      existingDieselGen: "Existing Diesel Generator",
      loadFactor: "Load Factor",
      lowEfficiency: "Low Efficiency",
      engineConsumption: "Engine Consumption",
      theftLossOverhead: "+ Theft/Loss Overhead",
      dailyOpex: "Daily OPEX",
      proposedFuelCell: "Proposed Fuel Cell",
      systemEfficiency: "System Efficiency",
      fuelConsumption: "Fuel Consumption",
      theftRisk: "Theft Risk",
      cannotSiphon: "0% (Cannot siphon)",
      dailySavings: "Daily Savings",
      annualSavings: "Annual Savings",
      paybackPeriod: "Payback Period",
      dgBetter: "DG Better",
      co2Avoided: "CO2 Avoided",
      multipleStacksConfig: "Multiple Stacks Configuration",
      multipleStacksDesc: "A single fuel cell cannot meet the load. The system is configured for multiple units.",
      perUnitDerated: "Per Unit (Derated)",
      unitsRequired: "Units Required",
      totalDerated: "Total Derated",
      capacityWarning: "Capacity Warning: System Undersized",
      capacityWarningDesc: "Even with multiple stacks, the total derated capacity cannot meet the required load. Consider a larger fuel cell model.",
      capacityShortfall: "Capacity Shortfall",
      engineeringSizing: "Engineering Sizing & Losses",
      fuelCellRated: "Fuel Cell Rated",
      totalFcCapacity: "Total FC Capacity",
      siteLoad: "Site Load",
      margin: "Margin",
      parasiticLoss: "Parasitic Loss",
      fansPumps: "(Fans/Pumps)",
      tempDerating: "Temp Derating",
      cableSize: "Cable Size",
      dailyFuel: "Daily Fuel",
      hybridBatteryBuffer: "Hybrid Battery Buffer",
      batteryBufferDesc: "Required to cover startup time and peak loads",
      capacity: "Capacity",
      ampHours: "Amp Hours",
      configuration: "Configuration",
      stringsOf: "Strings of 150Ah",
      logisticsPlanning: "Logistics Planning",
      hydrogenSupply: "Hydrogen supply for",
      daysAutonomy: "days autonomy",
      totalH2Required: "Total H2 Required",
      cylinders: "Cylinders (50L @ 200bar)",
      units: "Units",
      bundles: "Bundles (12-Pack)",
      bundlesLabel: "Bundles",
      saveProject: "Save Project",
      downloadPdf: "PDF",
      downloadCsv: "CSV",
      downloadDiagram: "Diagram",
      aiConsultant: "AI Consultant",
      analysisType: "Analysis Type",
      engineeringAnalysis: "Engineering Analysis",
      managerEmail: "Manager Email",
      actionPlan: "Action Plan",
      languageLabel: "Language",
      english: "English",
      arabic: "Arabic",
      generateAiAnalysis: "Generate AI Analysis",
      aiPoweredAnalysis: "AI-Powered Analysis",
      calculationComplete: "Calculation Complete",
      resultsUpdated: "Results updated successfully",
      error: "Error",
      calculationFailed: "Calculation failed",
      required: "Required",
      selectFuelCell: "Please select a fuel cell model",
      enterProjectName: "Please enter a project name",
      success: "Success",
      projectSaved: "Project saved!",
      calculationRequired: "Calculation Required",
      selectFuelCellFirst: "Please select a fuel cell and run calculations before downloading the report",
      pdfDownloaded: "PDF Downloaded",
      reportSaved: "Report saved to your downloads",
      pdfFailed: "PDF generation failed",
      aiAnalysisComplete: "AI Analysis Complete",
      scrollForRecommendations: "Scroll down to see recommendations",
      basicAnalysis: "Basic Analysis",
      aiFallback: "AI not configured - showing fallback recommendations",
      diagramDownloaded: "Diagram Downloaded",
      systemDiagramSaved: "System diagram saved",
      diagramFailed: "Diagram generation failed",
      csvDownloaded: "CSV Downloaded",
      dataExported: "Data exported to CSV",
      csvFailed: "CSV export failed",
      templateApplied: "Template Applied",
    },
    ar: {
      pageTitle: "أداة هندسة الطاقة البيئية",
      pageSubtitle: "التحليل التقني-الاقتصادي: المولد الديزل مقابل خلية الوقود",
      modeBadge: "الوضع: الهندسة الواقعية",
      telecomReference: "بيانات مرجع موقع الاتصالات (GSMA، دراسات هواوي أفريقيا)",
      siteConstraints: "قيود الموقع",
      projectName: "اسم المشروع",
      projectNamePlaceholder: "معرف الموقع...",
      maxTemp: "أقصى درجة حرارة",
      celsius: "درجة مئوية",
      altitude: "الارتفاع",
      meters: "متر",
      loadProfile: "ملف الحمل",
      criticalLoad: "حمل تقنية المعلومات الحرج",
      autonomyRequired: "الاستقلالية المطلوبة",
      hrs: "ساعة",
      fuelCellModel: "موديل خلية الوقود",
      selectModel: "اختر الموديل...",
      dieselGenInfo: "معلومات مولد الديزل",
      capacityKva: "السعة (ك.ف.أ)",
      dieselPrice: "سعر الديزل $/لتر",
      theftLossFactor: "عامل السرقة/الخسارة",
      fuelPilferageLosses: "سرقة الوقود/خسائر النقل",
      hydrogenPrice: "سعر الهيدروجين ($/كجم)",
      calculateAnalysis: "حساب التحليل",
      configureInputs: "أدخل البيانات واضغط حساب",
      dgVsFc: "المولد مقابل خلية الوقود",
      sizing: "التحجيم",
      battery: "البطارية",
      logistics: "اللوجستيات",
      existingDieselGen: "مولد الديزل الحالي",
      loadFactor: "عامل الحمل",
      lowEfficiency: "كفاءة منخفضة",
      engineConsumption: "استهلاك المحرك",
      theftLossOverhead: "+ زيادة السرقة/الخسارة",
      dailyOpex: "التكلفة التشغيلية اليومية",
      proposedFuelCell: "خلية الوقود المقترحة",
      systemEfficiency: "كفاءة النظام",
      fuelConsumption: "استهلاك الوقود",
      theftRisk: "مخاطر السرقة",
      cannotSiphon: "0% (لا يمكن سرقته)",
      dailySavings: "التوفير اليومي",
      annualSavings: "التوفير السنوي",
      paybackPeriod: "فترة الاسترداد",
      dgBetter: "الديزل أفضل",
      co2Avoided: "ثاني أكسيد الكربون المتجنب",
      multipleStacksConfig: "تكوين المكدسات المتعددة",
      multipleStacksDesc: "خلية وقود واحدة لا تكفي للحمل. تم تكوين النظام لوحدات متعددة.",
      perUnitDerated: "لكل وحدة (مخفضة)",
      unitsRequired: "الوحدات المطلوبة",
      totalDerated: "إجمالي مخفض",
      capacityWarning: "تحذير السعة: النظام أصغر من المطلوب",
      capacityWarningDesc: "حتى مع المكدسات المتعددة، السعة الإجمالية المخفضة لا تكفي للحمل المطلوب. فكر في موديل خلية وقود أكبر.",
      capacityShortfall: "نقص السعة",
      engineeringSizing: "التحجيم الهندسي والخسائر",
      fuelCellRated: "قدرة خلية الوقود",
      totalFcCapacity: "إجمالي سعة خلايا الوقود",
      siteLoad: "حمل الموقع",
      margin: "الهامش",
      parasiticLoss: "الخسارة الطفيلية",
      fansPumps: "(المراوح/المضخات)",
      tempDerating: "خفض الحرارة",
      cableSize: "مقاس الكابل",
      dailyFuel: "الوقود اليومي",
      hybridBatteryBuffer: "مخزن البطارية الهجين",
      batteryBufferDesc: "مطلوب لتغطية وقت البدء والأحمال القصوى",
      capacity: "السعة",
      ampHours: "أمبير ساعة",
      configuration: "التكوين",
      stringsOf: "سلاسل من 150Ah",
      logisticsPlanning: "تخطيط اللوجستيات",
      hydrogenSupply: "إمداد الهيدروجين لمدة",
      daysAutonomy: "أيام استقلالية",
      totalH2Required: "إجمالي الهيدروجين المطلوب",
      cylinders: "الأسطوانات (50 لتر @ 200 بار)",
      units: "وحدات",
      bundles: "الحزم (12 وحدة)",
      bundlesLabel: "حزم",
      saveProject: "حفظ المشروع",
      downloadPdf: "PDF",
      downloadCsv: "CSV",
      downloadDiagram: "المخطط",
      aiConsultant: "مستشار الذكاء الاصطناعي",
      analysisType: "نوع التحليل",
      engineeringAnalysis: "التحليل الهندسي",
      managerEmail: "بريد المدير",
      actionPlan: "خطة العمل",
      languageLabel: "اللغة",
      english: "الإنجليزية",
      arabic: "العربية",
      generateAiAnalysis: "توليد تحليل الذكاء الاصطناعي",
      aiPoweredAnalysis: "تحليل مدعوم بالذكاء الاصطناعي",
      calculationComplete: "اكتمل الحساب",
      resultsUpdated: "تم تحديث النتائج بنجاح",
      error: "خطأ",
      calculationFailed: "فشل الحساب",
      required: "مطلوب",
      selectFuelCell: "يرجى اختيار موديل خلية الوقود",
      enterProjectName: "يرجى إدخال اسم المشروع",
      success: "نجاح",
      projectSaved: "تم حفظ المشروع!",
      calculationRequired: "الحساب مطلوب",
      selectFuelCellFirst: "يرجى اختيار خلية وقود وتشغيل الحسابات قبل تنزيل التقرير",
      pdfDownloaded: "تم تنزيل PDF",
      reportSaved: "تم حفظ التقرير في التنزيلات",
      pdfFailed: "فشل إنشاء PDF",
      aiAnalysisComplete: "اكتمل تحليل الذكاء الاصطناعي",
      scrollForRecommendations: "انتقل لأسفل لرؤية التوصيات",
      basicAnalysis: "تحليل أساسي",
      aiFallback: "الذكاء الاصطناعي غير مهيأ - عرض توصيات احتياطية",
      diagramDownloaded: "تم تنزيل المخطط",
      systemDiagramSaved: "تم حفظ مخطط النظام",
      diagramFailed: "فشل إنشاء المخطط",
      csvDownloaded: "تم تنزيل CSV",
      dataExported: "تم تصدير البيانات إلى CSV",
      csvFailed: "فشل تصدير CSV",
      templateApplied: "تم تطبيق القالب",
    }
  };

  const txt = sizingText[language];

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      loadKw: 4,
      maxTemperature: calculationDefaults.defaultDeratingTemp,
      altitude: calculationDefaults.defaultAltitude,
      fuelCellId: undefined,
      autonomyHours: calculationDefaults.defaultAutonomyHours,
      hoursPerYear: 2000,
      dgCapacityKva: calculationDefaults.defaultDgCapacity,
      dieselPrice: calculationDefaults.defaultDieselPrice,
      pilferageFactor: calculationDefaults.defaultPilferageFactor,
      dgCapex: 5000,
      h2Price: calculationDefaults.defaultH2Price,
      logisticsCostPct: calculationDefaults.defaultLogisticsCost,
      batteryBufferHours: calculationDefaults.defaultBatteryBufferHours,
      batteryDod: calculationDefaults.defaultBatteryDod / 100,
      systemVoltage: calculationDefaults.defaultSystemVoltage,
      refuelingCycleDays: calculationDefaults.defaultRefuelingCycleDays,
    }
  });

  useEffect(() => {
    const currentValues = form.getValues();
    if (!currentValues.name && !results) {
      form.reset({
        ...currentValues,
        maxTemperature: calculationDefaults.defaultDeratingTemp,
        altitude: calculationDefaults.defaultAltitude,
        autonomyHours: calculationDefaults.defaultAutonomyHours,
        dgCapacityKva: calculationDefaults.defaultDgCapacity,
        dieselPrice: calculationDefaults.defaultDieselPrice,
        pilferageFactor: calculationDefaults.defaultPilferageFactor,
        h2Price: calculationDefaults.defaultH2Price,
        logisticsCostPct: calculationDefaults.defaultLogisticsCost,
        batteryBufferHours: calculationDefaults.defaultBatteryBufferHours,
        batteryDod: calculationDefaults.defaultBatteryDod / 100,
        systemVoltage: calculationDefaults.defaultSystemVoltage,
        refuelingCycleDays: calculationDefaults.defaultRefuelingCycleDays,
      });
    }
  }, [calculationDefaults, form, results]);

  const calculateMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await apiRequest("POST", "/api/calculate", {
        loadKw: data.loadKw,
        maxTemperature: data.maxTemperature,
        altitude: data.altitude,
        fuelCellId: data.fuelCellId,
        autonomyHours: data.autonomyHours,
        hoursPerYear: data.hoursPerYear,
        dgCapacityKva: data.dgCapacityKva,
        dieselPrice: data.dieselPrice,
        pilferageFactor: data.pilferageFactor,
        dgCapex: data.dgCapex,
        h2Price: data.h2Price,
        logisticsCostPct: data.logisticsCostPct,
        batteryBufferHours: data.batteryBufferHours,
        batteryDod: data.batteryDod,
        systemVoltage: data.systemVoltage,
        refuelingCycleDays: data.refuelingCycleDays,
      });
      return res.json() as Promise<CalculationResponse>;
    },
    onSuccess: (data) => {
      setResults(data);
      toast({ title: txt.calculationComplete, description: txt.resultsUpdated });
    },
    onError: () => {
      toast({ title: txt.error, description: txt.calculationFailed, variant: "destructive" });
    }
  });

  const handleCalculate = () => {
    const data = form.getValues();
    if (!data.fuelCellId) {
      toast({ title: txt.required, description: txt.selectFuelCell, variant: "destructive" });
      return;
    }
    calculateMutation.mutate(data);
  };

  const handleSave = () => {
    const data = form.getValues();
    if (!data.name) {
      toast({ title: txt.required, description: txt.enterProjectName, variant: "destructive" });
      return;
    }
    createProjectMutation.mutate({
      name: data.name,
      description: data.description,
      loadKw: data.loadKw,
      maxTemperature: data.maxTemperature,
      altitude: data.altitude,
      autonomyHours: data.autonomyHours,
      hoursPerYear: data.hoursPerYear,
      dgCapacityKva: data.dgCapacityKva,
      dieselPrice: data.dieselPrice,
      pilferageFactor: data.pilferageFactor,
      dgCapex: data.dgCapex,
      h2Price: data.h2Price,
      logisticsCostPct: data.logisticsCostPct,
      batteryBufferHours: data.batteryBufferHours,
      batteryDod: data.batteryDod,
      systemVoltage: data.systemVoltage,
      refuelingCycleDays: data.refuelingCycleDays,
      selectedFuelCellId: data.fuelCellId,
      requiredBatteryKwh: results?.batteryCapacityKwh,
      requiredBatteryAh: results?.batteryCapacityAh,
      dailyFuelConsumption: results?.fuelConsumptionDaily,
      recommendedCableSizeMm2: results?.cableSizeMm2,
      deratingFactor: results?.deratingFactor,
      grossPowerRequired: results?.grossPowerRequired,
      parasiticLossKw: results?.parasiticLossKw,
      dailyCostDg: results?.dgDailyCost,
      dailyCostFc: results?.fcDailyCost,
      dailySavings: results?.dailySavings,
      annualSavings: results?.annualSavings,
      paybackYears: results?.paybackYears,
      co2Savings: results?.co2Savings,
      cylindersRequired: results?.cylindersRequired,
      bundlesRequired: results?.bundlesRequired,
    } as any, {
      onSuccess: () => {
        toast({ title: txt.success, description: txt.projectSaved });
        setLocation("/");
      }
    });
  };

  const handleDownloadPDF = async () => {
    const data = form.getValues();
    if (!selectedFc || !results) {
      toast({ 
        title: txt.calculationRequired, 
        description: txt.selectFuelCellFirst, 
        variant: "destructive" 
      });
      return;
    }
    const result = await generatePDF({
      date: new Date().toISOString().split('T')[0],
      load: data.loadKw,
      autonomy: data.autonomyHours,
      voltage: data.systemVoltage,
      temperature: data.maxTemperature,
      altitude: data.altitude,
      fuelCell: selectedFc ? {
        model: selectedFc.model,
        manufacturer: selectedFc.manufacturer,
        ratedPower: Number(selectedFc.ratedPowerKw),
        efficiency: Number(selectedFc.efficiency)
      } : undefined,
      results: results ? {
        fcStackRequired: 1,
        batteryCapacity: results.batteryCapacityAh,
        batteryStrings: results.batteryStrings,
        h2Cylinders: results.cylindersRequired,
        cableSize: results.cableSizeMm2
      } : undefined,
      financial: results ? {
        dgTCO: results.dgDailyCost * 365 * 10,
        fcTCO: results.fcDailyCost * 365 * 10,
        annualSavings: results.annualSavings,
        paybackYears: results.paybackYears ?? -1
      } : undefined
    });
    if (result.success) {
      toast({ title: txt.pdfDownloaded, description: txt.reportSaved });
    } else {
      toast({ title: txt.error, description: txt.pdfFailed, variant: "destructive" });
    }
  };

  const handleAIAnalysis = async () => {
    const data = form.getValues();
    if (!selectedFc || !results) {
      toast({ 
        title: txt.calculationRequired, 
        description: txt.selectFuelCellFirst, 
        variant: "destructive" 
      });
      return;
    }
    const result = await analyzeSystem({
      load: data.loadKw,
      autonomy: data.autonomyHours,
      voltage: data.systemVoltage,
      temperature: data.maxTemperature,
      altitude: data.altitude,
      dgRated: data.dgCapacityKva,
      dgRunningHours: data.hoursPerYear / 12,
      fuelCellModel: selectedFc?.model,
      loadFactor: results?.dgLoadFactor,
      dgDailyCost: results?.dgDailyCost,
      fcDailyCost: results?.fcDailyCost,
      dailySavings: results?.dailySavings,
      taskType: aiTaskType,
      language: aiLanguage
    });
    if (result.success && result.analysis) {
      setAiAnalysis(result.analysis);
      toast({ title: txt.aiAnalysisComplete, description: txt.scrollForRecommendations });
    } else {
      setAiAnalysis(result.recommendation || "Analysis unavailable");
      toast({ title: txt.basicAnalysis, description: txt.aiFallback });
    }
  };

  const handleDownloadDiagram = async () => {
    const data = form.getValues();
    if (!selectedFc || !results) {
      toast({ 
        title: txt.calculationRequired, 
        description: txt.selectFuelCellFirst, 
        variant: "destructive" 
      });
      return;
    }
    const result = await generateDiagram({
      type: 'system',
      load: data.loadKw,
      fcPower: selectedFc ? Number(selectedFc.ratedPowerKw) : data.loadKw,
      batteryCapacity: results?.batteryCapacityAh || 0,
      h2Cylinders: results?.cylindersRequired || 0
    });
    if (result.success) {
      toast({ title: txt.diagramDownloaded, description: txt.systemDiagramSaved });
    } else {
      toast({ title: txt.error, description: txt.diagramFailed, variant: "destructive" });
    }
  };

  const handleCSVExport = async () => {
    const data = form.getValues();
    if (!selectedFc || !results) {
      toast({ 
        title: txt.calculationRequired, 
        description: txt.selectFuelCellFirst, 
        variant: "destructive" 
      });
      return;
    }
    const result = await generateCSV({
      projectName: data.name,
      load: data.loadKw,
      autonomy: data.autonomyHours,
      voltage: data.systemVoltage,
      temperature: data.maxTemperature,
      altitude: data.altitude,
      fuelCell: selectedFc ? {
        model: selectedFc.model,
        manufacturer: selectedFc.manufacturer,
        ratedPower: Number(selectedFc.ratedPowerKw),
        efficiency: Number(selectedFc.efficiency)
      } : undefined,
      results: results ? {
        batteryCapacity: results.batteryCapacityAh,
        batteryStrings: results.batteryStrings,
        h2Cylinders: results.cylindersRequired,
        cableSize: results.cableSizeMm2
      } : undefined,
      financial: results ? {
        dgDailyCost: results.dgDailyCost,
        fcDailyCost: results.fcDailyCost,
        dailySavings: results.dailySavings,
        annualSavings: results.annualSavings,
        paybackYears: results.paybackYears ?? -1,
        co2Savings: results.co2Savings
      } : undefined
    });
    if (result.success) {
      toast({ title: txt.csvDownloaded, description: txt.dataExported });
    } else {
      toast({ title: txt.error, description: txt.csvFailed, variant: "destructive" });
    }
  };

  const selectedFc = fuelCells?.find(fc => fc.id === form.watch("fuelCellId"));
  const loadFactor = results?.dgLoadFactor || 0;

  const handleApplyTemplate = (template: SiteTemplate) => {
    form.setValue("loadKw", template.loadKw);
    form.setValue("autonomyHours", template.autonomyHours);
    form.setValue("systemVoltage", template.voltage);
    toast({ 
      title: txt.templateApplied, 
      description: `${template.name} - ${template.loadKw} kW, ${template.autonomyHours}h` 
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex relative overflow-hidden" dir={isRTL ? "rtl" : "ltr"}>
      <TelecomGreenEnergySilhouette />
      <Sidebar />
      <main className={`flex-1 p-4 sm:p-6 lg:p-8 relative z-10 ${isRTL ? 'lg:mr-20' : 'lg:ml-20'}`}>
        <header className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-6 h-6 text-primary" />
              {txt.pageTitle}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              {txt.pageSubtitle}
            </p>
          </div>
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <GuidedTour page="sizing" />
            <Badge variant="outline" className="w-fit">{txt.modeBadge}</Badge>
          </div>
        </header>

        <Collapsible open={referenceOpen} onOpenChange={setReferenceOpen} className="mb-6">
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full justify-between" data-testid="button-toggle-reference">
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                {txt.telecomReference}
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform ${referenceOpen ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
            <TelecomReference 
              onApplyTemplate={handleApplyTemplate}
            />
          </CollapsibleContent>
        </Collapsible>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* LEFT: INPUTS */}
          <div className="xl:col-span-4 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> {txt.siteConstraints}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Form {...form}>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{txt.projectName}</FormLabel>
                        <FormControl><Input placeholder={txt.projectNamePlaceholder} {...field} data-testid="input-project-name" /></FormControl>
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="maxTemperature"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1">
                            <Thermometer className="w-3 h-3" /> {txt.maxTemp}
                          </FormLabel>
                          <FormControl>
                            <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} data-testid="input-max-temp" />
                          </FormControl>
                          <FormDescription>{txt.celsius}</FormDescription>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="altitude"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{txt.altitude}</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} data-testid="input-altitude" />
                          </FormControl>
                          <FormDescription>{txt.meters}</FormDescription>
                        </FormItem>
                      )}
                    />
                  </div>
                </Form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Zap className="w-4 h-4" /> {txt.loadProfile}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Form {...form}>
                  <FormField
                    control={form.control}
                    name="loadKw"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex justify-between">
                          <FormLabel>{txt.criticalLoad}</FormLabel>
                          <span className="text-sm font-mono text-primary">{field.value} kW</span>
                        </div>
                        <FormControl>
                          <Slider min={0.5} max={50} step={0.5} value={[field.value]} onValueChange={v => field.onChange(v[0])} data-testid="slider-load" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="autonomyHours"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex justify-between">
                          <FormLabel>{txt.autonomyRequired}</FormLabel>
                          <span className="text-sm font-mono text-primary">{field.value} {txt.hrs}</span>
                        </div>
                        <FormControl>
                          <Slider min={1} max={72} step={1} value={[field.value]} onValueChange={v => field.onChange(v[0])} data-testid="slider-autonomy" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="fuelCellId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{txt.fuelCellModel}</FormLabel>
                        <Select onValueChange={v => field.onChange(parseInt(v))} value={field.value?.toString()}>
                          <FormControl>
                            <SelectTrigger data-testid="select-fuel-cell">
                              <SelectValue placeholder={txt.selectModel} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {fuelCells?.map(fc => (
                              <SelectItem key={fc.id} value={fc.id.toString()}>
                                {fc.manufacturer} {fc.model} ({fc.ratedPowerKw}kW)
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </Form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Fuel className="w-4 h-4" /> {txt.dieselGenInfo}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Form {...form}>
                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="dgCapacityKva"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{txt.capacityKva}</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} data-testid="input-dg-capacity" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="dieselPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{txt.dieselPrice}</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.1" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} data-testid="input-diesel-price" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="pilferageFactor"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex justify-between">
                          <FormLabel className="flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 text-amber-500" /> {txt.theftLossFactor}
                          </FormLabel>
                          <span className="text-sm font-mono text-amber-600">{field.value}%</span>
                        </div>
                        <FormControl>
                          <Slider min={0} max={50} step={1} value={[field.value]} onValueChange={v => field.onChange(v[0])} data-testid="slider-theft" />
                        </FormControl>
                        <FormDescription>{txt.fuelPilferageLosses}</FormDescription>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="h2Price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{txt.hydrogenPrice}</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.5" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} data-testid="input-h2-price" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </Form>
              </CardContent>
            </Card>

            <Button 
              onClick={handleCalculate} 
              disabled={calculateMutation.isPending}
              className="w-full"
              size="lg"
              data-testid="button-calculate"
            >
              {calculateMutation.isPending ? <Loader2 className={`w-4 h-4 animate-spin ${isRTL ? 'ml-2' : 'mr-2'}`} /> : <Calculator className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />}
              {txt.calculateAnalysis}
            </Button>
          </div>

          {/* RIGHT: RESULTS */}
          <div className="xl:col-span-8">
            {!results ? (
              <Card className="h-96 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <Calculator className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <p className="text-lg">{txt.configureInputs}</p>
                </div>
              </Card>
            ) : (
              <Tabs defaultValue="comparison" className="space-y-4">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="comparison" data-testid="tab-comparison">{txt.dgVsFc}</TabsTrigger>
                  <TabsTrigger value="sizing" data-testid="tab-sizing">{txt.sizing}</TabsTrigger>
                  <TabsTrigger value="battery" data-testid="tab-battery">{txt.battery}</TabsTrigger>
                  <TabsTrigger value="logistics" data-testid="tab-logistics">{txt.logistics}</TabsTrigger>
                </TabsList>

                <TabsContent value="comparison" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Diesel Generator Card */}
                    <Card className="border-red-200 dark:border-red-800">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2 text-red-700 dark:text-red-400">
                          <Fuel className="w-4 h-4" /> {txt.existingDieselGen}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">{txt.loadFactor}</span>
                          <div className="flex items-center gap-2">
                            <Badge variant={loadFactor < 30 ? "destructive" : "secondary"}>
                              {loadFactor}%
                            </Badge>
                            {loadFactor < 30 && <span className="text-xs text-red-500">{txt.lowEfficiency}</span>}
                          </div>
                        </div>
                        <Progress value={loadFactor} className="h-2" />
                        <Separator />
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">{txt.engineConsumption}</span>
                            <span className="font-mono">{results.dgFuelConsumptionHourly} L/hr</span>
                          </div>
                          <div className="flex justify-between text-amber-600">
                            <span>{txt.theftLossOverhead}</span>
                            <span className="font-mono">+{(results.dgFuelWithTheft - results.dgFuelConsumptionHourly).toFixed(2)} L/hr</span>
                          </div>
                        </div>
                        <div className="bg-red-50 dark:bg-red-950 rounded-lg p-3 mt-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{txt.dailyOpex}</span>
                            <span className="text-xl font-bold text-red-600">${results.dgDailyCost}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Fuel Cell Card */}
                    <Card className="border-green-200 dark:border-green-800">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2 text-green-700 dark:text-green-400">
                          <Zap className="w-4 h-4" /> {txt.proposedFuelCell}
                        </CardTitle>
                        {selectedFc && <CardDescription>{selectedFc.manufacturer} {selectedFc.model}</CardDescription>}
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">{txt.systemEfficiency}</span>
                          <Badge variant="secondary">{selectedFc?.efficiency}%</Badge>
                        </div>
                        <Progress value={selectedFc?.efficiency || 0} className="h-2" />
                        <Separator />
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">{txt.fuelConsumption}</span>
                            <span className="font-mono">{results.fuelConsumptionHourly} kg/hr</span>
                          </div>
                          <div className="flex justify-between text-green-600">
                            <span>{txt.theftRisk}</span>
                            <span className="font-mono flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> {txt.cannotSiphon}
                            </span>
                          </div>
                        </div>
                        <div className="bg-green-50 dark:bg-green-950 rounded-lg p-3 mt-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{txt.dailyOpex}</span>
                            <span className="text-xl font-bold text-green-600">${results.fcDailyCost}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Summary Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="text-center p-4">
                      <DollarSign className="w-6 h-6 mx-auto text-primary mb-2" />
                      <p className="text-xs text-muted-foreground uppercase">{txt.dailySavings}</p>
                      <p className={`text-xl font-bold ${results.dailySavings > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${results.dailySavings}
                      </p>
                    </Card>
                    <Card className="text-center p-4">
                      <TrendingUp className="w-6 h-6 mx-auto text-primary mb-2" />
                      <p className="text-xs text-muted-foreground uppercase">{txt.annualSavings}</p>
                      <p className={`text-xl font-bold ${results.annualSavings > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${results.annualSavings.toLocaleString()}
                      </p>
                    </Card>
                    <Card className="text-center p-4">
                      <Calculator className="w-6 h-6 mx-auto text-primary mb-2" />
                      <p className="text-xs text-muted-foreground uppercase">{txt.paybackPeriod}</p>
                      <p className={`text-xl font-bold ${results.paybackStatus === 'excellent' ? 'text-green-600' : results.paybackStatus === 'diesel-favorable' ? 'text-red-600' : ''}`}>
                        {results.paybackYears === null ? (results.paybackStatus === 'diesel-favorable' ? txt.dgBetter : 'N/A') : `${results.paybackYears} yrs`}
                      </p>
                      {results.paybackStatus && <p className="text-xs text-muted-foreground capitalize">{results.paybackStatus}</p>}
                    </Card>
                    <Card className="text-center p-4">
                      <Leaf className="w-6 h-6 mx-auto text-green-500 mb-2" />
                      <p className="text-xs text-muted-foreground uppercase">{txt.co2Avoided}</p>
                      <p className="text-xl font-bold text-green-600">
                        {results.co2Savings.toLocaleString()} kg/yr
                      </p>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="sizing" className="space-y-4">
                  {results.needsMultipleStacks && (
                    <Card className="border-blue-400 dark:border-blue-600 bg-blue-50 dark:bg-blue-950">
                      <CardContent className="pt-4">
                        <div className="flex items-start gap-3">
                          <Zap className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <h4 className="font-semibold text-blue-700 dark:text-blue-400">{txt.multipleStacksConfig}</h4>
                            <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
                              {txt.multipleStacksDesc}
                            </p>
                            <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                              <div className="bg-white/50 dark:bg-black/20 rounded p-2 text-center">
                                <span className="text-xs text-muted-foreground block">{txt.perUnitDerated}</span>
                                <span className="font-mono text-blue-700 dark:text-blue-400">{results.fcDeratedPower} kW</span>
                              </div>
                              <div className="bg-white/50 dark:bg-black/20 rounded p-2 text-center">
                                <span className="text-xs text-muted-foreground block">{txt.unitsRequired}</span>
                                <span className="font-mono font-bold text-blue-700 dark:text-blue-400">{results.requiredStackCount}</span>
                              </div>
                              <div className="bg-green-100/50 dark:bg-green-900/30 rounded p-2 text-center">
                                <span className="text-xs text-muted-foreground block">{txt.totalDerated}</span>
                                <span className="font-mono font-bold text-green-700 dark:text-green-400">{results.totalDeratedPower} kW</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  
                  {results.isUndersized && (
                    <Card className="border-red-400 dark:border-red-600 bg-red-50 dark:bg-red-950">
                      <CardContent className="pt-4">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <h4 className="font-semibold text-red-700 dark:text-red-400">{txt.capacityWarning}</h4>
                            <p className="text-sm text-red-600 dark:text-red-300 mt-1">
                              {txt.capacityWarningDesc}
                            </p>
                            <div className="mt-2 text-sm">
                              <span className="text-muted-foreground">{txt.capacityShortfall}:</span>
                              <span className={`font-mono font-bold text-red-700 dark:text-red-400 ${isRTL ? 'mr-2' : 'ml-2'}`}>{results.capacityShortfall} kW</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calculator className="w-5 h-5" /> {txt.engineeringSizing}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-4 text-center">
                          <p className="text-xs text-muted-foreground uppercase">
                            {results.needsMultipleStacks ? `${txt.totalFcCapacity} (${results.requiredStackCount}x)` : txt.fuelCellRated}
                          </p>
                          <p className="text-2xl font-bold">{results.totalRatedPower} kW</p>
                          <p className="text-xs text-muted-foreground">{txt.totalDerated}: {results.totalDeratedPower} kW</p>
                        </div>
                        <div className={`rounded-lg p-4 text-center ${results.isUndersized ? 'bg-red-50 dark:bg-red-950' : 'bg-green-50 dark:bg-green-950'}`}>
                          <p className="text-xs text-muted-foreground uppercase">{txt.siteLoad}</p>
                          <p className="text-2xl font-bold">{form.watch("loadKw")} kW</p>
                          <p className={`text-xs ${results.isUndersized ? 'text-red-600' : 'text-green-600'}`}>
                            {txt.margin}: {results.capacityMargin > 0 ? '+' : ''}{results.capacityMargin}%
                          </p>
                        </div>
                        <div className="bg-amber-50 dark:bg-amber-950 rounded-lg p-4 text-center">
                          <p className="text-xs text-muted-foreground uppercase">{txt.parasiticLoss}</p>
                          <p className="text-2xl font-bold text-amber-600">-{results.parasiticLossKw} kW</p>
                          <p className="text-xs text-muted-foreground">{((selectedFc?.parasiticLoss || 0.08) * 100).toFixed(0)}% {txt.fansPumps}</p>
                        </div>
                        <div className="bg-red-50 dark:bg-red-950 rounded-lg p-4 text-center">
                          <p className="text-xs text-muted-foreground uppercase">{txt.tempDerating}</p>
                          <p className="text-2xl font-bold text-red-600">-{((1 - results.deratingFactor) * 100).toFixed(0)}%</p>
                          <p className="text-xs text-muted-foreground">@ {form.watch("maxTemperature")}C</p>
                        </div>
                      </div>
                      <Separator className="my-4" />
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-muted-foreground flex items-center gap-2"><Cable className="w-4 h-4" /> {txt.cableSize}</span>
                          <span className="font-mono font-medium">{results.cableSizeMm2} mm2</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-muted-foreground flex items-center gap-2"><Fuel className="w-4 h-4" /> {txt.dailyFuel}</span>
                          <span className="font-mono font-medium">{results.fuelConsumptionDaily} kg</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="battery" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Battery className="w-5 h-5" /> {txt.hybridBatteryBuffer}
                      </CardTitle>
                      <CardDescription>{txt.batteryBufferDesc}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-4 text-center">
                          <p className="text-xs text-muted-foreground uppercase">{txt.capacity}</p>
                          <p className="text-2xl font-bold">{results.batteryCapacityKwh} kWh</p>
                        </div>
                        <div className="bg-green-50 dark:bg-green-950 rounded-lg p-4 text-center">
                          <p className="text-xs text-muted-foreground uppercase">{txt.ampHours}</p>
                          <p className="text-2xl font-bold">{results.batteryCapacityAh} Ah</p>
                          <p className="text-xs text-muted-foreground">@ {form.watch("systemVoltage")}V</p>
                        </div>
                        <div className="bg-purple-50 dark:bg-purple-950 rounded-lg p-4 text-center">
                          <p className="text-xs text-muted-foreground uppercase">{txt.configuration}</p>
                          <p className="text-2xl font-bold">{results.batteryStrings}</p>
                          <p className="text-xs text-muted-foreground">{txt.stringsOf}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="logistics" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Package className="w-5 h-5" /> {txt.logisticsPlanning}
                      </CardTitle>
                      <CardDescription>
                        {txt.hydrogenSupply} {form.watch("refuelingCycleDays")} {txt.daysAutonomy}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-cyan-50 dark:bg-cyan-950 rounded-lg p-4 text-center">
                          <p className="text-xs text-muted-foreground uppercase">{txt.totalH2Required}</p>
                          <p className="text-2xl font-bold">{results.totalH2Required} kg</p>
                        </div>
                        <div className="bg-orange-50 dark:bg-orange-950 rounded-lg p-4 text-center">
                          <p className="text-xs text-muted-foreground uppercase">{txt.cylinders}</p>
                          <p className="text-2xl font-bold">{results.cylindersRequired}</p>
                          <p className="text-xs text-muted-foreground">{txt.units}</p>
                        </div>
                        <div className="bg-pink-50 dark:bg-pink-950 rounded-lg p-4 text-center">
                          <p className="text-xs text-muted-foreground uppercase">{txt.bundles}</p>
                          <p className="text-2xl font-bold">{results.bundlesRequired}</p>
                          <p className="text-xs text-muted-foreground">{txt.bundlesLabel}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}

            {results && (
              <div className="space-y-4 mt-4">
                <Button 
                  onClick={handleSave}
                  disabled={createProjectMutation.isPending}
                  className="w-full"
                  size="lg"
                  variant="default"
                  data-testid="button-save"
                >
                  {createProjectMutation.isPending ? <Loader2 className={`w-4 h-4 animate-spin ${isRTL ? 'ml-2' : 'mr-2'}`} /> : <Save className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />}
                  {txt.saveProject}
                </Button>
                
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    onClick={handleDownloadPDF}
                    disabled={pythonLoading}
                    variant="outline"
                    data-testid="button-download-pdf"
                  >
                    {pythonLoading ? <Loader2 className={`w-4 h-4 animate-spin ${isRTL ? 'ml-2' : 'mr-2'}`} /> : <FileDown className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />}
                    {txt.downloadPdf}
                  </Button>
                  <Button 
                    onClick={handleCSVExport}
                    disabled={pythonLoading}
                    variant="outline"
                    data-testid="button-download-csv"
                  >
                    {pythonLoading ? <Loader2 className={`w-4 h-4 animate-spin ${isRTL ? 'ml-2' : 'mr-2'}`} /> : <FileDown className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />}
                    {txt.downloadCsv}
                  </Button>
                  <Button 
                    onClick={handleDownloadDiagram}
                    disabled={pythonLoading}
                    variant="outline"
                    data-testid="button-diagram"
                  >
                    {pythonLoading ? <Loader2 className={`w-4 h-4 animate-spin ${isRTL ? 'ml-2' : 'mr-2'}`} /> : <Network className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />}
                    {txt.downloadDiagram}
                  </Button>
                </div>

                <Card className="border-slate-200 dark:border-slate-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      {txt.aiConsultant}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-muted-foreground">{txt.analysisType}</label>
                        <Select value={aiTaskType} onValueChange={(v) => setAiTaskType(v as AITaskType)}>
                          <SelectTrigger data-testid="select-ai-task">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="analysis">{txt.engineeringAnalysis}</SelectItem>
                            <SelectItem value="email">{txt.managerEmail}</SelectItem>
                            <SelectItem value="action_plan">{txt.actionPlan}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-muted-foreground">{txt.languageLabel}</label>
                        <Select value={aiLanguage} onValueChange={(v) => setAiLanguage(v as AILanguage)}>
                          <SelectTrigger data-testid="select-ai-language">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="english">{txt.english}</SelectItem>
                            <SelectItem value="arabic">{txt.arabic}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button 
                      onClick={handleAIAnalysis}
                      disabled={pythonLoading}
                      className="w-full"
                      data-testid="button-ai-analysis"
                    >
                      {pythonLoading ? <Loader2 className={`w-4 h-4 animate-spin ${isRTL ? 'ml-2' : 'mr-2'}`} /> : <Sparkles className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />}
                      {txt.generateAiAnalysis}
                    </Button>
                  </CardContent>
                </Card>

                {aiAnalysis && (
                  <Card className="border-blue-200 dark:border-blue-800">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2 text-blue-700 dark:text-blue-400">
                        <Sparkles className="w-4 h-4" /> {txt.aiPoweredAnalysis}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                        {aiAnalysis}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      <FloatingContactButton />
    </div>
  );
}
