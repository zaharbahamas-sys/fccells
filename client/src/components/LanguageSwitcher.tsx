import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSettings } from "@/contexts/SettingsContext";

export function LanguageSwitcher() {
  const { settings, updatePreferences, language } = useSettings();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
        >
          <Globe className="w-4 h-4" />
          <span className="font-medium">{language === "ar" ? "عربي" : "EN"}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[120px]">
        <DropdownMenuItem 
          onClick={() => updatePreferences({ language: "en" })}
          className={language === "en" ? "bg-emerald-50 text-emerald-700" : ""}
        >
          <span className="font-medium">English</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => updatePreferences({ language: "ar" })}
          className={language === "ar" ? "bg-emerald-50 text-emerald-700" : ""}
        >
          <span className="font-medium">العربية</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function LanguageSwitcherDark() {
  const { settings, updatePreferences, language } = useSettings();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2 border-slate-200 hover:bg-slate-50"
        >
          <Globe className="w-4 h-4" />
          <span className="font-medium">{language === "ar" ? "عربي" : "EN"}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[120px]">
        <DropdownMenuItem 
          onClick={() => updatePreferences({ language: "en" })}
          className={language === "en" ? "bg-emerald-50 text-emerald-700" : ""}
        >
          <span className="font-medium">English</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => updatePreferences({ language: "ar" })}
          className={language === "ar" ? "bg-emerald-50 text-emerald-700" : ""}
        >
          <span className="font-medium">العربية</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
