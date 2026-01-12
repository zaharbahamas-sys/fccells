import { Sidebar } from "@/components/Sidebar";
import { useProject, useDeleteProject } from "@/hooks/use-projects";
import { useRoute, useLocation } from "wouter";
import { Loader2, Trash2, ArrowLeft, Battery, Gauge, Zap, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { KPICard } from "@/components/KPICard";
import { format } from "date-fns";
import { usePythonServices } from "@/hooks/use-python-services";
import { useToast } from "@/hooks/use-toast";

export default function ProjectDetails() {
  const [, params] = useRoute("/projects/:id");
  const [, setLocation] = useLocation();
  const projectId = parseInt(params?.id || "0");
  const { generateDiagram, isLoading: isGeneratingDiagram } = usePythonServices();
  const { toast } = useToast();
  
  const { data: project, isLoading } = useProject(projectId);
  const deleteMutation = useDeleteProject();

  const handleDelete = () => {
    deleteMutation.mutate(projectId, {
      onSuccess: () => setLocation("/")
    });
  };

  const handleGenerateDiagram = async () => {
    if (!project) return;
    const result = await generateDiagram({
      type: 'system',
      load: project.loadKw,
      fcPower: project.fuelCellId ? 10 : 5,
      batteryCapacity: project.requiredBatteryKwh || 0,
      h2Cylinders: project.dailyFuelConsumption ? Math.ceil(project.dailyFuelConsumption / 7) : 1
    });

    if (result.success) {
      toast({
        title: "Success",
        description: "System diagram generated and downloaded.",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to generate diagram. Please check if Graphviz is installed.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center flex-col">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Project Not Found</h1>
        <Button onClick={() => setLocation("/")}>Return to Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 lg:ml-20">
        <Button variant="ghost" className="mb-6 pl-0 hover:bg-transparent hover:text-primary" onClick={() => setLocation("/")}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Button>

        <header className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{project.name}</h1>
            <p className="text-slate-500 mt-2 text-lg">{project.description || "No description provided."}</p>
            <div className="mt-4 flex items-center text-sm text-muted-foreground">
              <span>Created on {format(new Date(project.createdAt!), 'MMMM d, yyyy')}</span>
              <span className="mx-2">•</span>
              <span>ID: #{project.id}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={handleGenerateDiagram}
              disabled={isGeneratingDiagram}
            >
              {isGeneratingDiagram ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ImageIcon className="w-4 h-4 mr-2" />}
              Generate Diagram
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="bg-red-50 text-red-600 hover:bg-red-100 border border-red-200">
                  <Trash2 className="w-4 h-4 mr-2" /> Delete Project
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the project
                    and remove its data from the server.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
           <KPICard 
             title="Site Load" 
             value={project.loadKw} 
             unit="kW" 
             icon={Zap}
             className="border-t-4 border-t-primary"
           />
           <KPICard 
             title="Autonomy" 
             value={project.autonomyHours} 
             unit="Hours" 
             icon={Gauge}
             className="border-t-4 border-t-blue-400"
           />
           <KPICard 
             title="Battery Req." 
             value={project.requiredBatteryKwh?.toFixed(1) || "-"} 
             unit="kWh" 
             icon={Battery}
             className="border-t-4 border-t-emerald-500"
           />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-border/50 p-8">
          <h3 className="text-xl font-bold mb-6">Technical Specification Report</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Power System</h4>
                <div className="flex justify-between py-3 border-b border-slate-100">
                  <span className="text-slate-700">System Voltage</span>
                  <span className="font-mono font-medium">{project.systemVoltage} VDC</span>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100">
                  <span className="text-slate-700">Daily Fuel Consumption</span>
                  <span className="font-mono font-medium">{project.dailyFuelConsumption?.toFixed(2)} kg</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
               <div>
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Infrastructure</h4>
                <div className="flex justify-between py-3 border-b border-slate-100">
                  <span className="text-slate-700">Rec. Cable Size</span>
                  <span className="font-mono font-medium">{project.recommendedCableSizeMm2} mm²</span>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100">
                  <span className="text-slate-700">Equipment Type</span>
                  <span className="font-mono font-medium">Fuel Cell (PEM)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
