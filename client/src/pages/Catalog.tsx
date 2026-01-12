import { Fragment, lazy, Suspense } from "react";
import { Sidebar } from "@/components/Sidebar";
import { FloatingContactButton } from "@/components/ContactComments";
import { useSettings } from "@/contexts/SettingsContext";
import { useFuelCells, useCreateFuelCell } from "@/hooks/use-fuel-cells";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Search, FileText, ExternalLink, Radio, ChevronDown, ChevronUp, Loader2, Box } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertFuelCellSchema, type InsertFuelCell } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { GuidedTour } from "@/components/GuidedTour";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { TelecomGreenEnergySilhouette } from "@/components/CinematicBackgrounds";

const FuelCell3DViewer = lazy(() => import("@/components/FuelCell3DViewer").then(m => ({ default: m.FuelCell3DViewer })));

export default function Catalog() {
  const { data: fuelCells, isLoading } = useFuelCells();
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [show3DViewer, setShow3DViewer] = useState(true);
  const { t, language, isRTL } = useSettings();
  
  const catalogText = {
    en: {
      inventory: "Inventory",
      manageInventory: "Manage your fuel cell equipment inventory",
      interactive3D: "Interactive 3D Configuration Viewer",
      loading3D: "Loading 3D viewer...",
      searchPlaceholder: "Search by manufacturer or model...",
      addFuelCell: "Add Fuel Cell",
      manufacturer: "Manufacturer",
      model: "Model",
      type: "Type",
      ratedPower: "Rated Power",
      efficiency: "Efficiency",
      outputVoltage: "Output Voltage",
      fuelConsumption: "Fuel Consumption",
      fuelType: "Fuel Type",
      capex: "CAPEX",
      source: "Source",
      technicalDetails: "Technical Details",
      datasheet: "Datasheet",
      noDatasheet: "No datasheet",
      noFuelCells: "No fuel cells found. Add your first fuel cell to get started.",
    },
    ar: {
      inventory: "المخزون",
      manageInventory: "إدارة مخزون معدات خلايا الوقود",
      interactive3D: "عارض التكوين ثلاثي الأبعاد التفاعلي",
      loading3D: "جاري تحميل العارض ثلاثي الأبعاد...",
      searchPlaceholder: "البحث بالشركة المصنعة أو الموديل...",
      addFuelCell: "إضافة خلية وقود",
      manufacturer: "الشركة المصنعة",
      model: "الموديل",
      type: "النوع",
      ratedPower: "القدرة المقدرة",
      efficiency: "الكفاءة",
      outputVoltage: "جهد الخرج",
      fuelConsumption: "استهلاك الوقود",
      fuelType: "نوع الوقود",
      capex: "النفقات الرأسمالية",
      source: "المصدر",
      technicalDetails: "التفاصيل الفنية",
      datasheet: "ورقة البيانات",
      noDatasheet: "لا توجد ورقة بيانات",
      noFuelCells: "لم يتم العثور على خلايا وقود. أضف أول خلية وقود للبدء.",
    },
  };
  
  const txt = catalogText[language];
  
  const filteredCells = fuelCells?.filter(cell => 
    cell.manufacturer.toLowerCase().includes(search.toLowerCase()) || 
    cell.model.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={`min-h-screen bg-[#F8FAFC] flex relative overflow-hidden ${isRTL ? 'rtl' : 'ltr'}`}>
      <TelecomGreenEnergySilhouette />
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 lg:ml-20 relative z-10">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{txt.inventory}</h1>
            <p className="text-sm sm:text-base text-slate-500 mt-1">{txt.manageInventory}</p>
          </div>
          <div className="flex items-center gap-2">
            <GuidedTour page="catalog" />
            <AddFuelCellDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
          </div>
        </header>

        <Collapsible open={show3DViewer} onOpenChange={setShow3DViewer} className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="gap-2 px-2" data-testid="button-toggle-3d-viewer">
                <Box className="w-4 h-4" />
                <span className="font-medium">{txt.interactive3D}</span>
                {show3DViewer ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent>
            <Suspense fallback={
              <div className="h-[500px] bg-slate-100 rounded-xl flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">{txt.loading3D}</p>
                </div>
              </div>
            }>
              <FuelCell3DViewer />
            </Suspense>
          </CollapsibleContent>
        </Collapsible>

        <div className="bg-white rounded-xl shadow-sm border border-border/50 overflow-hidden">
          <div className="p-4 border-b border-border/50 bg-slate-50/50 flex items-center justify-between">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder={txt.searchPlaceholder} 
                className="pl-9 bg-white"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                data-testid="input-search-catalog"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              Showing {filteredCells?.length || 0} items
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="hover:bg-slate-50/50">
                <TableHead className="w-[40px]"></TableHead>
                <TableHead className="w-[150px]">{txt.manufacturer}</TableHead>
                <TableHead>{txt.model}</TableHead>
                <TableHead>{txt.type}</TableHead>
                <TableHead className="text-right">{txt.ratedPower}</TableHead>
                <TableHead className="text-right">{txt.efficiency}</TableHead>
                <TableHead className="w-[120px]">{txt.datasheet}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-12 ml-auto" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-12 ml-auto" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  </TableRow>
                ))
              ) : filteredCells?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    {txt.noFuelCells}
                  </TableCell>
                </TableRow>
              ) : (
                filteredCells?.map((cell) => (
                  <Fragment key={cell.id}>
                    <TableRow 
                      className="group cursor-pointer hover-elevate"
                      onClick={() => setExpandedId(expandedId === cell.id ? null : cell.id)}
                      data-testid={`row-fuel-cell-${cell.id}`}
                    >
                      <TableCell className="w-[40px]">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedId(expandedId === cell.id ? null : cell.id);
                          }}
                        >
                          {expandedId === cell.id ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell className="font-medium text-slate-900">{cell.manufacturer}</TableCell>
                      <TableCell>{cell.model}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                          {cell.type}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-mono">{cell.ratedPowerKw}</TableCell>
                      <TableCell className="text-right font-mono">{cell.efficiency}%</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {cell.datasheetUrl && (
                            <a 
                              href={cell.datasheetUrl} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="text-primary hover:text-blue-700"
                              onClick={(e) => e.stopPropagation()}
                              title="View Datasheet"
                            >
                              <FileText className="w-4 h-4" />
                            </a>
                          )}
                          {cell.referenceUrl && (
                            <a 
                              href={cell.referenceUrl} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="text-green-600 hover:text-green-700"
                              onClick={(e) => e.stopPropagation()}
                              title="View Reference"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                    {expandedId === cell.id && (
                      <TableRow className="bg-slate-50/50">
                        <TableCell colSpan={7} className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                              <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                                <Radio className="w-4 h-4 text-primary" />
                                Telecom Application
                              </h4>
                              <p className="text-sm text-slate-600">
                                {cell.telecomApplication || "General backup power application. Suitable for various telecom infrastructure."}
                              </p>
                              {cell.referenceUrl && (
                                <a 
                                  href={cell.referenceUrl} 
                                  target="_blank" 
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                                  data-testid={`link-reference-${cell.id}`}
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  View manufacturer reference
                                </a>
                              )}
                            </div>
                            <div className="space-y-2">
                              <h4 className="font-semibold text-slate-900">Technical Details</h4>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="text-slate-500">Output Voltage:</div>
                                <div className="font-mono">{cell.outputVoltageV}V DC</div>
                                <div className="text-slate-500">Power Range:</div>
                                <div className="font-mono">{cell.minPowerKw || 0} - {cell.maxPowerKw || cell.ratedPowerKw} kW</div>
                                <div className="text-slate-500">Fuel Consumption:</div>
                                <div className="font-mono">{cell.fuelConsumptionPerKwh} kg/kWh</div>
                                <div className="text-slate-500">Fuel Type:</div>
                                <div>{cell.fuelType}</div>
                                <div className="text-slate-500">CAPEX:</div>
                                <div className="font-mono">${cell.capexPerKw}/kW</div>
                                <div className="text-slate-500">Source:</div>
                                <div className="text-xs text-muted-foreground">{cell.source}</div>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </main>
      <FloatingContactButton />
    </div>
  );
}

function AddFuelCellDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (o: boolean) => void }) {
  const { toast } = useToast();
  const createMutation = useCreateFuelCell();
  
  const form = useForm<InsertFuelCell>({
    resolver: zodResolver(insertFuelCellSchema),
    defaultValues: {
      manufacturer: "",
      model: "",
      type: "Hydrogen PEM",
      ratedPowerKw: 0,
      outputVoltageV: 48,
      fuelConsumptionPerKwh: 0,
      efficiency: 0,
    }
  });

  function onSubmit(data: InsertFuelCell) {
    createMutation.mutate(data, {
      onSuccess: () => {
        toast({ title: "Success", description: "Equipment added to inventory." });
        onOpenChange(false);
        form.reset();
      },
      onError: (err) => {
        const message = err instanceof Error ? err.message : "An unexpected error occurred while adding the equipment.";
        toast({ title: "Error", description: message, variant: "destructive" });
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-blue-600" data-testid="button-add-fuel-cell">
          <Plus className="w-4 h-4 mr-2" /> Add Equipment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Equipment to Inventory</DialogTitle>
          <DialogDescription>
            Enter the technical specifications from the manufacturer's datasheet.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="manufacturer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Manufacturer</FormLabel>
                    <FormControl><Input placeholder="e.g. Ballard" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model Name</FormLabel>
                    <FormControl><Input placeholder="e.g. FCgen-1020" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
               <FormField
                control={form.control}
                name="ratedPowerKw"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rated Power (kW)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="outputVoltageV"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Voltage (V)</FormLabel>
                    <FormControl>
                      <Input type="number" step="1" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="efficiency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Efficiency (%)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

             <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Technology Type</FormLabel>
                    <FormControl><Input placeholder="e.g. PEM, Methanol" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fuelConsumptionPerKwh"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fuel Cons. (kg/kWh)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.001" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Saving..." : "Save Equipment"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
