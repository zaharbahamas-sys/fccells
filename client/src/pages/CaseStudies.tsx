import { Sidebar } from "@/components/Sidebar";
import { FloatingContactButton } from "@/components/ContactComments";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, MapPin, ExternalLink, FileText } from "lucide-react";
import { AmanitoreInclusivitySilhouette } from "@/components/CinematicBackgrounds";
import { useSettings } from "@/contexts/SettingsContext";

const caseStudiesText = {
  en: {
    pageTitle: "Global Case Studies & Examples",
    pageSubtitle: "Verified fuel cell deployments in telecom infrastructure worldwide (Updated 2024-2025)",
    similarityToSudan: "Similarity to Sudan:",
    viewCaseStudy: "View Case Study",
    relevance: "Relevance:",
    latestTrends: "Latest Industry Trends (2024-2025)",
    globalAdoption: "46% Global Adoption",
    globalAdoptionDesc: "Of telecom networks have integrated hybrid energy systems globally.",
    marketPotential: "$1B Market Potential",
    marketPotentialDesc: "Projected market size for telecom energy technology by 2034 with 15.3% CAGR.",
    zeroCarbonPriority: "Zero Carbon Priority",
    zeroCarbonPriorityDesc: "Fuel cells contributing to ~40% reduction in carbon emissions in leading European networks.",
  },
  ar: {
    pageTitle: "دراسات الحالة العالمية والأمثلة",
    pageSubtitle: "عمليات نشر خلايا الوقود المُتحقق منها في البنية التحتية للاتصالات حول العالم (تحديث 2024-2025)",
    similarityToSudan: "التشابه مع السودان:",
    viewCaseStudy: "عرض دراسة الحالة",
    relevance: "الصلة:",
    latestTrends: "أحدث اتجاهات الصناعة (2024-2025)",
    globalAdoption: "46% تبني عالمي",
    globalAdoptionDesc: "من شبكات الاتصالات قامت بدمج أنظمة الطاقة الهجينة على مستوى العالم.",
    marketPotential: "إمكانات سوقية بقيمة مليار دولار",
    marketPotentialDesc: "حجم السوق المتوقع لتكنولوجيا طاقة الاتصالات بحلول عام 2034 بمعدل نمو سنوي مركب 15.3%.",
    zeroCarbonPriority: "أولوية صفر كربون",
    zeroCarbonPriorityDesc: "تساهم خلايا الوقود في تقليل انبعاثات الكربون بنسبة ~40% في الشبكات الأوروبية الرائدة.",
  }
};

interface CaseStudyCountry {
  country: string;
  countryAr: string;
  application: string;
  similarity?: string;
  caseStudyUrl?: string;
}

interface CaseStudyRegion {
  region: string;
  regionAr: string;
  description: string;
  countries: CaseStudyCountry[];
}

