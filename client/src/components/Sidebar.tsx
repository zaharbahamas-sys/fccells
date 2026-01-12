import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Calculator, 
  Database, 
  Settings, 
  Zap,
  Menu,
  X,
  RefreshCw,
  LogOut,
  Fuel,
  Wifi,
  FileText,
  Lightbulb,
  ShieldCheck,
  Quote,
  Target,
  BarChart3,
  Leaf,
  Globe,
  BookOpen,
  Languages
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useSettings } from "@/contexts/SettingsContext";
import fcpmsLogo from "@/lib/logo";

const NAV_ITEMS_EN = [
  { label: "Dashboard", labelAr: "لوحة التحكم", href: "/", icon: LayoutDashboard, testId: "nav-dashboard" },
  { label: "Case Studies", labelAr: "دراسات الحالة", href: "/case-studies", icon: FileText, testId: "nav-case-studies" },
  { label: "H2 Strategy", labelAr: "استراتيجية H2", href: "/h2-strategy", icon: Globe, testId: "nav-h2-strategy" },
  { label: "Sizing Tool", labelAr: "أداة التحجيم", href: "/sizing", icon: Calculator, testId: "nav-sizing" },
  { label: "Asset Optimizer", labelAr: "محسن الأصول", href: "/optimizer", icon: RefreshCw, testId: "nav-optimizer" },
  { label: "Remote Monitoring", labelAr: "المراقبة عن بعد", href: "/monitoring", icon: Wifi, testId: "nav-monitoring" },
  { label: "Inventory", labelAr: "المخزون", href: "/catalog", icon: Database, testId: "nav-catalog" },
  { label: "Fuel Cell Library", labelAr: "مكتبة خلايا الوقود", href: "/fuel-cells", icon: Fuel, testId: "nav-fuel-cells" },
  { label: "Settings", labelAr: "الإعدادات", href: "/settings", icon: Settings, testId: "nav-settings" },
];

export function Sidebar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const { language, updatePreferences, isRTL } = useSettings();

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Sidebar Container */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-40 bg-slate-950 text-slate-100 transform transition-all duration-300 ease-in-out lg:translate-x-0 border-r border-slate-800/50",
          isOpen ? "w-64 translate-x-0" : "w-20 -translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full bg-gradient-to-b from-[#1E293B] via-[#1E293B] to-[#22C55E]/20">
          {/* Brand / Menu Toggle */}
          <div 
            className="flex flex-col items-center py-4 border-b border-slate-800 cursor-pointer hover:bg-slate-900/50 transition-colors"
            onClick={toggleSidebar}
          >
            {isOpen ? (
              <div className="flex flex-col items-center gap-3 animate-in fade-in duration-300">
                <div className="relative">
                  <div className="absolute -inset-3 bg-emerald-500/40 blur-xl rounded-full" />
                  <div className="relative w-20 h-20 overflow-hidden rounded-xl">
                    <img 
                      src={fcpmsLogo} 
                      alt="FCPMS Logo" 
                      className="w-full h-full object-contain"
                      style={{filter: "drop-shadow(0 0 6px rgba(34, 197, 94, 0.5))"}}
                    />
                  </div>
                </div>
                <span className="text-sm font-black bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent tracking-widest">FCPMS</span>
              </div>
            ) : (
              <div className="relative mx-auto">
                <div className="absolute -inset-2 bg-emerald-500/40 blur-lg rounded-full" />
                <div className="relative w-12 h-12 overflow-hidden rounded-lg">
                  <img 
                    src={fcpmsLogo} 
                    alt="FCPMS Logo" 
                    className="w-full h-full object-contain"
                    style={{filter: "drop-shadow(0 0 4px rgba(34, 197, 94, 0.5))"}}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-6 space-y-2 overflow-x-hidden">
            {NAV_ITEMS_EN.map((item) => {
              const isActive = location === item.href;
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <div 
                    className={cn(
                      "flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer group",
                      isActive 
                        ? "bg-primary text-white shadow-lg shadow-primary/20" 
                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                    )}
                    data-testid={item.testId}
                  >
                    <Icon className={cn("w-6 h-6 shrink-0 transition-colors", isActive ? "text-white" : "text-slate-400 group-hover:text-white", isOpen ? (isRTL ? "ml-3" : "mr-3") : "mx-auto")} />
                    {isOpen && <span className="truncate animate-in fade-in duration-300">{language === "ar" ? item.labelAr : item.label}</span>}
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* User Profile / Footer */}
          <div className="p-4 border-t border-slate-800 space-y-3">
            <button
              onClick={() => updatePreferences({ language: language === "ar" ? "en" : "ar" })}
              className="w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors mb-2"
            >
              <Languages className={cn("w-5 h-5 shrink-0", isOpen ? (isRTL ? "ml-3" : "mr-3") : "mx-auto")} />
              {isOpen && <span className="animate-in fade-in duration-300">{language === "ar" ? "English" : "عربي"}</span>}
            </button>
            <Link href="/blog">
              <div 
                className={cn(
                  "flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer group mb-2",
                  location === "/blog"
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" 
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                )}
                data-testid="nav-blog-bottom"
              >
                <BookOpen className={cn("w-6 h-6 shrink-0 transition-colors", location === "/blog" ? "text-white" : "text-slate-400 group-hover:text-white", isOpen ? (isRTL ? "ml-3" : "mr-3") : "mx-auto")} />
                {isOpen && <span className="truncate animate-in fade-in duration-300">{language === "ar" ? "المدونة" : "Blog"}</span>}
              </div>
            </Link>
            <Link href="/settings">
              <div className="bg-slate-800/50 rounded-lg p-3 flex items-center overflow-hidden cursor-pointer hover:bg-slate-700/50 transition-colors">
                {user?.profileImageUrl ? (
                  <img 
                    src={user.profileImageUrl} 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center text-xs font-bold text-white shrink-0">
                    {user?.firstName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
                {isOpen && (
                  <div className="ml-3 truncate animate-in fade-in duration-300">
                    <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
                    <p className="text-xs text-slate-500 truncate">User</p>
                  </div>
                )}
              </div>
            </Link>
            <button
              onClick={() => logout()}
              className="w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              data-testid="button-logout"
            >
              <LogOut className={cn("w-4 h-4 shrink-0", isOpen ? (isRTL ? "ml-3" : "mr-3") : "mx-auto")} />
              {isOpen && <span className="animate-in fade-in duration-300">{language === "ar" ? "تسجيل الخروج" : "Logout"}</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Menu Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="fixed bottom-4 left-4 z-50 lg:hidden w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-lg shadow-emerald-500/30 flex items-center justify-center transition-all duration-300"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>
    </>
  );
}
