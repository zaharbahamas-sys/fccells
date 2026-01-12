import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, Lock, Mail, User, Building, Loader2 } from "lucide-react";
import fcpmsLogo from "@/lib/logo";
import { CinematicLoginBackground } from "@/components/CinematicLoginBackground";
import { useSettings } from "@/contexts/SettingsContext";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

const translations = {
  ar: {
    tagline: "حيث يلتقي التراث بالمستقبل الرقمي",
    inspireQuote: "نحن لسنا سادة الطبيعة، بل جزء حيوي من تنوعها البيولوجي الشاسع. لفترة طويلة جداً، أخذنا منها؛ والآن، يمنحنا العالم الفرصة القصوى للعطاء. من خلال تبني التطور والتقدم العالمي، يمكننا شفاء الأنظمة التي تحافظ علينا. حان الوقت للنهوض — من أجل أنفسنا، ومن أجل بعضنا البعض، ومن أجل الأرض.",
    quranVerse: "﴿ ۞ وَإِلَىٰ ثَمُودَ أَخَاهُمْ صَالِحًا ۚ قَالَ يَا قَوْمِ اعْبُدُوا اللَّهَ مَا لَكُم مِّنْ إِلَٰهٍ غَيْرُهُ ۖ هُوَ أَنشَأَكُم مِّنَ الْأَرْضِ وَاسْتَعْمَرَكُمْ فِيهَا فَاسْتَغْفِرُوهُ ثُمَّ تُوبُوا إِلَيْهِ ۚ إِنَّ رَبِّي قَرِيبٌ مُّجِيبٌ ﴾",
    quranRef: "سورة هود (الآية ٦١)",
    seizeOpportunity: "الدخول للمنظومة",
    lang: "EN",
    enterEcosystem: "الدخول للمنظومة",
    signIn: "تسجيل الدخول",
    signUp: "إنشاء حساب",
    email: "البريد الإلكتروني",
    phone: "رقم الهاتف",
    password: "كلمة المرور",
    confirmPassword: "تأكيد كلمة المرور",
    firstName: "الاسم الأول",
    lastName: "اسم العائلة",
    organization: "المؤسسة (اختياري)",
    back: "رجوع",
    continueWithGoogle: "المتابعة مع Google",
    orContinueWith: "أو المتابعة باستخدام",
    sendOtp: "إرسال رمز التحقق",
    verifyOtp: "تحقق من الرمز",
    otpCode: "رمز التحقق",
    register: "تسجيل",
    loggingIn: "جاري تسجيل الدخول...",
    registering: "جاري التسجيل...",
    pendingApproval: "حسابك قيد المراجعة",
    invalidCredentials: "بيانات الدخول غير صحيحة",
    emailOrPhone: "البريد أو الهاتف",
  },
  en: {
    tagline: "Where Heritage Meets the Digital Future",
    inspireQuote: "We are not masters of nature, but a vital part of its vast biodiversity. For too long, we have taken; now, the world gives us the ultimate opportunity to give back. By embracing evolution and global progress, we can heal the systems that sustain us. It is time to rise—for ourselves, for each other, and for the Earth.",
    quranVerse: "﴿وَإِلَىٰ ثَمُودَ أَخَاهُمْ صَالِحًا ۚ قَالَ يَا قَوْمِ اعْبُدُوا اللَّهَ مَا لَكُم مِّنْ إِلَٰهٍ غَيْرُهُ ۖ هُوَ أَنشَأَكُم مِّنَ الْأَرْضِ وَاسْتَعْمَرَكُمْ فِيهَا فَاسْتَغْفِرُوهُ ثُمَّ تُوبُوا إِلَيْهِ ۚ إِنَّ رَبِّي قَرِيبٌ مُّجِيبٌ﴾",
    quranRef: "Surah Hud (Verse 61)",
    seizeOpportunity: "Enter the Ecosystem",
    lang: "عربي",
    enterEcosystem: "Enter the Ecosystem",
    signIn: "Sign In",
    signUp: "Sign Up",
    email: "Email",
    phone: "Phone (+249)",
    password: "Password",
    confirmPassword: "Confirm Password",
    firstName: "First Name",
    lastName: "Last Name",
    organization: "Organization (Optional)",
    back: "Back",
    continueWithGoogle: "Continue with Google",
    orContinueWith: "Or continue with",
    sendOtp: "Send OTP",
    verifyOtp: "Verify OTP",
    otpCode: "OTP Code",
    register: "Register",
    loggingIn: "Signing in...",
    registering: "Registering...",
    pendingApproval: "Your account is pending approval",
    invalidCredentials: "Invalid credentials",
    emailOrPhone: "Email or Phone",
  },
};

