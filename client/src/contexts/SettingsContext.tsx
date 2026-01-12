import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { translations, TranslationKey, Language } from "@/lib/translations";

export type UnitSystem = "metric" | "imperial";
export type TemperatureUnit = "celsius" | "fahrenheit";
export type PressureUnit = "bar" | "psi";
export type CurrencyUnit = "USD" | "EUR" | "GBP" | "SAR" | "AED";

export type ColorTheme = "light" | "dark" | "system" | "blue" | "green" | "purple" | "sunset";
export type VisualStyle = "modern" | "classic" | "minimal" | "sudanese";

export interface UserPreferences {
  theme: ColorTheme;
  visualStyle: VisualStyle;
  language: "en" | "ar";
  compactMode: boolean;
  showTutorials: boolean;
  autoSaveProjects: boolean;
}

export interface UnitSettings {
  system: UnitSystem;
  temperature: TemperatureUnit;
  pressure: PressureUnit;
  currency: CurrencyUnit;
}

export interface CalculationDefaults {
  defaultDeratingTemp: number;
  defaultAltitude: number;
  defaultAutonomyHours: number;
  defaultSystemVoltage: number;
  defaultBatteryDod: number;
  defaultBatteryBufferHours: number;
  defaultDieselPrice: number;
  defaultH2Price: number;
  defaultPilferageFactor: number;
  defaultLogisticsCost: number;
  defaultRefuelingCycleDays: number;
  defaultDgCapacity: number;
}

export interface AppSettings {
  preferences: UserPreferences;
  units: UnitSettings;
  calculationDefaults: CalculationDefaults;
}

const defaultSettings: AppSettings = {
  preferences: {
    theme: "system",
    visualStyle: "sudanese",
    language: "en",
    compactMode: false,
    showTutorials: true,
    autoSaveProjects: true,
  },
  units: {
    system: "metric",
    temperature: "celsius",
    pressure: "bar",
    currency: "USD",
  },
  calculationDefaults: {
    defaultDeratingTemp: 45,
    defaultAltitude: 0,
    defaultAutonomyHours: 8,
    defaultSystemVoltage: 48,
    defaultBatteryDod: 80,
    defaultBatteryBufferHours: 2,
    defaultDieselPrice: 0.8,
    defaultH2Price: 8,
    defaultPilferageFactor: 15,
    defaultLogisticsCost: 20,
    defaultRefuelingCycleDays: 14,
    defaultDgCapacity: 20,
  },
};

interface SettingsContextType {
  settings: AppSettings;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  updateUnits: (units: Partial<UnitSettings>) => void;
  updateCalculationDefaults: (defaults: Partial<CalculationDefaults>) => void;
  resetToDefaults: () => void;
  convertTemperature: (value: number, to: TemperatureUnit) => number;
  convertPressure: (value: number, to: PressureUnit) => number;
  formatCurrency: (value: number) => string;
  t: (key: TranslationKey) => string;
  language: Language;
  isRTL: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const STORAGE_KEY = "fcpms_settings";

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...defaultSettings, ...parsed };
      }
    } catch (e) {
      console.error("Failed to load settings:", e);
    }
    return defaultSettings;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error("Failed to save settings:", e);
    }
  }, [settings]);

  useEffect(() => {
    const theme = settings.preferences.theme;
    const root = document.documentElement;
    
    root.classList.remove("dark", "theme-blue", "theme-green", "theme-purple", "theme-sunset");
    
    if (theme === "dark") {
      root.classList.add("dark");
    } else if (theme === "blue") {
      root.classList.add("theme-blue");
    } else if (theme === "green") {
      root.classList.add("theme-green");
    } else if (theme === "purple") {
      root.classList.add("theme-purple");
    } else if (theme === "sunset") {
      root.classList.add("theme-sunset");
    } else if (theme === "system") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDark) {
        root.classList.add("dark");
      }
    }
  }, [settings.preferences.theme]);

  useEffect(() => {
    const visualStyle = settings.preferences.visualStyle;
    const root = document.documentElement;
    
    root.classList.remove("style-modern", "style-classic", "style-minimal", "style-sudanese");
    root.classList.add(`style-${visualStyle}`);
  }, [settings.preferences.visualStyle]);

  const updatePreferences = (prefs: Partial<UserPreferences>) => {
    setSettings(prev => ({
      ...prev,
      preferences: { ...prev.preferences, ...prefs },
    }));
  };

  const updateUnits = (units: Partial<UnitSettings>) => {
    setSettings(prev => ({
      ...prev,
      units: { ...prev.units, ...units },
    }));
  };

  const updateCalculationDefaults = (defaults: Partial<CalculationDefaults>) => {
    setSettings(prev => ({
      ...prev,
      calculationDefaults: { ...prev.calculationDefaults, ...defaults },
    }));
  };

  const resetToDefaults = () => {
    setSettings(defaultSettings);
  };

  const convertTemperature = (value: number, to: TemperatureUnit): number => {
    if (to === "fahrenheit") {
      return (value * 9/5) + 32;
    }
    return (value - 32) * 5/9;
  };

  const convertPressure = (value: number, to: PressureUnit): number => {
    if (to === "psi") {
      return value * 14.5038;
    }
    return value / 14.5038;
  };

  const formatCurrency = (value: number): string => {
    const symbols: Record<CurrencyUnit, string> = {
      USD: "$",
      EUR: "€",
      GBP: "£",
      SAR: "﷼",
      AED: "د.إ",
    };
    return `${symbols[settings.units.currency]}${value.toLocaleString()}`;
  };

  const language = settings.preferences.language;
  const isRTL = language === "ar";
  
  const t = useCallback((key: TranslationKey): string => {
    return translations[language][key] || translations.en[key] || key;
  }, [language]);

  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [isRTL, language]);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updatePreferences,
        updateUnits,
        updateCalculationDefaults,
        resetToDefaults,
        convertTemperature,
        convertPressure,
        formatCurrency,
        t,
        language,
        isRTL,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
