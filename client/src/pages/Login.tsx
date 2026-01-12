import { useState } from "react";
import { useLocation } from "wouter";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Lock,
  AlertCircle,
  Mail,
  Globe,
  Phone,
  User,
  Building,
  Loader2,
  CheckCircle,
} from "lucide-react";
// 👇 إضافة أيقونة جوجل
import { SiGoogle } from "react-icons/si";
import fcpmsLogo from "@/lib/logo";
import { CinematicLoginBackground } from "@/components/CinematicLoginBackground";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/contexts/SettingsContext";

const translations = {
  ar: {
    signIn: "تسجيل الدخول",
    signUp: "إنشاء حساب",
    enterEcosystem: "الدخول للمنظومة",
    createAccount: "إنشاء حساب جديد",
    tagline: "حيث يلتقي التراث بالمستقبل الرقمي",
    inspireQuote:
      "نحن لسنا سادة الطبيعة، بل جزء حيوي من تنوعها البيولوجي الشاسع. لفترة طويلة جداً، أخذنا منها؛ والآن، يمنحنا العالم الفرصة القصوى للعطاء. من خلال تبني التطور والتقدم العالمي، يمكننا شفاء الأنظمة التي تحافظ علينا. حان الوقت للنهوض — من أجل أنفسنا، ومن أجل بعضنا البعض، ومن أجل الأرض.",
    quranVerse:
      "﴿ ۞ وَإِلَىٰ ثَمُودَ أَخَاهُمْ صَالِحًا ۚ قَالَ يَا قَوْمِ اعْبُدُوا اللَّهَ مَا لَكُم مِّنْ إِلَٰهٍ غَيْرُهُ ۖ هُوَ أَنشَأَكُم مِّنَ الْأَرْضِ وَاسْتَعْمَرَكُمْ فِيهَا فَاسْتَغْفِرُوهُ ثُمَّ تُوبُوا إِلَيْهِ ۚ إِنَّ رَبِّي قَرِيبٌ مُّجِيبٌ ﴾",
    quranRef: "سورة هود (الآية ٦١)",
    seizeOpportunity: "اغتنم الفرصة",
    email: "البريد الإلكتروني",
    phone: "الهاتف",
    username: "البريد / الهاتف",
    phoneNumber: "رقم الهاتف",
    password: "كلمة المرور",
    confirmPassword: "تأكيد كلمة المرور",
    submit: "تسجيل الدخول",
    createNew: "إنشاء حساب",
    invalidCredentials: "بيانات الدخول غير صحيحة",
    lang: "EN",
    firstName: "الاسم الأول",
    lastName: "اسم العائلة",
    organization: "المؤسسة (اختياري)",
    reason: "سبب الانضمام (اختياري)",
    sendOtp: "إرسال رمز التحقق",
    verifyOtp: "التحقق من الرمز",
    otpSent: "تم إرسال رمز التحقق",
    otpVerified: "تم التحقق بنجاح",
    enterOtp: "أدخل رمز التحقق",
    registrationSubmitted: "تم إرسال طلب التسجيل للموافقة",
    pendingApproval: "الحساب قيد الموافقة",
    registerWithEmail: "التسجيل بالبريد",
    registerWithPhone: "التسجيل بالهاتف",
    sudanesePhone: "رقم سوداني (+249)",
    back: "رجوع",
    next: "التالي",
    step1: "المعلومات الشخصية",
    step2: "التحقق",
    step3: "كلمة المرور",
    googleLogin: "تسجيل الدخول عبر Google",
    or: "أو",
  },
  en: {
    signIn: "Sign In",
    signUp: "Sign Up",
    enterEcosystem: "Enter the Ecosystem",
    createAccount: "Create a Visionary Account",
    tagline: "Where Heritage Meets the Digital Future",
    inspireQuote:
      "We are not masters of nature, but a vital part of its vast biodiversity. For too long, we have taken; now, the world gives us the ultimate opportunity to give back. By embracing evolution and global progress, we can heal the systems that sustain us. It is time to rise—for ourselves, for each other, and for the Earth.",
    quranVerse:
      "﴿وَإِلَىٰ ثَمُودَ أَخَاهُمْ صَالِحًا ۚ قَالَ يَا قَوْمِ اعْبُدُوا اللَّهَ مَا لَكُم مِّنْ إِلَٰهٍ غَيْرُهُ ۖ هُوَ أَنشَأَكُم مِّنَ الْأَرْضِ وَاسْتَعْمَرَكُمْ فِيهَا فَاسْتَغْفِرُوهُ ثُمَّ تُوبُوا إِلَيْهِ ۚ إِنَّ رَبِّي قَرِيبٌ مُّجِيبٌ﴾",
    quranRef: "Surah Hud (Verse 61)",
    seizeOpportunity: "Seize the Opportunity",
    email: "Email Address",
    phone: "Phone",
    username: "Email / Phone",
    phoneNumber: "Phone Number",
    password: "Password",
    confirmPassword: "Confirm Password",
    submit: "Sign In",
    createNew: "Create Account",
    invalidCredentials: "Invalid credentials",
    lang: "عربي",
    firstName: "First Name",
    lastName: "Last Name",
    organization: "Organization (optional)",
    reason: "Reason for joining (optional)",
    sendOtp: "Send OTP",
    verifyOtp: "Verify OTP",
    otpSent: "OTP sent successfully",
    otpVerified: "Verified successfully",
    enterOtp: "Enter verification code",
    registrationSubmitted: "Registration submitted for approval",
    pendingApproval: "Account pending approval",
    registerWithEmail: "Register with Email",
    registerWithPhone: "Register with Phone",
    sudanesePhone: "Sudanese Number (+249)",
    back: "Back",
    next: "Next",
    step1: "Personal Info",
    step2: "Verification",
    step3: "Password",
    googleLogin: "Sign in with Google",
    or: "OR",
  },
};

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const { language, updatePreferences } = useSettings();
  const lang = language;
  const setLang = (newLang: "ar" | "en") =>
    updatePreferences({ language: newLang });
  const t = translations[lang];

  const [showLoginForm, setShowLoginForm] = useState(false);
  const [registerMethod, setRegisterMethod] = useState<"email" | "phone">(
    "email",
  );
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [organization, setOrganization] = useState("");
  const [reason, setReason] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });
      const data = await response.json();

      if (data.success) {
        login(data.user);
        setLocation("/");
      } else {
        if (data.error === "Account pending approval") {
          setError(t.pendingApproval);
        } else {
          setError(t.invalidCredentials);
        }
      }
    } catch {
      setError(t.invalidCredentials);
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    setError("");
    setLoading(true);
    const otpIdentifier = registerMethod === "email" ? email : `+249${phone}`;
    const type = registerMethod === "email" ? "email" : "phone";

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: otpIdentifier, type }),
      });
      const data = await response.json();

      if (data.success) {
        setOtpSent(true);
        setSuccess(t.otpSent);
      } else {
        setError(data.message || "Failed to send OTP");
      }
    } catch {
      setError("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError("");
    setLoading(true);
    const otpIdentifier = registerMethod === "email" ? email : `+249${phone}`;

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: otpIdentifier, code: otp }),
      });
      const data = await response.json();

      if (data.success) {
        setOtpVerified(true);
        setSuccess(t.otpVerified);
        setStep(3);
      } else {
        setError(data.error || "Invalid OTP");
      }
    } catch {
      setError("Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: registerMethod === "email" ? email : undefined,
          phone: registerMethod === "phone" ? `+249${phone}` : undefined,
          firstName,
          lastName,
          organization,
          reason,
          password,
        }),
      });
      const data = await response.json();

      if (data.success) {
        setSuccess(t.registrationSubmitted);
        setTimeout(() => {
          setMode("signin");
          resetForm();
        }, 3000);
      } else {
        setError(data.error || "Registration failed");
      }
    } catch {
      setError("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setOrganization("");
    setReason("");
    setOtp("");
    setOtpSent(false);
    setOtpVerified(false);
    setPassword("");
    setConfirmPassword("");
    setError("");
    setSuccess("");
  };

  const canProceedStep1 =
    firstName.trim() &&
    lastName.trim() &&
    ((registerMethod === "email" && email.includes("@")) ||
      (registerMethod === "phone" && phone.length >= 9));

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

      {/* 👇 بداية: التوقيع في الأسفل 👇 */}
      <div className="absolute bottom-4 left-0 right-0 text-center z-20 pointer-events-none">
        <span className="text-white/30 text-[10px] sm:text-xs font-mono tracking-[0.3em] font-light hover:text-[#4ADE80] transition-colors duration-500 cursor-default pointer-events-auto">
          DESIGNED BY M-ABBAS
        </span>
      </div>
      {/* 👆 نهاية التوقيع 👆 */}

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
                    style={{
                      filter: "drop-shadow(0 0 12px rgba(34, 197, 94, 0.6))",
                    }}
                  />
                </div>
              </div>
            </div>

            <blockquote className="text-lg sm:text-xl md:text-2xl font-serif italic leading-relaxed text-white/90 mb-6 px-2">
              "{t.inspireQuote}"
            </blockquote>

            <div className="mb-6 px-4">
              <p
                className="sm:text-2xl md:text-3xl font-arabic text-amber-400/90 mb-2 text-[23px] font-bold"
                dir="rtl"
              >
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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>
            </Button>
          </div>
        </div>
      ) : (
        <Card
          className="w-full max-w-lg mx-2 sm:mx-auto bg-slate-900/70 backdrop-blur-xl border-white/20 shadow-2xl relative z-10 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500"
          dir={lang === "ar" ? "rtl" : "ltr"}
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#22C55E] via-[#4ADE80] to-amber-500" />

          <CardHeader className="text-center space-y-3 sm:space-y-4 pb-3 sm:pb-4 pt-4 sm:pt-6 px-4 sm:px-6">
            <div className="flex justify-center flex-col items-center gap-2 sm:gap-3">
              <div className="relative">
                <div className="absolute -inset-4 bg-emerald-500/50 blur-2xl rounded-full" />
                <div className="relative w-20 h-20 sm:w-28 sm:h-28 overflow-hidden rounded-2xl">
                  <img
                    src={fcpmsLogo}
                    alt="FCPMS Logo"
                    className="w-full h-full object-contain"
                    style={{
                      filter: "drop-shadow(0 0 8px rgba(34, 197, 94, 0.5))",
                    }}
                  />
                </div>
              </div>
              <h1 className="text-lg sm:text-xl font-black bg-gradient-to-r from-white via-emerald-200 to-white bg-clip-text text-transparent tracking-wider">
                FCPMS
              </h1>
            </div>
            <Tabs
              value={mode}
              onValueChange={(v) => {
                setMode(v as any);
                resetForm();
              }}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 bg-white/10">
                <TabsTrigger
                  value="signin"
                  className="data-[state=active]:bg-white/20 data-[state=active]:text-[#4ADE80] text-white/80 font-bold text-xs"
                >
                  {t.signIn}
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="data-[state=active]:bg-white/20 data-[state=active]:text-[#4ADE80] text-white/80 font-bold text-xs flex items-center gap-1"
                >
                  {t.signUp}
                  <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none">
                    <path
                      d="M12 2L13.09 8.26L18 5L14.74 9.91L21 11L14.74 12.09L18 17L13.09 13.74L12 20L10.91 13.74L6 17L9.26 12.09L3 11L9.26 9.91L6 5L10.91 8.26L12 2Z"
                      fill="url(#geminiGrad)"
                    />
                    <defs>
                      <linearGradient
                        id="geminiGrad"
                        x1="3"
                        y1="2"
                        x2="21"
                        y2="20"
                      >
                        <stop offset="0%" stopColor="#4285F4" />
                        <stop offset="50%" stopColor="#9B72CB" />
                        <stop offset="100%" stopColor="#D96570" />
                      </linearGradient>
                    </defs>
                  </svg>
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <div>
              <CardTitle className="text-sm sm:text-base font-bold text-white">
                {mode === "signin" ? t.enterEcosystem : t.createAccount}
              </CardTitle>
              <CardDescription className="text-[11px] sm:text-xs mt-1 text-white/60">
                {t.tagline}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="pt-3 sm:pt-4 pb-4 sm:pb-6 px-4 sm:px-6">
            {mode === "signin" ? (
              <div className="space-y-4">
                {/* 👇👇👇 زر جوجل 👇👇👇 */}
                <Button
                  variant="outline"
                  className="w-full flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white border-white/20 hover:text-green-400 transition-all"
                  onClick={() => (window.location.href = "/auth/google")}
                >
                  <SiGoogle className="w-4 h-4 text-red-500" />
                  <span>{t.googleLogin}</span>
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-slate-900/50 px-2 text-white/40">
                      {t.or}
                    </span>
                  </div>
                </div>
                {/* 👆👆👆 نهاية زر جوجل 👆👆👆 */}

                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-1">
                    <Label
                      htmlFor="username"
                      className="flex items-center gap-1 text-white/80 text-xs"
                    >
                      <Mail className="w-3 h-3 text-[#4ADE80]" />
                      <span>{t.username}</span>
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="admin@fullcells.com"
                      className="border-white/20 focus:border-[#4ADE80] bg-white/10 text-white placeholder:text-white/40 h-9 text-sm"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1">
                    <Label
                      htmlFor="password"
                      className="flex items-center gap-1 text-white/80 text-xs"
                    >
                      <Lock className="w-3 h-3 text-[#4ADE80]" />
                      <span>{t.password}</span>
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError("");
                      }}
                      placeholder="••••••••"
                      className="border-white/20 focus:border-[#4ADE80] bg-white/10 text-white placeholder:text-white/40 h-9 text-sm"
                    />
                  </div>

                  {error && (
                    <Alert
                      variant="destructive"
                      className="bg-red-500/20 border-red-400/30 text-red-200 py-2"
                    >
                      <AlertCircle className="w-3 h-3" />
                      <AlertDescription className="text-xs">
                        {error}
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold h-9 text-sm shadow-lg shadow-green-500/20 mt-2"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      t.submit
                    )}
                  </Button>
                </form>
              </div>
            ) : (
              <div className="space-y-4">
                {step === 1 && (
                  <>
                    <Tabs
                      value={registerMethod}
                      onValueChange={(v) => setRegisterMethod(v as any)}
                      className="w-full"
                    >
                      <TabsList className="grid w-full grid-cols-2 bg-white/10 mb-4">
                        <TabsTrigger
                          value="email"
                          className="data-[state=active]:bg-white/20 data-[state=active]:text-[#4ADE80] text-white/80 text-xs"
                        >
                          <Mail className="w-3 h-3 mr-1" />
                          {t.email}
                        </TabsTrigger>
                        <TabsTrigger
                          value="phone"
                          className="data-[state=active]:bg-white/20 data-[state=active]:text-[#4ADE80] text-white/80 text-xs"
                        >
                          <Phone className="w-3 h-3 mr-1" />
                          {t.phone}
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="flex items-center gap-1 text-white/80 text-xs">
                          <User className="w-3 h-3 text-[#4ADE80]" />
                          {t.firstName}
                        </Label>
                        <Input
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="border-white/20 focus:border-[#4ADE80] bg-white/10 text-white h-9 text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="flex items-center gap-1 text-white/80 text-xs">
                          <User className="w-3 h-3 text-[#4ADE80]" />
                          {t.lastName}
                        </Label>
                        <Input
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="border-white/20 focus:border-[#4ADE80] bg-white/10 text-white h-9 text-sm"
                        />
                      </div>
                    </div>

                    {registerMethod === "email" ? (
                      <div className="space-y-1">
                        <Label className="flex items-center gap-1 text-white/80 text-xs">
                          <Mail className="w-3 h-3 text-[#4ADE80]" />
                          {t.email}
                        </Label>
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="border-white/20 focus:border-[#4ADE80] bg-white/10 text-white placeholder:text-white/40 h-9 text-sm"
                        />
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <Label className="flex items-center gap-1 text-white/80 text-xs">
                          <Phone className="w-3 h-3 text-[#4ADE80]" />
                          {t.sudanesePhone}
                        </Label>
                        <div className="flex items-center gap-2">
                          <div className="bg-white/10 border border-white/20 rounded-md h-9 px-3 flex items-center text-white text-sm font-mono">
                            +249
                          </div>
                          <Input
                            type="tel"
                            value={phone}
                            onChange={(e) =>
                              setPhone(e.target.value.replace(/\D/g, ""))
                            }
                            placeholder="9XXXXXXXX"
                            className="border-white/20 focus:border-[#4ADE80] bg-white/10 text-white placeholder:text-white/40 h-9 text-sm flex-1 font-mono"
                            maxLength={9}
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-1">
                      <Label className="flex items-center gap-1 text-white/80 text-xs">
                        <Building className="w-3 h-3 text-[#4ADE80]" />
                        {t.organization}
                      </Label>
                      <Input
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                        className="border-white/20 focus:border-[#4ADE80] bg-white/10 text-white h-9 text-sm"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-white/80 text-xs">
                        {t.reason}
                      </Label>
                      <Textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="border-white/20 focus:border-[#4ADE80] bg-white/10 text-white h-16 text-sm resize-none"
                      />
                    </div>

                    <Button
                      onClick={() => setStep(2)}
                      disabled={!canProceedStep1}
                      className="w-full bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold h-9 text-sm"
                    >
                      {t.next}
                    </Button>
                  </>
                )}

                {step === 2 && (
                  <>
                    <div className="text-center mb-4">
                      <p className="text-white/80 text-sm">
                        {registerMethod === "email"
                          ? t.registerWithEmail
                          : t.registerWithPhone}
                      </p>
                      <p className="text-[#4ADE80] font-mono text-sm mt-1">
                        {registerMethod === "email" ? email : `+249${phone}`}
                      </p>
                    </div>

                    {!otpSent ? (
                      <Button
                        onClick={handleSendOtp}
                        disabled={loading}
                        className="w-full bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold h-9 text-sm"
                      >
                        {loading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          t.sendOtp
                        )}
                      </Button>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-green-400 text-xs justify-center">
                          <CheckCircle className="w-4 h-4" />
                          {t.otpSent}
                        </div>
                        <div className="space-y-1">
                          <Label className="text-white/80 text-xs">
                            {t.enterOtp}
                          </Label>
                          <Input
                            value={otp}
                            onChange={(e) =>
                              setOtp(e.target.value.replace(/\D/g, ""))
                            }
                            placeholder="000000"
                            className="border-white/20 focus:border-[#4ADE80] bg-white/10 text-white text-center text-lg tracking-widest h-12 font-mono"
                            maxLength={6}
                          />
                        </div>
                        <Button
                          onClick={handleVerifyOtp}
                          disabled={loading || otp.length !== 6}
                          className="w-full bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold h-9 text-sm"
                        >
                          {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            t.verifyOtp
                          )}
                        </Button>
                      </div>
                    )}

                    <Button
                      onClick={() => {
                        setStep(1);
                        setOtpSent(false);
                        setOtp("");
                      }}
                      variant="ghost"
                      className="w-full text-white/60 hover:text-white hover:bg-white/10 h-9 text-sm"
                    >
                      {t.back}
                    </Button>
                  </>
                )}

                {step === 3 && (
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="flex items-center gap-2 text-green-400 text-xs justify-center mb-2">
                      <CheckCircle className="w-4 h-4" />
                      {t.otpVerified}
                    </div>

                    <div className="space-y-1">
                      <Label className="flex items-center gap-1 text-white/80 text-xs">
                        <Lock className="w-3 h-3 text-[#4ADE80]" />
                        {t.password}
                      </Label>
                      <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border-white/20 focus:border-[#4ADE80] bg-white/10 text-white h-9 text-sm"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="flex items-center gap-1 text-white/80 text-xs">
                        <Lock className="w-3 h-3 text-[#4ADE80]" />
                        {t.confirmPassword}
                      </Label>
                      <Input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="border-white/20 focus:border-[#4ADE80] bg-white/10 text-white h-9 text-sm"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={loading || !password || !confirmPassword}
                      className="w-full bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold h-9 text-sm"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        t.createNew
                      )}
                    </Button>
                  </form>
                )}

                {error && (
                  <Alert
                    variant="destructive"
                    className="bg-red-500/20 border-red-400/30 text-red-200 py-2"
                  >
                    <AlertCircle className="w-3 h-3" />
                    <AlertDescription className="text-xs">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="bg-green-500/20 border-green-400/30 text-green-200 py-2">
                    <CheckCircle className="w-3 h-3" />
                    <AlertDescription className="text-xs">
                      {success}
                    </AlertDescription>
                  </Alert>
                )}

                {mode === "signup" && (
                  <div className="flex justify-center gap-1 mt-4">
                    {[1, 2, 3].map((s) => (
                      <div
                        key={s}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          s === step
                            ? "bg-[#22C55E]"
                            : s < step
                              ? "bg-[#4ADE80]"
                              : "bg-white/20"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