const globalCaseStudies: CaseStudyRegion[] = [
  {
    region: "Neighboring & Regional Countries",
    regionAr: "دول الجوار والإقليم",
    description: "Countries geographically closest to Sudan with similar climate and logistical challenges",
    countries: [
      {
        country: "Kenya",
        countryAr: "كينيا",
        application: "Replacing diesel generators in hundreds of telecom towers using ammonia fuel cells by GenCell and Adrian Group. Reduced OpEx by up to $250M over 10 years.",
        similarity: "Neighboring country, rough terrain, critical need for off-grid solutions",
        caseStudyUrl: "https://www.gsma.com/solutions-and-impact/technologies/networks/gsma_resources/case-study-gencell/"
      },
      {
        country: "Germany",
        countryAr: "ألمانيا",
        application: "ZTE and Telefónica Germany deploy first zero-carbon site using methanol fuel cells and solar. Achieved 39% reduction in carbon emissions.",
        similarity: "Proof of 100% reliability in remote sites, methanol as a safe hydrogen carrier",
        caseStudyUrl: "https://techblog.comsoc.org/2024/02/28/highlights-of-gsma-study-mobile-net-zero-2024-state-of-the-industry-on-climate-action/"
      }
    ]
  },
  {
    region: "Asian Countries",
    regionAr: "دول آسيوية",
    description: "Major Asian markets with significant fuel cell telecom deployments",
    countries: [
      {
        country: "India",
        countryAr: "الهند",
        application: "Massive scale deployment over 27,400 towers. Delivered 10MWh of fuel cell power, saving 55 tonnes of CO2 in just 3 months.",
        caseStudyUrl: "https://www.intelligent-energy.com/uploads/case-studies/IE_Case_Study_India_Telecom.pdf"
      },
      {
        country: "Malaysia",
        countryAr: "ماليزيا",
        application: "Intelligent Energy actively servicing major operators with IE-POWER range (1kW to 300kW+) for off-grid and backup power.",
        caseStudyUrl: "https://www.intelligent-energy.com/our-industries/telecoms/"
      },
      {
        country: "Japan",
        countryAr: "اليابان",
        application: "Global leader. Used as backup power in SoftBank stations and primary power in homes (Ene-Farm system)",
        caseStudyUrl: "https://www.youtube.com/watch?v=R9Kogp0X6-s"
      }
    ]
  },
  {
    region: "European Countries",
    regionAr: "دول أوروبية",
    description: "European nations with advanced fuel cell implementations for critical communications",
    countries: [
      {
        country: "Germany",
        countryAr: "ألمانيا",
        application: "SFC Energy methanol fuel cells powering emergency and police signal boosting stations in mountains and forests (BOSNet network)",
        caseStudyUrl: "https://www.efoy-pro.com/reference/critical-communications-bosnet/"
      },
      {
        country: "UK & Denmark",
        countryAr: "بريطانيا والدنمارك",
        application: "Deployment of Ballard fuel cell systems for backup power in critical communication networks",
        caseStudyUrl: "https://www.youtube.com/watch?v=0hWq92Dq1H8"
      }
    ]
  },
  {
    region: "Americas",
    regionAr: "الأمريكتان",
    description: "North American telecom operators with large-scale fuel cell deployments",
    countries: [
      {
        country: "United States",
        countryAr: "الولايات المتحدة",
        application: "Major telecom companies like AT&T and Southern Linc use Plug Power fuel cells as standard generator replacements. Transitioned to 60% hybrid energy models.",
        caseStudyUrl: "https://www.plugpower.com/wp-content/uploads/2021/05/Southern-Linc-Case-Study.pdf"
      }
    ]
  }
];

export default function CaseStudies() {
  const { language, isRTL } = useSettings();
  const txt = caseStudiesText[language];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex relative overflow-hidden" dir={isRTL ? "rtl" : "ltr"}>
      <AmanitoreInclusivitySilhouette />
      <Sidebar />
      <main className={`flex-1 p-4 sm:p-6 lg:p-8 ${isRTL ? "lg:mr-20" : "lg:ml-20"} relative z-10`}>
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            {txt.pageTitle}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {txt.pageSubtitle}
          </p>
        </header>

        <div className="space-y-8">
          {globalCaseStudies.map((region) => (
            <section key={region.region} className="space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-2">
                <Globe className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold">{language === "ar" ? region.regionAr : region.region}</h2>
                <Badge variant="outline">{language === "ar" ? region.region : region.regionAr}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{region.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {region.countries.map((cs) => (
                  <Card key={cs.country} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-primary" />
                          <CardTitle className="text-base">{language === "ar" ? cs.countryAr : cs.country}</CardTitle>
                          <span className="text-xs text-muted-foreground">({language === "ar" ? cs.country : cs.countryAr})</span>
                        </div>
                        {cs.caseStudyUrl && (
                          <a 
                            href={cs.caseStudyUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-primary flex items-center gap-1 hover:underline"
                          >
                            <ExternalLink className="w-3 h-3" />
                            {txt.viewCaseStudy}
                          </a>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                        {cs.application}
                      </p>
                      {cs.similarity && (
                        <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                          <p className="text-xs italic">
                            <span className="font-semibold text-primary">{txt.relevance} </span>
                            {cs.similarity}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Industry Trends 2024-2025 */}
        <section className="mt-12 bg-primary/5 p-8 rounded-2xl border border-primary/10">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" />
            {txt.latestTrends}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="font-bold text-primary">{txt.globalAdoption}</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">{txt.globalAdoptionDesc}</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-primary">{txt.marketPotential}</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">{txt.marketPotentialDesc}</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-primary">{txt.zeroCarbonPriority}</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">{txt.zeroCarbonPriorityDesc}</p>
            </div>
          </div>
        </section>
      </main>
      <FloatingContactButton />
    </div>
  );
}
