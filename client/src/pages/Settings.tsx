import { useState, useRef, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { useSettings } from "@/contexts/SettingsContext";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { 
  Settings as SettingsIcon, 
  Palette, 
  Globe, 
  Calculator,
  RotateCcw,
  Save,
  Sun,
  Moon,
  Monitor,
  Thermometer,
  Gauge,
  DollarSign,
  Fuel,
  Battery,
  Zap,
  User,
  Camera,
  Lock,
  Eye,
  EyeOff
} from "lucide-react";
import { TelecomGreenEnergySilhouette } from "@/components/CinematicBackgrounds";

export default function Settings() {
  const { settings, updatePreferences, updateUnits, updateCalculationDefaults, resetToDefaults, language, isRTL } = useSettings();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const settingsText = {
    en: {
      settings: "Settings",
      customizeExperience: "Customize your experience and calculation defaults",
      resetToDefaults: "Reset to Defaults",
      profile: "Profile",
      preferences: "Preferences",
      units: "Units",
      calculations: "Calculations",
      personalInfo: "Personal Information",
      updateProfileDesc: "Update your profile photo and personal details",
      changePhoto: "Change Photo",
      removePhoto: "Remove Photo",
      firstName: "First Name",
      lastName: "Last Name",
      emailAddress: "Email Address",
      jobTitle: "Job Title",
      saveChanges: "Save Changes",
      changePassword: "Change Password",
      changePasswordDesc: "Update your account password",
      currentPassword: "Current Password",
      newPassword: "New Password",
      confirmPassword: "Confirm Password",
      updatePassword: "Update Password",
      passwordsNoMatch: "New passwords do not match",
      theme: "Theme",
      selectTheme: "Select your preferred theme",
      light: "Light",
      dark: "Dark",
      systemTheme: "System",
      colorScheme: "Color Scheme",
      selectColor: "Choose your accent color",
      visualStyle: "Visual Style",
      selectStyle: "Choose your interface style",
      languageLabel: "Language",
      selectLanguage: "Select your preferred language",
      english: "English",
      arabic: "العربية",
      currency: "Currency",
      selectCurrency: "Set your preferred currency display",
      temperatureUnit: "Temperature Unit",
      pressureUnit: "Pressure Unit",
      diesel: "Diesel Defaults",
      hydrogen: "Hydrogen Defaults",
      battery: "Battery Defaults",
      systemDefaults: "System Defaults",
      dieselPrice: "Diesel Price",
      generatorCapex: "Generator CAPEX",
      hydrogenPrice: "Hydrogen Price",
      fuelCellCapex: "Fuel Cell CAPEX",
      batteryDod: "Battery DOD",
      batteryBuffer: "Battery Buffer",
      systemVoltage: "System Voltage",
      refuelingCycle: "Refueling Cycle",
      pilferageFactor: "Pilferage Factor",
      logisticsCost: "Logistics Cost %",
    },
    ar: {
      settings: "الإعدادات",
      customizeExperience: "تخصيص تجربتك وإعدادات الحساب الافتراضية",
      resetToDefaults: "إعادة التعيين للافتراضي",
      profile: "الملف الشخصي",
      preferences: "التفضيلات",
      units: "الوحدات",
      calculations: "الحسابات",
      personalInfo: "المعلومات الشخصية",
      updateProfileDesc: "تحديث صورة الملف الشخصي والتفاصيل الشخصية",
      changePhoto: "تغيير الصورة",
      removePhoto: "إزالة الصورة",
      firstName: "الاسم الأول",
      lastName: "اسم العائلة",
      emailAddress: "البريد الإلكتروني",
      jobTitle: "المسمى الوظيفي",
      saveChanges: "حفظ التغييرات",
      changePassword: "تغيير كلمة المرور",
      changePasswordDesc: "تحديث كلمة مرور حسابك",
      currentPassword: "كلمة المرور الحالية",
      newPassword: "كلمة المرور الجديدة",
      confirmPassword: "تأكيد كلمة المرور",
      updatePassword: "تحديث كلمة المرور",
      passwordsNoMatch: "كلمات المرور الجديدة غير متطابقة",
      theme: "السمة",
      selectTheme: "اختر السمة المفضلة لديك",
      light: "فاتح",
      dark: "داكن",
      systemTheme: "النظام",
      colorScheme: "نظام الألوان",
      selectColor: "اختر لون التمييز",
      visualStyle: "النمط المرئي",
      selectStyle: "اختر نمط الواجهة",
      languageLabel: "اللغة",
      selectLanguage: "اختر لغتك المفضلة",
      english: "English",
      arabic: "العربية",
      currency: "العملة",
      selectCurrency: "تعيين عرض العملة المفضلة",
      temperatureUnit: "وحدة الحرارة",
      pressureUnit: "وحدة الضغط",
      diesel: "إعدادات الديزل",
      hydrogen: "إعدادات الهيدروجين",
      battery: "إعدادات البطارية",
      systemDefaults: "إعدادات النظام",
      dieselPrice: "سعر الديزل",
      generatorCapex: "تكلفة المولد",
      hydrogenPrice: "سعر الهيدروجين",
      fuelCellCapex: "تكلفة خلية الوقود",
      batteryDod: "عمق تفريغ البطارية",
      batteryBuffer: "احتياطي البطارية",
      systemVoltage: "جهد النظام",
      refuelingCycle: "دورة التزود بالوقود",
      pilferageFactor: "عامل السرقة",
      logisticsCost: "نسبة تكلفة اللوجستيات",
    },
  };
  
  const txt = settingsText[language];
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [jobTitle, setJobTitle] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(user?.profileImageUrl || "");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setJobTitle("");
      setProfilePhoto(user.profileImageUrl || "");
    }
  }, [user]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image under 2MB.",
          variant: "destructive",
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfilePhoto(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setIsSavingProfile(true);
    try {
      const res = await fetch(`/api/user/${user.id}/profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, jobTitle, profilePhoto }),
      });
      const data = await res.json();
      if (data.success) {
        setUser({ ...user, firstName, lastName, jobTitle, profilePhoto });
        toast({
          title: "Profile Updated",
          description: "Your profile has been saved successfully.",
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (!user) return;
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }
    if (newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters.",
        variant: "destructive",
      });
      return;
    }
    setIsChangingPassword(true);
    try {
      const res = await fetch(`/api/user/${user.id}/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (data.success) {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        toast({
          title: "Password Changed",
          description: "Your password has been updated successfully.",
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to change password",
        variant: "destructive",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleReset = () => {
    resetToDefaults();
    toast({
      title: "Settings Reset",
      description: "All settings have been restored to defaults.",
    });
  };

  return (
    <div className={`min-h-screen bg-[#F8FAFC] flex relative overflow-hidden ${isRTL ? 'rtl' : 'ltr'}`}>
      <TelecomGreenEnergySilhouette />
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 lg:ml-20 relative z-10">
        <header className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <SettingsIcon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              {txt.settings}
            </h1>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1">
              {txt.customizeExperience}
            </p>
          </div>
          <Button variant="outline" onClick={handleReset} className="w-fit text-sm" data-testid="button-reset-settings">
            <RotateCcw className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {txt.resetToDefaults}
          </Button>
        </header>

        <Tabs defaultValue="profile" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full max-w-full sm:max-w-2xl grid-cols-2 sm:grid-cols-4 h-auto sm:h-10">
            <TabsTrigger value="profile" data-testid="tab-profile">
              <User className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {txt.profile}
            </TabsTrigger>
            <TabsTrigger value="preferences" data-testid="tab-preferences">
              <Palette className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {txt.preferences}
            </TabsTrigger>
            <TabsTrigger value="units" data-testid="tab-units">
              <Globe className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {txt.units}
            </TabsTrigger>
            <TabsTrigger value="calculations" data-testid="tab-calculations">
              <Calculator className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {txt.calculations}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  {txt.personalInfo}
                </CardTitle>
                <CardDescription>{txt.updateProfileDesc}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row items-start gap-6">
                  <div className="flex flex-col items-center gap-3">
                    <Avatar className="w-24 h-24">
                      {profilePhoto ? (
                        <AvatarImage src={profilePhoto} alt="Profile" />
                      ) : null}
                      <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                        {firstName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handlePhotoUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Camera className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      {txt.changePhoto}
                    </Button>
                    {profilePhoto && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setProfilePhoto("")}
                        className="text-destructive hover:text-destructive"
                      >
                        {txt.removePhoto}
                      </Button>
                    )}
                  </div>

                  <div className="flex-1 space-y-4 w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>{txt.firstName}</Label>
                        <Input
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="Enter first name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Last Name</Label>
                        <Input
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Enter last name"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Job Title</Label>
                      <Input
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        placeholder="e.g. Energy Systems Strategist & Senior Maintenance Engineer"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email / Phone</Label>
                      <Input
                        value={user?.email || ""}
                        disabled
                        className="bg-slate-100"
                      />
                      <p className="text-xs text-muted-foreground">Contact information cannot be changed</p>
                    </div>
                    <div className="pt-2">
                      <Button onClick={handleSaveProfile} disabled={isSavingProfile}>
                        <Save className="w-4 h-4 mr-2" />
                        {isSavingProfile ? "Saving..." : "Save Profile"}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Change Password
                </CardTitle>
                <CardDescription>Update your account password</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <Label>Current Password</Label>
                  <div className="relative">
                    <Input
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>New Password</Label>
                  <div className="relative">
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Confirm New Password</Label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                  />
                </div>
                <div className="pt-2">
                  <Button 
                    onClick={handleChangePassword} 
                    disabled={isChangingPassword || !currentPassword || !newPassword || !confirmPassword}
                    variant="outline"
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    {isChangingPassword ? "Changing..." : "Change Password"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Color Theme
                </CardTitle>
                <CardDescription>Choose your preferred color scheme</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                  <button
                    onClick={() => updatePreferences({ theme: "light" })}
                    className={`p-4 rounded-lg border-2 transition-all ${settings.preferences.theme === "light" ? "border-primary ring-2 ring-primary/20" : "border-slate-200 hover:border-slate-300"}`}
                  >
                    <div className="w-full h-12 rounded-md bg-gradient-to-br from-white to-slate-100 border mb-2" />
                    <div className="flex items-center justify-center gap-1">
                      <Sun className="w-3 h-3" />
                      <span className="text-xs font-medium">Light</span>
                    </div>
                  </button>
                  <button
                    onClick={() => updatePreferences({ theme: "dark" })}
                    className={`p-4 rounded-lg border-2 transition-all ${settings.preferences.theme === "dark" ? "border-primary ring-2 ring-primary/20" : "border-slate-200 hover:border-slate-300"}`}
                  >
                    <div className="w-full h-12 rounded-md bg-gradient-to-br from-slate-800 to-slate-900 mb-2" />
                    <div className="flex items-center justify-center gap-1">
                      <Moon className="w-3 h-3" />
                      <span className="text-xs font-medium">Dark</span>
                    </div>
                  </button>
                  <button
                    onClick={() => updatePreferences({ theme: "system" })}
                    className={`p-4 rounded-lg border-2 transition-all ${settings.preferences.theme === "system" ? "border-primary ring-2 ring-primary/20" : "border-slate-200 hover:border-slate-300"}`}
                  >
                    <div className="w-full h-12 rounded-md bg-gradient-to-r from-white via-slate-400 to-slate-800 mb-2" />
                    <div className="flex items-center justify-center gap-1">
                      <Monitor className="w-3 h-3" />
                      <span className="text-xs font-medium">System</span>
                    </div>
                  </button>
                  <button
                    onClick={() => updatePreferences({ theme: "blue" })}
                    className={`p-4 rounded-lg border-2 transition-all ${settings.preferences.theme === "blue" ? "border-primary ring-2 ring-primary/20" : "border-slate-200 hover:border-slate-300"}`}
                  >
                    <div className="w-full h-12 rounded-md bg-gradient-to-br from-blue-400 to-blue-600 mb-2" />
                    <span className="text-xs font-medium">Blue</span>
                  </button>
                  <button
                    onClick={() => updatePreferences({ theme: "green" })}
                    className={`p-4 rounded-lg border-2 transition-all ${settings.preferences.theme === "green" ? "border-primary ring-2 ring-primary/20" : "border-slate-200 hover:border-slate-300"}`}
                  >
                    <div className="w-full h-12 rounded-md bg-gradient-to-br from-green-400 to-green-600 mb-2" />
                    <span className="text-xs font-medium">Green</span>
                  </button>
                  <button
                    onClick={() => updatePreferences({ theme: "purple" })}
                    className={`p-4 rounded-lg border-2 transition-all ${settings.preferences.theme === "purple" ? "border-primary ring-2 ring-primary/20" : "border-slate-200 hover:border-slate-300"}`}
                  >
                    <div className="w-full h-12 rounded-md bg-gradient-to-br from-purple-400 to-purple-600 mb-2" />
                    <span className="text-xs font-medium">Purple</span>
                  </button>
                  <button
                    onClick={() => updatePreferences({ theme: "sunset" })}
                    className={`p-4 rounded-lg border-2 transition-all ${settings.preferences.theme === "sunset" ? "border-primary ring-2 ring-primary/20" : "border-slate-200 hover:border-slate-300"}`}
                  >
                    <div className="w-full h-12 rounded-md bg-gradient-to-br from-orange-400 to-rose-500 mb-2" />
                    <span className="text-xs font-medium">Sunset</span>
                  </button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Visual Style
                </CardTitle>
                <CardDescription>Choose the overall look and feel</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <button
                    onClick={() => updatePreferences({ visualStyle: "sudanese" })}
                    className={`p-4 rounded-lg border-2 transition-all ${settings.preferences.visualStyle === "sudanese" ? "border-primary ring-2 ring-primary/20" : "border-slate-200 hover:border-slate-300"}`}
                  >
                    <div className="w-full h-16 rounded-lg bg-gradient-to-br from-amber-100 via-green-100 to-emerald-200 mb-2 flex items-center justify-center">
                      <span className="text-2xl">🏛️</span>
                    </div>
                    <span className="text-sm font-medium">Sudanese</span>
                    <p className="text-xs text-muted-foreground">Heritage theme</p>
                  </button>
                  <button
                    onClick={() => updatePreferences({ visualStyle: "modern" })}
                    className={`p-4 rounded-lg border-2 transition-all ${settings.preferences.visualStyle === "modern" ? "border-primary ring-2 ring-primary/20" : "border-slate-200 hover:border-slate-300"}`}
                  >
                    <div className="w-full h-16 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 mb-2 flex items-center justify-center">
                      <span className="text-2xl">✨</span>
                    </div>
                    <span className="text-sm font-medium">Modern</span>
                    <p className="text-xs text-muted-foreground">Clean & sleek</p>
                  </button>
                  <button
                    onClick={() => updatePreferences({ visualStyle: "classic" })}
                    className={`p-4 rounded-lg border-2 transition-all ${settings.preferences.visualStyle === "classic" ? "border-primary ring-2 ring-primary/20" : "border-slate-200 hover:border-slate-300"}`}
                  >
                    <div className="w-full h-16 rounded bg-gradient-to-br from-stone-100 to-stone-200 mb-2 flex items-center justify-center">
                      <span className="text-2xl">📋</span>
                    </div>
                    <span className="text-sm font-medium">Classic</span>
                    <p className="text-xs text-muted-foreground">Traditional look</p>
                  </button>
                  <button
                    onClick={() => updatePreferences({ visualStyle: "minimal" })}
                    className={`p-4 border-2 transition-all ${settings.preferences.visualStyle === "minimal" ? "border-primary ring-2 ring-primary/20" : "border-slate-200 hover:border-slate-300"}`}
                  >
                    <div className="w-full h-16 bg-white border mb-2 flex items-center justify-center">
                      <span className="text-2xl">◻️</span>
                    </div>
                    <span className="text-sm font-medium">Minimal</span>
                    <p className="text-xs text-muted-foreground">No frills</p>
                  </button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Display Options</CardTitle>
                <CardDescription>Other appearance settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Compact Mode</Label>
                    <p className="text-sm text-muted-foreground">Use a denser layout with less spacing</p>
                  </div>
                  <Switch
                    checked={settings.preferences.compactMode}
                    onCheckedChange={(checked) => updatePreferences({ compactMode: checked })}
                    data-testid="switch-compact-mode"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Language & Tutorials
                </CardTitle>
                <CardDescription>Language and help settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Language</Label>
                    <p className="text-sm text-muted-foreground">Select your preferred language</p>
                  </div>
                  <Select
                    value={settings.preferences.language}
                    onValueChange={(value: "en" | "ar") => updatePreferences({ language: value })}
                  >
                    <SelectTrigger className="w-40" data-testid="select-language">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ar">العربية (Arabic)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Show Guided Tours</Label>
                    <p className="text-sm text-muted-foreground">Display interactive tutorials for new users</p>
                  </div>
                  <Switch
                    checked={settings.preferences.showTutorials}
                    onCheckedChange={(checked) => updatePreferences({ showTutorials: checked })}
                    data-testid="switch-tutorials"
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Auto-Save Projects</Label>
                    <p className="text-sm text-muted-foreground">Automatically save project calculations</p>
                  </div>
                  <Switch
                    checked={settings.preferences.autoSaveProjects}
                    onCheckedChange={(checked) => updatePreferences({ autoSaveProjects: checked })}
                    data-testid="switch-autosave"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="units" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Unit System
                </CardTitle>
                <CardDescription>Configure measurement units for calculations and display</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="flex items-center gap-2">
                      <Gauge className="w-4 h-4" />
                      Measurement System
                    </Label>
                    <p className="text-sm text-muted-foreground">Primary unit system for distances and weights</p>
                  </div>
                  <Select
                    value={settings.units.system}
                    onValueChange={(value: "metric" | "imperial") => updateUnits({ system: value })}
                  >
                    <SelectTrigger className="w-40" data-testid="select-unit-system">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="metric">Metric (km, kg)</SelectItem>
                      <SelectItem value="imperial">Imperial (mi, lb)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="flex items-center gap-2">
                      <Thermometer className="w-4 h-4" />
                      Temperature
                    </Label>
                    <p className="text-sm text-muted-foreground">Temperature display units</p>
                  </div>
                  <Select
                    value={settings.units.temperature}
                    onValueChange={(value: "celsius" | "fahrenheit") => updateUnits({ temperature: value })}
                  >
                    <SelectTrigger className="w-40" data-testid="select-temperature">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="celsius">Celsius (C)</SelectItem>
                      <SelectItem value="fahrenheit">Fahrenheit (F)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="flex items-center gap-2">
                      <Gauge className="w-4 h-4" />
                      Pressure
                    </Label>
                    <p className="text-sm text-muted-foreground">Hydrogen cylinder pressure units</p>
                  </div>
                  <Select
                    value={settings.units.pressure}
                    onValueChange={(value: "bar" | "psi") => updateUnits({ pressure: value })}
                  >
                    <SelectTrigger className="w-40" data-testid="select-pressure">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bar">Bar</SelectItem>
                      <SelectItem value="psi">PSI</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Currency
                    </Label>
                    <p className="text-sm text-muted-foreground">Currency for financial calculations</p>
                  </div>
                  <Select
                    value={settings.units.currency}
                    onValueChange={(value: "USD" | "EUR" | "GBP" | "SAR" | "AED") => updateUnits({ currency: value })}
                  >
                    <SelectTrigger className="w-40" data-testid="select-currency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (Euro)</SelectItem>
                      <SelectItem value="GBP">GBP (Pound)</SelectItem>
                      <SelectItem value="SAR">SAR (Riyal)</SelectItem>
                      <SelectItem value="AED">AED (Dirham)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Unit Conversion Reference</CardTitle>
                <CardDescription>Quick reference for common conversions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 text-center">
                    <p className="text-muted-foreground text-xs uppercase mb-1">Temperature</p>
                    <p className="font-mono">0C = 32F</p>
                    <p className="font-mono">100C = 212F</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 text-center">
                    <p className="text-muted-foreground text-xs uppercase mb-1">Pressure</p>
                    <p className="font-mono">1 bar = 14.5 psi</p>
                    <p className="font-mono">200 bar = 2900 psi</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 text-center">
                    <p className="text-muted-foreground text-xs uppercase mb-1">Weight</p>
                    <p className="font-mono">1 kg = 2.2 lb</p>
                    <p className="font-mono">1 lb = 0.45 kg</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 text-center">
                    <p className="text-muted-foreground text-xs uppercase mb-1">Distance</p>
                    <p className="font-mono">1 km = 0.62 mi</p>
                    <p className="font-mono">1 mi = 1.61 km</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calculations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Site & Environment Defaults
                </CardTitle>
                <CardDescription>Default values for new calculations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Thermometer className="w-4 h-4" />
                      Max Temperature (C)
                    </Label>
                    <Input
                      type="number"
                      value={settings.calculationDefaults.defaultDeratingTemp}
                      onChange={(e) => updateCalculationDefaults({ defaultDeratingTemp: parseFloat(e.target.value) || 45 })}
                      data-testid="input-default-temp"
                    />
                    <p className="text-xs text-muted-foreground">Used for derating calculations</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Altitude (m)</Label>
                    <Input
                      type="number"
                      value={settings.calculationDefaults.defaultAltitude}
                      onChange={(e) => updateCalculationDefaults({ defaultAltitude: parseFloat(e.target.value) || 0 })}
                      data-testid="input-default-altitude"
                    />
                    <p className="text-xs text-muted-foreground">Site elevation above sea level</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Battery className="w-5 h-5" />
                  Battery & Power Defaults
                </CardTitle>
                <CardDescription>Default battery and power system parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>Autonomy (hours)</Label>
                    <Input
                      type="number"
                      value={settings.calculationDefaults.defaultAutonomyHours}
                      onChange={(e) => updateCalculationDefaults({ defaultAutonomyHours: parseFloat(e.target.value) || 8 })}
                      data-testid="input-default-autonomy"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>System Voltage (V)</Label>
                    <Select
                      value={settings.calculationDefaults.defaultSystemVoltage.toString()}
                      onValueChange={(value) => updateCalculationDefaults({ defaultSystemVoltage: parseInt(value) })}
                    >
                      <SelectTrigger data-testid="select-default-voltage">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="24">24V</SelectItem>
                        <SelectItem value="48">48V</SelectItem>
                        <SelectItem value="110">110V</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Battery DOD (%)</Label>
                    <Input
                      type="number"
                      min="50"
                      max="100"
                      value={settings.calculationDefaults.defaultBatteryDod}
                      onChange={(e) => updateCalculationDefaults({ defaultBatteryDod: parseFloat(e.target.value) || 80 })}
                      data-testid="input-default-dod"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Buffer Hours</Label>
                    <Input
                      type="number"
                      value={settings.calculationDefaults.defaultBatteryBufferHours}
                      onChange={(e) => updateCalculationDefaults({ defaultBatteryBufferHours: parseFloat(e.target.value) || 2 })}
                      data-testid="input-default-buffer"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Fuel className="w-5 h-5" />
                  Fuel & Cost Defaults
                </CardTitle>
                <CardDescription>Default pricing and cost parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Diesel Price ($/L)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={settings.calculationDefaults.defaultDieselPrice}
                      onChange={(e) => updateCalculationDefaults({ defaultDieselPrice: parseFloat(e.target.value) || 0.8 })}
                      data-testid="input-default-diesel-price"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Hydrogen Price ($/kg)</Label>
                    <Input
                      type="number"
                      step="0.5"
                      value={settings.calculationDefaults.defaultH2Price}
                      onChange={(e) => updateCalculationDefaults({ defaultH2Price: parseFloat(e.target.value) || 8 })}
                      data-testid="input-default-h2-price"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Theft/Loss Factor (%)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="50"
                      value={settings.calculationDefaults.defaultPilferageFactor}
                      onChange={(e) => updateCalculationDefaults({ defaultPilferageFactor: parseFloat(e.target.value) || 15 })}
                      data-testid="input-default-theft"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Logistics Cost (%)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="50"
                      value={settings.calculationDefaults.defaultLogisticsCost}
                      onChange={(e) => updateCalculationDefaults({ defaultLogisticsCost: parseFloat(e.target.value) || 20 })}
                      data-testid="input-default-logistics"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Refueling Cycle (days)</Label>
                    <Input
                      type="number"
                      value={settings.calculationDefaults.defaultRefuelingCycleDays}
                      onChange={(e) => updateCalculationDefaults({ defaultRefuelingCycleDays: parseFloat(e.target.value) || 14 })}
                      data-testid="input-default-refueling"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>DG Capacity (kVA)</Label>
                    <Input
                      type="number"
                      value={settings.calculationDefaults.defaultDgCapacity}
                      onChange={(e) => updateCalculationDefaults({ defaultDgCapacity: parseFloat(e.target.value) || 20 })}
                      data-testid="input-default-dg-capacity"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Current Defaults Summary</CardTitle>
                <CardDescription>Quick overview of your calculation defaults</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Temp: {settings.calculationDefaults.defaultDeratingTemp}C</Badge>
                  <Badge variant="outline">Altitude: {settings.calculationDefaults.defaultAltitude}m</Badge>
                  <Badge variant="outline">Autonomy: {settings.calculationDefaults.defaultAutonomyHours}h</Badge>
                  <Badge variant="outline">Voltage: {settings.calculationDefaults.defaultSystemVoltage}V</Badge>
                  <Badge variant="outline">DOD: {settings.calculationDefaults.defaultBatteryDod}%</Badge>
                  <Badge variant="outline">Buffer: {settings.calculationDefaults.defaultBatteryBufferHours}h</Badge>
                  <Badge variant="outline">Diesel: ${settings.calculationDefaults.defaultDieselPrice}/L</Badge>
                  <Badge variant="outline">H2: ${settings.calculationDefaults.defaultH2Price}/kg</Badge>
                  <Badge variant="outline">Theft: {settings.calculationDefaults.defaultPilferageFactor}%</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
