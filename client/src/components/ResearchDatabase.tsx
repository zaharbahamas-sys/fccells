import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Search, ExternalLink, Database, BookOpen, TrendingUp, 
  Building2, Globe2, FileText, Filter, RefreshCw, DollarSign, Tag
} from "lucide-react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Legend
} from "recharts";

interface ResearchSource {
  id: string;
  name: string;
  nameAr: string;
  baseUrl: string;
  type: string;
  description: string;
}

interface Publication {
  id: string;
  title: string;
  titleAr: string;
  authors: string[];
  year: number;
  source: string;
  sourceName: string;
  abstract: string;
  url: string;
  tags: string[];
  category: string;
}

interface MarketData {
  currentPrices: {
    grayH2: { value: number; unit: string; source: string; trend: string };
    blueH2: { value: number; unit: string; source: string; trend: string };
    greenH2: { value: number; unit: string; source: string; trend: string };
    projected2030: { value: number; unit: string; source: string; trend: string };
  };
  globalCapacity: {
    electrolysis2023: { value: number; unit: string; source: string };
    electrolysis2030Target: { value: number; unit: string; source: string };
    fuelCellShipments2023: { value: number; unit: string; source: string };
    telecomInstallations: { value: number; unit: string; source: string };
  };
  costTrends: Array<{
    year: number;
    pemCost: number;
    sofcCost: number;
    electrolyzerCost: number;
  }>;
}

interface CategoriesData {
  categories: string[];
  tags: string[];
}

