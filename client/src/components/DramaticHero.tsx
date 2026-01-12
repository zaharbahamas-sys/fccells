import { useState, useEffect } from "react";
import { useSettings } from "@/contexts/SettingsContext";
import { Badge } from "@/components/ui/badge";
import heroVideo from "@assets/video-6616f47d-73ac-49ee-b6fe-81559cb9696d_1767685922840.mp4";

export function DramaticHero() {
  const { language } = useSettings();
  const [phase, setPhase] = useState<"initial" | "dive" | "impact" | "transform">("initial");
  const [showFlash, setShowFlash] = useState(false);
  const [lightningState, setLightningState] = useState<"hidden" | "center" | "fade" | "side">("hidden");

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    
    timers.push(setTimeout(() => setPhase("dive"), 1000));
    timers.push(setTimeout(() => {
      setPhase("impact");
      setLightningState("center");
      setShowFlash(true);
      setTimeout(() => setShowFlash(false), 150);
    }, 2200));
    timers.push(setTimeout(() => setLightningState("fade"), 2600));
    timers.push(setTimeout(() => {
      setPhase("transform");
      setLightningState("side");
    }, 2800));
    timers.push(setTimeout(() => setLightningState("hidden"), 3200));
    
    return () => timers.forEach(clearTimeout);
  }, []);

  const txt = {
    fcpms: "FC-PMS",
    title: language === "ar" ? "خلايا الوقود: أفق مستدام" : "Fuel Cells: A Sustainable Horizon",
    tagline: language === "ar" 
      ? "FCPMS تمثل التآزر المثالي بين الدقة التكنولوجية والتناغم البيئي."
      : "FCPMS represents the perfect synergy between technological precision and environmental harmony.",
    slogan: language === "ar" ? "متجذرة في النيل. مدعومة بالهيدروجين." : "Rooted in the Nile. Powered by Hydrogen."
  };

  return (
    <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
      {/* Flash Effect */}
      {showFlash && (
        <div className="absolute inset-0 bg-white z-50 animate-flash" />
      )}
      {/* Dark overlay during storm phases */}
      <div className={`absolute inset-0 transition-all duration-1000 ${
        phase === "initial" || phase === "dive" ? "bg-slate-900/60" : "bg-transparent"
      }`}>
        <div className={`absolute inset-0 storm-clouds transition-opacity duration-1000 ${
          phase === "transform" ? "opacity-0" : "opacity-100"
        }`} />
      </div>
      {/* Center Lightning SVG */}
      <svg 
        className={`absolute left-1/2 -translate-x-1/2 top-0 h-full w-64 z-20 pointer-events-none transition-opacity duration-300 ${
          lightningState === "center" ? "opacity-100" : lightningState === "fade" ? "opacity-0" : "opacity-0"
        }`}
        viewBox="0 0 100 400"
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="lightning-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path 
          d="M50 0 L45 60 L55 65 L42 130 L58 140 L35 200 L60 210 L40 280 L55 290 L50 400"
          fill="none"
          stroke="white"
          strokeWidth="3"
          filter="url(#lightning-glow)"
          className={`lightning-path ${lightningState === "center" ? "animate-lightning" : ""}`}
        />
        <path 
          d="M50 0 L45 60 L55 65 L42 130 L58 140 L35 200 L60 210 L40 280 L55 290 L50 400"
          fill="none"
          stroke="rgba(100, 200, 255, 0.8)"
          strokeWidth="6"
          filter="url(#lightning-glow)"
          className={`${lightningState === "center" ? "animate-lightning" : "opacity-0"}`}
        />
      </svg>

      {/* Side Lightning SVG - hits right side */}
      <svg 
        className={`absolute right-4 top-0 h-full w-48 z-20 pointer-events-none transition-opacity duration-200 ${
          lightningState === "side" ? "opacity-100" : "opacity-0"
        }`}
        viewBox="0 0 100 400"
        preserveAspectRatio="none"
      >
        <path 
          d="M80 0 L75 50 L85 55 L70 100 L88 110 L65 160 L82 170 L60 220 L78 230 L55 300 L75 320 L50 400"
          fill="none"
          stroke="white"
          strokeWidth="2"
          filter="url(#lightning-glow)"
          className={`${lightningState === "side" ? "animate-lightning-side" : ""}`}
        />
        <path 
          d="M80 0 L75 50 L85 55 L70 100 L88 110 L65 160 L82 170 L60 220 L78 230 L55 300 L75 320 L50 400"
          fill="none"
          stroke="rgba(100, 200, 255, 0.6)"
          strokeWidth="4"
          filter="url(#lightning-glow)"
          className={`${lightningState === "side" ? "animate-lightning-side" : "opacity-0"}`}
        />
      </svg>
      {/* Content Container - centered and interactive */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-auto px-4">
        {/* Video Container */}
        <div className={`relative mb-4 sm:mb-6 transition-all duration-1000 ${
          phase === "initial" ? "opacity-60 -translate-y-8 scale-95" :
          phase === "dive" ? "opacity-100 translate-y-0 scale-105" :
          "opacity-100 translate-y-0 scale-100"
        }`}>
          <div className={`absolute -inset-4 sm:-inset-6 lg:-inset-8 bg-emerald-500/40 blur-3xl rounded-full transition-all duration-500 ${
            phase === "impact" || phase === "transform" ? "opacity-100 animate-pulse scale-110" : "opacity-20"
          }`} />
          <div className={`relative w-40 h-40 sm:w-52 sm:h-52 lg:w-72 lg:h-72 overflow-hidden rounded-2xl sm:rounded-3xl border-2 border-emerald-500/30 transition-all duration-500 ${
            phase === "impact" ? "animate-shake border-emerald-400/60" : ""
          }`} style={{
            boxShadow: phase === "impact" || phase === "transform" 
              ? "0 0 40px rgba(34, 197, 94, 0.4), 0 0 80px rgba(34, 197, 94, 0.2)" 
              : "0 0 20px rgba(34, 197, 94, 0.2)"
          }}>
            <video 
              src={heroVideo}
              autoPlay
              loop
              muted
              playsInline
              className={`w-full h-full object-cover transition-all duration-500 ${
                phase === "dive" ? "scale-110" : 
                phase === "impact" ? "scale-115" : 
                "scale-100"
              }`} 
            />
          </div>
        </div>

        {/* FCPMS Badge */}
        <Badge className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover-elevate whitespace-nowrap inline-flex items-center rounded-full border transition-all duration-500 shadow-lg mb-3 sm:mb-4 bg-[#22C55E]/20 border-[#22C55E]/40 px-4 sm:px-6 py-1.5 sm:py-2 tracking-widest uppercase sm:text-lg lg:text-xl backdrop-blur-sm ml-[0px] mr-[0px] pl-[6px] pr-[6px] text-[51px] font-extrabold text-[#007cf8]">
          {txt.fcpms}
        </Badge>
            
        {/* Title */}
        <h1 className={`text-xl sm:text-3xl lg:text-5xl tracking-tight leading-tight text-center px-2 sm:px-4 py-1 sm:py-2 font-bold transition-all duration-500 mb-2 sm:mb-3 ${
          phase === "initial" || phase === "dive" 
            ? "text-white/80" 
            : "text-white neon-glow"
        } ${phase === "impact" ? "animate-shake" : ""}`}>
          {txt.title}
        </h1>

        {/* Tagline */}
        <p className={`text-sm sm:text-base lg:text-xl leading-relaxed font-light max-w-3xl mx-auto italic text-center transition-all duration-700 mb-2 sm:mb-3 ${
          phase === "transform" ? "text-slate-200 opacity-100" : "text-slate-300/70 opacity-70"
        }`}>
          "{txt.tagline}"
        </p>
        
        {/* Slogan */}
        <div className={`flex items-center justify-center gap-2 sm:gap-3 font-bold text-xs tracking-[0.15em] sm:tracking-[0.2em] uppercase transition-all duration-700 ${
          phase === "transform" ? "text-[#22C55E] opacity-100" : "text-[#22C55E]/70 opacity-70"
        }`}>
          <span className={`h-px w-8 sm:w-12 lg:w-16 transition-all duration-700 ${
            phase === "transform" ? "bg-[#22C55E]" : "bg-[#22C55E]/40"
          }`} />
          {txt.slogan}
          <span className={`h-px w-8 sm:w-12 lg:w-16 transition-all duration-700 ${
            phase === "transform" ? "bg-[#22C55E]" : "bg-[#22C55E]/40"
          }`} />
        </div>
      </div>
      {/* Green energy particles rising from bottom on transform */}
      {phase === "transform" && (
        <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-emerald-400/60 rounded-full animate-rise"
              style={{
                left: `${5 + i * 5}%`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: `${2 + Math.random()}s`
              }}
            />
          ))}
        </div>
      )}
      <style>{`
        @keyframes flash {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
        .animate-flash {
          animation: flash 0.15s ease-out forwards;
        }
        
        @keyframes shake {
          0%, 100% { transform: translateY(0) translateX(0); }
          10% { transform: translateX(-5px) translateY(-2px); }
          20% { transform: translateX(5px) translateY(2px); }
          30% { transform: translateX(-4px) translateY(-1px); }
          40% { transform: translateX(4px) translateY(1px); }
          50% { transform: translateX(-3px); }
          60% { transform: translateX(3px); }
          70% { transform: translateX(-2px); }
          80% { transform: translateX(2px); }
          90% { transform: translateX(-1px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        
        @keyframes lightning {
          0%, 100% { opacity: 0; stroke-dashoffset: 1000; }
          10%, 30%, 50%, 70% { opacity: 1; }
          20%, 40%, 60%, 80% { opacity: 0.3; }
          90% { opacity: 1; stroke-dashoffset: 0; }
        }
        .animate-lightning {
          stroke-dasharray: 1000;
          animation: lightning 0.4s ease-out forwards;
        }
        
        @keyframes lightning-side {
          0% { opacity: 0; stroke-dashoffset: 800; }
          15%, 35%, 55% { opacity: 1; }
          25%, 45% { opacity: 0.4; }
          100% { opacity: 0; stroke-dashoffset: 0; }
        }
        .animate-lightning-side {
          stroke-dasharray: 800;
          animation: lightning-side 0.35s ease-out forwards;
        }
        
        .neon-glow {
          text-shadow: 
            0 0 10px rgba(34, 197, 94, 0.8),
            0 0 20px rgba(34, 197, 94, 0.6),
            0 0 40px rgba(34, 197, 94, 0.4),
            0 0 80px rgba(100, 200, 255, 0.3);
        }
        
        .storm-clouds {
          background: 
            radial-gradient(ellipse at 20% 20%, rgba(30, 41, 59, 0.4) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 10%, rgba(30, 41, 59, 0.3) 0%, transparent 40%),
            radial-gradient(ellipse at 50% 30%, rgba(30, 41, 59, 0.2) 0%, transparent 60%);
          animation: clouds 20s ease-in-out infinite;
        }
        
        @keyframes clouds {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-20px); }
        }
        
        @keyframes rise {
          0% { 
            opacity: 0;
            transform: translateY(0);
          }
          20% {
            opacity: 1;
          }
          100% { 
            opacity: 0;
            transform: translateY(-120px);
          }
        }
        .animate-rise {
          animation: rise 2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
