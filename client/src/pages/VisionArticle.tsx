import { Sidebar } from "@/components/Sidebar";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  Globe, 
  TrendingUp, 
  ShieldCheck, 
  Leaf, 
  Coins, 
  Target 
} from "lucide-react";

export default function VisionArticle() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 lg:ml-20">
        <header className="mb-12 text-center max-w-4xl mx-auto">
          <Badge className="mb-4 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100 px-6 py-1 text-sm font-bold uppercase tracking-widest">
            Executive Briefing
          </Badge>
          <h1 className="text-5xl font-black text-slate-900 dark:text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            THE STRATEGIC VISION
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 font-medium">
            From Energy Consumption to Strategic Production: A Multi-Phase Roadmap for Global Infrastructure Leadership.
          </p>
        </header>

        <div className="max-w-4xl mx-auto space-y-8">
          <Accordion type="single" collapsible className="w-full space-y-4">
            
            {/* Section 1: Core Philosophy */}
            <AccordionItem value="philosophy" className="border-none">
              <AccordionTrigger className="hover:no-underline p-6 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-t-2xl shadow-lg">
                <div className="flex items-center gap-4 text-left">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-md">
                    <Target className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">1. THE CORE CONCEPT</h3>
                    <p className="text-sm opacity-90 font-normal">Our paradigm shift from consumer to producer.</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-8 bg-white dark:bg-slate-800 rounded-b-2xl shadow-inner text-slate-600 dark:text-slate-300 border-x border-b border-blue-100 dark:border-blue-900/30">
                <p className="text-lg leading-relaxed mb-4">
                  Our vision is not limited to mere "generator replacement" to cut costs. Instead, we aim to transform the company from a energy-dependent **Telecom Operator** into an **Energy Service Company (ESCO)**. 
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-xl border-l-4 border-blue-500">
                    <h4 className="font-bold text-blue-700 dark:text-blue-400 mb-2">Passive Asset</h4>
                    <p className="text-sm">Traditional towers that only incur fuel and maintenance costs.</p>
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-xl border-l-4 border-green-500">
                    <h4 className="font-bold text-green-700 dark:text-green-400 mb-2">Active Production Hub</h4>
                    <p className="text-sm">Strategic nodes that generate power and hydrogen for internal and external use.</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Section 2: Hydrogen as an Asset */}
            <AccordionItem value="hydrogen" className="border-none">
              <AccordionTrigger className="hover:no-underline p-6 bg-gradient-to-r from-teal-600 to-emerald-500 text-white rounded-t-2xl shadow-lg">
                <div className="flex items-center gap-4 text-left">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-md">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">2. HYDROGEN AS AN INVESTMENT</h3>
                    <p className="text-sm opacity-90 font-normal">Turning every site into a fuel production station.</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-8 bg-white dark:bg-slate-800 rounded-b-2xl shadow-inner text-slate-600 dark:text-slate-300 border-x border-b border-teal-100 dark:border-teal-900/30">
                <p className="text-lg leading-relaxed mb-4">
                  By utilizing our massive nationwide infrastructure—thousands of sites—we can install **Electrolyzers** powered by surplus solar energy. 
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                    <div className="mt-1"><Leaf className="text-emerald-500 w-5 h-5" /></div>
                    <p className="text-sm">Produce **Green Hydrogen** locally, eliminating the logistical risks and costs of fuel transport.</p>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                    <div className="mt-1"><ShieldCheck className="text-emerald-500 w-5 h-5" /></div>
                    <p className="text-sm">Gain **Energy Sovereignty**, protecting operations from global oil price volatility and local shortages.</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Section 3: Revenue Streams */}
            <AccordionItem value="revenue" className="border-none">
              <AccordionTrigger className="hover:no-underline p-6 bg-gradient-to-r from-orange-600 to-amber-500 text-white rounded-t-2xl shadow-lg">
                <div className="flex items-center gap-4 text-left">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-md">
                    <Coins className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">3. NEW REVENUE STREAMS</h3>
                    <p className="text-sm opacity-90 font-normal">Monetizing surplus production and carbon credits.</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-8 bg-white dark:bg-slate-800 rounded-b-2xl shadow-inner text-slate-600 dark:text-slate-300 border-x border-b border-orange-100 dark:border-orange-900/30">
                <p className="text-lg leading-relaxed mb-6">
                  In the near future, the demand for clean energy will skyrocket. Our surplus production becomes a highly liquid asset.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-orange-50 dark:bg-orange-950/20 border-orange-200">
                    <CardContent className="pt-6 text-center">
                      <TrendingUp className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                      <h5 className="font-bold">Market Sales</h5>
                      <p className="text-xs">Sell surplus H2 to transport and industrial sectors.</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-orange-50 dark:bg-orange-950/20 border-orange-200">
                    <CardContent className="pt-6 text-center">
                      <Globe className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                      <h5 className="font-bold">Carbon Credits</h5>
                      <p className="text-xs">Trade verified emissions reductions globally.</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-orange-50 dark:bg-orange-950/20 border-orange-200">
                    <CardContent className="pt-6 text-center">
                      <Zap className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                      <h5 className="font-bold">Grid Services</h5>
                      <p className="text-xs">Provide stability to local grids through storage.</p>
                    </CardContent>
                  </Card>
                </div>
              </AccordionContent>
            </AccordionItem>

          </Accordion>

          {/* Strategic Conclusion */}
          <Card className="bg-slate-900 border-none shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 to-purple-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
            <CardContent className="p-12 text-center relative z-10">
              <h2 className="text-3xl font-black text-white mb-6 uppercase tracking-tight">The Strategic Conclusion</h2>
              <p className="text-xl text-blue-100 leading-relaxed max-w-2xl mx-auto italic">
                "Investing in fuel cell technology and hydrogen production today is not just a solution for operational problems—it is securing a leadership seat in the economy of the future."
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