export function ResearchDatabase() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSource, setSelectedSource] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTag, setSelectedTag] = useState<string>("all");

  const { data: sources, isLoading: sourcesLoading } = useQuery<ResearchSource[]>({
    queryKey: ["/api/research/sources"],
  });

  const { data: categoriesData } = useQuery<CategoriesData>({
    queryKey: ["/api/research/categories"],
  });

  const buildQueryString = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.append("search", searchQuery);
    if (selectedSource !== "all") params.append("source", selectedSource);
    if (selectedCategory !== "all") params.append("category", selectedCategory);
    if (selectedTag !== "all") params.append("tag", selectedTag);
    return params.toString();
  };

  const { data: publicationsData, isLoading: publicationsLoading, refetch } = useQuery<{
    count: number;
    publications: Publication[];
  }>({
    queryKey: ["/api/research/publications", searchQuery, selectedSource, selectedCategory, selectedTag],
    queryFn: async () => {
      const queryString = buildQueryString();
      const url = queryString ? `/api/research/publications?${queryString}` : "/api/research/publications";
      const res = await fetch(url);
      return res.json();
    },
  });

  const { data: marketData, isLoading: marketLoading } = useQuery<MarketData>({
    queryKey: ["/api/research/market-data"],
  });

  const getSourceIcon = (type: string) => {
    switch (type) {
      case "government": return <Building2 className="w-4 h-4" />;
      case "industry": return <TrendingUp className="w-4 h-4" />;
      case "international": return <Globe2 className="w-4 h-4" />;
      default: return <Database className="w-4 h-4" />;
    }
  };

  const getTrendBadge = (trend: string) => {
    switch (trend) {
      case "declining": return <Badge variant="secondary" className="text-green-600">Declining</Badge>;
      case "stable": return <Badge variant="outline">Stable</Badge>;
      case "target": return <Badge variant="default">Target</Badge>;
      default: return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          Research Database Integration
        </CardTitle>
        <CardDescription>
          Access fuel cell research from DOE, NREL, IEA, and industry associations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="publications" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="publications" data-testid="tab-publications">
              <BookOpen className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Publications</span>
            </TabsTrigger>
            <TabsTrigger value="market" data-testid="tab-market">
              <TrendingUp className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Market Data</span>
            </TabsTrigger>
            <TabsTrigger value="sources" data-testid="tab-sources">
              <Database className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Data Sources</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="publications" className="space-y-4">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search publications..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                    data-testid="input-search-publications"
                  />
                </div>
                <Select value={selectedSource} onValueChange={setSelectedSource}>
                  <SelectTrigger className="w-full sm:w-[160px]" data-testid="select-source-trigger">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" data-testid="select-source-all">All Sources</SelectItem>
                    {sources?.map((s) => (
                      <SelectItem key={s.id} value={s.id} data-testid={`select-source-${s.id}`}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full sm:w-[160px]" data-testid="select-category-trigger">
                    <FileText className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" data-testid="select-category-all">All Categories</SelectItem>
                    {categoriesData?.categories.map((c) => (
                      <SelectItem key={c} value={c} data-testid={`select-category-${c.toLowerCase().replace(/\s+/g, '-')}`}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedTag} onValueChange={setSelectedTag}>
                  <SelectTrigger className="w-full sm:w-[140px]" data-testid="select-tag-trigger">
                    <Tag className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Tag" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" data-testid="select-tag-all">All Tags</SelectItem>
                    {categoriesData?.tags.map((t) => (
                      <SelectItem key={t} value={t} data-testid={`select-tag-${t.toLowerCase().replace(/\s+/g, '-')}`}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon" onClick={() => refetch()} data-testid="button-refresh-publications">
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {publicationsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-32 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Found {publicationsData?.count || 0} publications
                </p>
                {publicationsData?.publications.map((pub) => (
                  <div 
                    key={pub.id}
                    className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800"
                    data-testid={`publication-${pub.id}`}
                  >
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm line-clamp-2">{pub.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1" dir="rtl">{pub.titleAr}</p>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <Badge variant="secondary" className="text-xs">{pub.category}</Badge>
                          <span className="text-xs text-muted-foreground">{pub.year}</span>
                          <span className="text-xs text-muted-foreground">{pub.sourceName}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{pub.abstract}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {pub.tags.slice(0, 4).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-[10px]">{tag}</Badge>
                          ))}
                        </div>
                      </div>
                      <a 
                        href={pub.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        data-testid={`link-publication-${pub.id}`}
                      >
                        <Button variant="outline" size="sm">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          View
                        </Button>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="market" className="space-y-4">
            {marketLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : marketData && (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <p className="text-xs text-muted-foreground">Gray H2 Price</p>
                    <p className="text-xl font-bold">{marketData.currentPrices.grayH2.value} {marketData.currentPrices.grayH2.unit}</p>
                    {getTrendBadge(marketData.currentPrices.grayH2.trend)}
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <p className="text-xs text-muted-foreground">Blue H2 Price</p>
                    <p className="text-xl font-bold">{marketData.currentPrices.blueH2.value} {marketData.currentPrices.blueH2.unit}</p>
                    {getTrendBadge(marketData.currentPrices.blueH2.trend)}
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <p className="text-xs text-muted-foreground">Green H2 Price</p>
                    <p className="text-xl font-bold">{marketData.currentPrices.greenH2.value} {marketData.currentPrices.greenH2.unit}</p>
                    {getTrendBadge(marketData.currentPrices.greenH2.trend)}
                  </div>
                  <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/30">
                    <p className="text-xs text-muted-foreground">2030 Target</p>
                    <p className="text-xl font-bold text-primary">{marketData.currentPrices.projected2030.value} {marketData.currentPrices.projected2030.unit}</p>
                    {getTrendBadge(marketData.currentPrices.projected2030.trend)}
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <p className="text-xs text-muted-foreground">Electrolysis Capacity (2023)</p>
                    <p className="text-lg font-bold">{marketData.globalCapacity.electrolysis2023.value} {marketData.globalCapacity.electrolysis2023.unit}</p>
                    <p className="text-[10px] text-muted-foreground">{marketData.globalCapacity.electrolysis2023.source}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <p className="text-xs text-muted-foreground">2030 Target</p>
                    <p className="text-lg font-bold">{marketData.globalCapacity.electrolysis2030Target.value} {marketData.globalCapacity.electrolysis2030Target.unit}</p>
                    <p className="text-[10px] text-muted-foreground">{marketData.globalCapacity.electrolysis2030Target.source}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <p className="text-xs text-muted-foreground">FC Shipments (2023)</p>
                    <p className="text-lg font-bold">{marketData.globalCapacity.fuelCellShipments2023.value} {marketData.globalCapacity.fuelCellShipments2023.unit}</p>
                    <p className="text-[10px] text-muted-foreground">{marketData.globalCapacity.fuelCellShipments2023.source}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <p className="text-xs text-muted-foreground">Telecom Installations</p>
                    <p className="text-lg font-bold">{marketData.globalCapacity.telecomInstallations.value.toLocaleString()}</p>
                    <p className="text-[10px] text-muted-foreground">{marketData.globalCapacity.telecomInstallations.source}</p>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <h4 className="font-semibold text-sm mb-4 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Fuel Cell Cost Trends ($/kW)
                  </h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={marketData.costTrends}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis dataKey="year" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }} 
                        />
                        <Legend />
                        <Line type="monotone" dataKey="pemCost" name="PEM FC" stroke="#3b82f6" strokeWidth={2} />
                        <Line type="monotone" dataKey="sofcCost" name="SOFC" stroke="#f97316" strokeWidth={2} />
                        <Line type="monotone" dataKey="electrolyzerCost" name="Electrolyzer" stroke="#22c55e" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="sources" className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Integrated research databases for fuel cell and hydrogen technology data
            </p>
            {sourcesLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            ) : (
              <div className="grid gap-3">
                {sources?.map((source) => (
                  <div 
                    key={source.id}
                    className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-start justify-between gap-4"
                    data-testid={`source-${source.id}`}
                  >
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        {getSourceIcon(source.type)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">{source.name}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">{source.nameAr}</p>
                        <p className="text-xs text-muted-foreground mt-1">{source.description}</p>
                        <Badge variant="outline" className="mt-2 text-[10px]">{source.type}</Badge>
                      </div>
                    </div>
                    <a 
                      href={source.baseUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      data-testid={`link-source-${source.id}`}
                    >
                      <Button variant="outline" size="sm">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Visit
                      </Button>
                    </a>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