export default function LandingPage() {
  const { language, updatePreferences } = useSettings();
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const lang = language;
  const setLang = (newLang: "ar" | "en") => updatePreferences({ language: newLang });
  const t = translations[lang];

  const [signInData, setSignInData] = useState({ identifier: "", password: "" });
  const [signUpData, setSignUpData] = useState({
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    organization: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const auth = params.get("auth");
    const userParam = params.get("user");
    
    if (auth === "success" && userParam) {
      try {
        const user = JSON.parse(decodeURIComponent(userParam));
        localStorage.setItem("fcpms_user", JSON.stringify(user));
        localStorage.setItem("fcpms_authenticated", "true");
        queryClient.setQueryData(["/api/auth/user"], user);
        window.history.replaceState({}, "", "/");
        window.location.reload();
      } catch (e) {
        console.error("Failed to parse user data", e);
      }
    }
  }, [queryClient]);

  const handleGoogleLogin = () => {
    window.location.href = "/api/auth/google";
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signInData),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("fcpms_user", JSON.stringify(data.user));
        localStorage.setItem("fcpms_authenticated", "true");
        queryClient.setQueryData(["/api/auth/user"], data.user);
        window.location.reload();
      } else {
        toast({
          title: lang === "ar" ? "خطأ" : "Error",
          description: data.error || t.invalidCredentials,
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: lang === "ar" ? "خطأ" : "Error",
        description: t.invalidCredentials,
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleSendOtp = async () => {
    setLoading(true);
    const identifier = signUpData.email;
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, type: "email" }),
      });
      const data = await res.json();
      if (data.success) {
        setOtpSent(true);
        toast({
          title: lang === "ar" ? "تم الإرسال" : "Sent",
          description: data.message,
        });
      } else {
        toast({
          title: lang === "ar" ? "خطأ" : "Error",
          description: data.message || "Failed to send OTP",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: lang === "ar" ? "خطأ" : "Error",
        description: "Failed to send OTP",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    const identifier = signUpData.email;
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, code: signUpData.otp }),
      });
      const data = await res.json();
      if (data.success) {
        setOtpVerified(true);
        toast({
          title: lang === "ar" ? "تم التحقق" : "Verified",
          description: lang === "ar" ? "تم التحقق بنجاح" : "OTP verified successfully",
        });
      } else {
        toast({
          title: lang === "ar" ? "خطأ" : "Error",
          description: data.error || "Invalid OTP",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: lang === "ar" ? "خطأ" : "Error",
        description: "Verification failed",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signUpData.password !== signUpData.confirmPassword) {
      toast({
        title: lang === "ar" ? "خطأ" : "Error",
        description: lang === "ar" ? "كلمات المرور غير متطابقة" : "Passwords do not match",
        variant: "destructive",
      });
      return;
    }
    if (signUpData.password.length < 6) {
      toast({
        title: lang === "ar" ? "خطأ" : "Error",
        description: lang === "ar" ? "كلمة المرور يجب أن تكون 6 أحرف على الأقل" : "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: signUpData.email,
          firstName: signUpData.firstName,
          lastName: signUpData.lastName,
          organization: signUpData.organization,
          password: signUpData.password,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast({
          title: lang === "ar" ? "تم التسجيل" : "Registered",
          description: t.pendingApproval,
        });
        setActiveTab("signin");
        setOtpSent(false);
        setOtpVerified(false);
        setSignUpData({
          email: "",
          phone: "",
          firstName: "",
          lastName: "",
          organization: "",
          password: "",
          confirmPassword: "",
          otp: "",
        });
      } else {
        toast({
          title: lang === "ar" ? "خطأ" : "Error",
          description: data.error || "Registration failed",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: lang === "ar" ? "خطأ" : "Error",
        description: "Registration failed",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <CinematicLoginBackground />
      <Button
        onClick={() => setLang(lang === "ar" ? "en" : "ar")}
        className="absolute top-4 right-4 z-20 bg-white/20 backdrop-blur-md hover:bg-white/40 text-white border border-white/30 px-3 py-2 rounded-full flex items-center gap-2 shadow-lg"
        variant="ghost"
      >
        <Globe className="w-4 h-4" />
        <span className="font-semibold text-sm">{t.lang}</span>
      </Button>
      
      {!showLoginForm ? (
        <div 
          className="w-full max-w-2xl mx-4 sm:mx-auto relative z-10 text-center animate-in fade-in slide-in-from-bottom-4 duration-700"
          dir={lang === "ar" ? "rtl" : "ltr"}
        >
          <div className="bg-slate-900/60 backdrop-blur-2xl rounded-3xl p-8 sm:p-12 border border-white/10 shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#22C55E] via-[#4ADE80] to-amber-500 rounded-t-3xl" />
            
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute -inset-6 bg-emerald-500/40 blur-3xl rounded-full" />
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 overflow-hidden rounded-2xl">
                  <img 
                    src={fcpmsLogo} 
                    alt="FCPMS Logo" 
                    className="w-full h-full object-contain" 
                    style={{filter: "drop-shadow(0 0 12px rgba(34, 197, 94, 0.6))"}} 
                  />
                </div>
              </div>
            </div>

            <blockquote className="text-lg sm:text-xl md:text-2xl font-serif italic leading-relaxed text-white/90 mb-6 px-2">
              "{t.inspireQuote}"
            </blockquote>

            <div className="mb-6 px-4">
              <p className="sm:text-2xl md:text-3xl font-arabic text-amber-400/90 mb-2 text-[23px] font-bold" dir="rtl">
                {t.quranVerse}
              </p>
              <p className="text-xs sm:text-sm text-white/50 font-medium">
                — {t.quranRef}
              </p>
            </div>

            <div className="w-16 h-1 bg-gradient-to-r from-emerald-500 to-amber-500 mx-auto mb-8 rounded-full" />

            <Button
              onClick={() => setShowLoginForm(true)}
              className="bg-gradient-to-r from-[#22C55E] to-[#16A34A] hover:from-[#16A34A] hover:to-[#15803D] text-white font-bold text-base sm:text-lg px-8 sm:px-12 py-4 sm:py-6 h-auto rounded-xl shadow-lg shadow-green-500/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-green-500/40"
            >
              <span className="flex items-center gap-3">
                {t.seizeOpportunity}
                <svg 
                  className={`w-5 h-5 ${lang === "ar" ? "rotate-180" : ""}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Button>
          </div>
        </div>
      ) : (
        <Card className="w-full max-w-lg mx-2 sm:mx-auto bg-slate-900/70 backdrop-blur-xl border-white/20 shadow-2xl relative z-10 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500" dir={lang === "ar" ? "rtl" : "ltr"}>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#22C55E] via-[#4ADE80] to-amber-500" />
          
          <CardHeader className="text-center space-y-2 pb-2 pt-4 px-4 sm:px-6">
            <div className="flex justify-center flex-col items-center gap-2">
              <div className="relative">
                <div className="absolute -inset-4 bg-emerald-500/50 blur-2xl rounded-full" />
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 overflow-hidden rounded-2xl">
                  <img src={fcpmsLogo} alt="FCPMS Logo" className="w-full h-full object-contain" style={{filter: "drop-shadow(0 0 8px rgba(34, 197, 94, 0.5))"}} />
                </div>
              </div>
              <h1 className="text-base sm:text-lg font-black bg-gradient-to-r from-white via-emerald-200 to-white bg-clip-text text-transparent tracking-wider">FCPMS</h1>
            </div>
            <CardDescription className="text-[11px] sm:text-xs text-white/60">
              {t.tagline}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-2 pb-4 px-4 sm:px-6">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "signin" | "signup")} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/10 mb-4">
                <TabsTrigger value="signin" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-white/70">
                  {t.signIn}
                </TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-white/70">
                  {t.signUp}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="space-y-3">
                <form onSubmit={handleSignIn} className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="signin-identifier" className="flex items-center gap-1 text-white/80 text-xs">
                      <Mail className="w-3 h-3 text-[#4ADE80]" />
                      <span>{t.emailOrPhone}</span>
                    </Label>
                    <Input
                      id="signin-identifier"
                      type="text"
                      placeholder="user@example.com"
                      value={signInData.identifier}
                      onChange={(e) => setSignInData({ ...signInData, identifier: e.target.value })}
                      className="border-white/20 focus:border-[#4ADE80] bg-white/10 text-white placeholder:text-white/40 h-9 text-sm"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="signin-password" className="flex items-center gap-1 text-white/80 text-xs">
                      <Lock className="w-3 h-3 text-[#4ADE80]" />
                      <span>{t.password}</span>
                    </Label>
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="••••••••"
                      value={signInData.password}
                      onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                      className="border-white/20 focus:border-[#4ADE80] bg-white/10 text-white placeholder:text-white/40 h-9 text-sm"
                      required
                    />
                  </div>

                  <Button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-[#22C55E] to-[#16A34A] hover:from-[#16A34A] hover:to-[#15803D] text-white font-bold h-10"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    {loading ? t.loggingIn : t.signIn}
                  </Button>
                </form>

                <div className="relative my-3">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/20"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-slate-900/70 text-white/50">{t.orContinueWith}</span>
                  </div>
                </div>

                <Button 
                  onClick={handleGoogleLogin}
                  className="w-full bg-white hover:bg-gray-100 text-gray-800 font-bold h-10 text-sm shadow-lg border border-gray-300"
                  type="button"
                >
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    {t.continueWithGoogle}
                  </span>
                </Button>
              </TabsContent>

              <TabsContent value="signup" className="space-y-3">
                <form onSubmit={handleSignUp} className="space-y-3">
                  <div className="space-y-1">
                    <Label className="flex items-center gap-1 text-white/80 text-xs">
                      <Mail className="w-3 h-3 text-[#4ADE80]" />
                      <span>{t.email}</span>
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        type="email"
                        placeholder="user@example.com"
                        value={signUpData.email}
                        onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                        className="border-white/20 focus:border-[#4ADE80] bg-white/10 text-white placeholder:text-white/40 h-9 text-sm flex-1"
                        disabled={otpVerified}
                        required
                      />
                      {!otpSent && (
                        <Button type="button" size="sm" onClick={handleSendOtp} disabled={loading || !signUpData.email} className="bg-amber-600 hover:bg-amber-700 text-xs h-9">
                          {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : t.sendOtp}
                        </Button>
                      )}
                    </div>
                  </div>

                  {otpSent && !otpVerified && (
                    <div className="space-y-1">
                      <Label className="flex items-center gap-1 text-white/80 text-xs">
                        <Lock className="w-3 h-3 text-[#4ADE80]" />
                        <span>{t.otpCode}</span>
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          type="text"
                          placeholder="123456"
                          value={signUpData.otp}
                          onChange={(e) => setSignUpData({ ...signUpData, otp: e.target.value })}
                          className="border-white/20 focus:border-[#4ADE80] bg-white/10 text-white placeholder:text-white/40 h-9 text-sm flex-1"
                          maxLength={6}
                        />
                        <Button type="button" size="sm" onClick={handleVerifyOtp} disabled={loading || signUpData.otp.length !== 6} className="bg-emerald-600 hover:bg-emerald-700 text-xs h-9">
                          {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : t.verifyOtp}
                        </Button>
                      </div>
                    </div>
                  )}

                  {otpVerified && (
                    <>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <Label className="flex items-center gap-1 text-white/80 text-xs">
                            <User className="w-3 h-3 text-[#4ADE80]" />
                            <span>{t.firstName}</span>
                          </Label>
                          <Input
                            type="text"
                            value={signUpData.firstName}
                            onChange={(e) => setSignUpData({ ...signUpData, firstName: e.target.value })}
                            className="border-white/20 focus:border-[#4ADE80] bg-white/10 text-white placeholder:text-white/40 h-9 text-sm"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="flex items-center gap-1 text-white/80 text-xs">
                            <User className="w-3 h-3 text-[#4ADE80]" />
                            <span>{t.lastName}</span>
                          </Label>
                          <Input
                            type="text"
                            value={signUpData.lastName}
                            onChange={(e) => setSignUpData({ ...signUpData, lastName: e.target.value })}
                            className="border-white/20 focus:border-[#4ADE80] bg-white/10 text-white placeholder:text-white/40 h-9 text-sm"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Label className="flex items-center gap-1 text-white/80 text-xs">
                          <Building className="w-3 h-3 text-[#4ADE80]" />
                          <span>{t.organization}</span>
                        </Label>
                        <Input
                          type="text"
                          value={signUpData.organization}
                          onChange={(e) => setSignUpData({ ...signUpData, organization: e.target.value })}
                          className="border-white/20 focus:border-[#4ADE80] bg-white/10 text-white placeholder:text-white/40 h-9 text-sm"
                        />
                      </div>

                      <div className="space-y-1">
                        <Label className="flex items-center gap-1 text-white/80 text-xs">
                          <Lock className="w-3 h-3 text-[#4ADE80]" />
                          <span>{t.password}</span>
                        </Label>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          value={signUpData.password}
                          onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                          className="border-white/20 focus:border-[#4ADE80] bg-white/10 text-white placeholder:text-white/40 h-9 text-sm"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <Label className="flex items-center gap-1 text-white/80 text-xs">
                          <Lock className="w-3 h-3 text-[#4ADE80]" />
                          <span>{t.confirmPassword}</span>
                        </Label>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          value={signUpData.confirmPassword}
                          onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })}
                          className="border-white/20 focus:border-[#4ADE80] bg-white/10 text-white placeholder:text-white/40 h-9 text-sm"
                          required
                        />
                      </div>

                      <Button 
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-[#22C55E] to-[#16A34A] hover:from-[#16A34A] hover:to-[#15803D] text-white font-bold h-10"
                      >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        {loading ? t.registering : t.register}
                      </Button>
                    </>
                  )}
                </form>

                <div className="relative my-3">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/20"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-slate-900/70 text-white/50">{t.orContinueWith}</span>
                  </div>
                </div>

                <Button 
                  onClick={handleGoogleLogin}
                  className="w-full bg-white hover:bg-gray-100 text-gray-800 font-bold h-10 text-sm shadow-lg border border-gray-300"
                  type="button"
                >
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    {t.continueWithGoogle}
                  </span>
                </Button>
              </TabsContent>
            </Tabs>

            <Button 
              variant="ghost" 
              onClick={() => setShowLoginForm(false)}
              className="w-full text-white/60 hover:text-white hover:bg-white/10 text-sm mt-3"
            >
              {t.back}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
