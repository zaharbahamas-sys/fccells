import { motion } from "framer-motion";

interface FullCellsLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export function FullCellsLogo({ size = "md", showText = true, className = "" }: FullCellsLogoProps) {
  const sizes = {
    sm: { container: "w-10 h-10", text: "text-sm", subtext: "text-[6px]" },
    md: { container: "w-14 h-14", text: "text-lg", subtext: "text-[8px]" },
    lg: { container: "w-20 h-20", text: "text-2xl", subtext: "text-xs" }
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`relative ${sizes[size].container}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <linearGradient id="branchGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22C55E" />
              <stop offset="50%" stopColor="#16A34A" />
              <stop offset="100%" stopColor="#15803D" />
            </linearGradient>
            <linearGradient id="leafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4ADE80" />
              <stop offset="100%" stopColor="#22C55E" />
            </linearGradient>
            <filter id="leafShadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="1" dy="1" stdDeviation="1" floodColor="#15803D" floodOpacity="0.3" />
            </filter>
            <radialGradient id="birdBody" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="100%" stopColor="#1E293B" />
            </radialGradient>
            <linearGradient id="birdWing" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#64748B" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>
          </defs>
          
          <g filter="url(#leafShadow)">
            <path 
              d="M10,85 Q20,70 35,65 Q50,62 65,68 Q78,75 85,85" 
              fill="none" 
              stroke="url(#branchGradient)" 
              strokeWidth="3" 
              strokeLinecap="round"
            />
            <path 
              d="M15,82 Q18,75 22,78" 
              fill="none" 
              stroke="url(#branchGradient)" 
              strokeWidth="2" 
              strokeLinecap="round"
            />
            <path 
              d="M75,78 Q80,72 85,76" 
              fill="none" 
              stroke="url(#branchGradient)" 
              strokeWidth="2" 
              strokeLinecap="round"
            />
          </g>
          
          <g filter="url(#leafShadow)">
            <ellipse cx="25" cy="58" rx="8" ry="14" fill="url(#leafGradient)" transform="rotate(-30 25 58)" />
            <ellipse cx="40" cy="52" rx="9" ry="16" fill="url(#leafGradient)" transform="rotate(-15 40 52)" />
            <ellipse cx="55" cy="50" rx="10" ry="17" fill="url(#leafGradient)" transform="rotate(5 55 50)" />
            <ellipse cx="70" cy="55" rx="8" ry="15" fill="url(#leafGradient)" transform="rotate(25 70 55)" />
            
            <path d="M25,58 L25,72" stroke="#16A34A" strokeWidth="0.5" opacity="0.5" transform="rotate(-30 25 58)" />
            <path d="M40,52 L40,68" stroke="#16A34A" strokeWidth="0.5" opacity="0.5" transform="rotate(-15 40 52)" />
            <path d="M55,50 L55,67" stroke="#16A34A" strokeWidth="0.5" opacity="0.5" transform="rotate(5 55 50)" />
            <path d="M70,55 L70,70" stroke="#16A34A" strokeWidth="0.5" opacity="0.5" transform="rotate(25 70 55)" />
          </g>
          
          <motion.g
            animate={{ y: [0, -1, 0], rotate: [0, 1, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <ellipse cx="50" cy="28" rx="12" ry="10" fill="url(#birdBody)" />
            
            <path 
              d="M38,28 Q25,20 20,25 Q25,28 38,30" 
              fill="url(#birdWing)"
            />
            <path 
              d="M62,28 Q75,20 80,25 Q75,28 62,30" 
              fill="url(#birdWing)"
            />
            
            <ellipse cx="50" cy="20" rx="7" ry="6" fill="url(#birdBody)" />
            
            <path 
              d="M50,22 L56,20 L50,18" 
              fill="#F59E0B" 
              stroke="#D97706" 
              strokeWidth="0.3"
            />
            
            <circle cx="46" cy="18" r="1.5" fill="#1E293B" />
            <circle cx="54" cy="18" r="1.5" fill="#1E293B" />
            <circle cx="45.5" cy="17.5" r="0.5" fill="#F8FAFC" />
            <circle cx="53.5" cy="17.5" r="0.5" fill="#F8FAFC" />
            
            <path 
              d="M50,38 L48,48 L52,48 Z" 
              fill="#64748B"
            />
            
            <path 
              d="M43,13 Q45,8 47,12 M53,13 Q55,8 57,12" 
              fill="none" 
              stroke="#475569" 
              strokeWidth="1" 
              strokeLinecap="round"
            />
          </motion.g>
          
          <g opacity="0.6">
            <ellipse cx="30" cy="90" rx="15" ry="3" fill="#1E293B" opacity="0.1" />
            <ellipse cx="55" cy="92" rx="20" ry="4" fill="#1E293B" opacity="0.1" />
            <ellipse cx="75" cy="90" rx="12" ry="2" fill="#1E293B" opacity="0.1" />
          </g>
        </svg>
      </div>
      
      {showText && (
        <div className="flex flex-col">
          <span className={`font-black tracking-tighter text-[#1E293B] leading-none ${sizes[size].text}`}>
            Full Cells
          </span>
          <span className={`font-bold text-[#22C55E] uppercase tracking-[0.2em] mt-0.5 ${sizes[size].subtext}`}>
            FCPMS
          </span>
        </div>
      )}
    </div>
  );
}

export function FullCellsLogoDark({ size = "md", showText = true, className = "" }: FullCellsLogoProps) {
  const sizes = {
    sm: { container: "w-10 h-10", text: "text-sm", subtext: "text-[6px]" },
    md: { container: "w-14 h-14", text: "text-lg", subtext: "text-[8px]" },
    lg: { container: "w-20 h-20", text: "text-2xl", subtext: "text-xs" }
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`relative ${sizes[size].container}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <linearGradient id="branchGradientDark" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4ADE80" />
              <stop offset="50%" stopColor="#22C55E" />
              <stop offset="100%" stopColor="#16A34A" />
            </linearGradient>
            <linearGradient id="leafGradientDark" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#86EFAC" />
              <stop offset="100%" stopColor="#4ADE80" />
            </linearGradient>
            <filter id="leafShadowDark" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="1" dy="1" stdDeviation="2" floodColor="#22C55E" floodOpacity="0.4" />
            </filter>
            <radialGradient id="birdBodyDark" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#94A3B8" />
              <stop offset="100%" stopColor="#64748B" />
            </radialGradient>
            <linearGradient id="birdWingDark" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#CBD5E1" />
              <stop offset="100%" stopColor="#94A3B8" />
            </linearGradient>
          </defs>
          
          <g filter="url(#leafShadowDark)">
            <path 
              d="M10,85 Q20,70 35,65 Q50,62 65,68 Q78,75 85,85" 
              fill="none" 
              stroke="url(#branchGradientDark)" 
              strokeWidth="3" 
              strokeLinecap="round"
            />
            <path 
              d="M15,82 Q18,75 22,78" 
              fill="none" 
              stroke="url(#branchGradientDark)" 
              strokeWidth="2" 
              strokeLinecap="round"
            />
            <path 
              d="M75,78 Q80,72 85,76" 
              fill="none" 
              stroke="url(#branchGradientDark)" 
              strokeWidth="2" 
              strokeLinecap="round"
            />
          </g>
          
          <g filter="url(#leafShadowDark)">
            <ellipse cx="25" cy="58" rx="8" ry="14" fill="url(#leafGradientDark)" transform="rotate(-30 25 58)" />
            <ellipse cx="40" cy="52" rx="9" ry="16" fill="url(#leafGradientDark)" transform="rotate(-15 40 52)" />
            <ellipse cx="55" cy="50" rx="10" ry="17" fill="url(#leafGradientDark)" transform="rotate(5 55 50)" />
            <ellipse cx="70" cy="55" rx="8" ry="15" fill="url(#leafGradientDark)" transform="rotate(25 70 55)" />
            
            <path d="M25,58 L25,72" stroke="#22C55E" strokeWidth="0.5" opacity="0.6" transform="rotate(-30 25 58)" />
            <path d="M40,52 L40,68" stroke="#22C55E" strokeWidth="0.5" opacity="0.6" transform="rotate(-15 40 52)" />
            <path d="M55,50 L55,67" stroke="#22C55E" strokeWidth="0.5" opacity="0.6" transform="rotate(5 55 50)" />
            <path d="M70,55 L70,70" stroke="#22C55E" strokeWidth="0.5" opacity="0.6" transform="rotate(25 70 55)" />
          </g>
          
          <motion.g
            animate={{ y: [0, -1, 0], rotate: [0, 1, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <ellipse cx="50" cy="28" rx="12" ry="10" fill="url(#birdBodyDark)" />
            
            <path 
              d="M38,28 Q25,20 20,25 Q25,28 38,30" 
              fill="url(#birdWingDark)"
            />
            <path 
              d="M62,28 Q75,20 80,25 Q75,28 62,30" 
              fill="url(#birdWingDark)"
            />
            
            <ellipse cx="50" cy="20" rx="7" ry="6" fill="url(#birdBodyDark)" />
            
            <path 
              d="M50,22 L56,20 L50,18" 
              fill="#FBBF24" 
              stroke="#F59E0B" 
              strokeWidth="0.3"
            />
            
            <circle cx="46" cy="18" r="1.5" fill="#1E293B" />
            <circle cx="54" cy="18" r="1.5" fill="#1E293B" />
            <circle cx="45.5" cy="17.5" r="0.5" fill="#F8FAFC" />
            <circle cx="53.5" cy="17.5" r="0.5" fill="#F8FAFC" />
            
            <path 
              d="M50,38 L48,48 L52,48 Z" 
              fill="#94A3B8"
            />
            
            <path 
              d="M43,13 Q45,8 47,12 M53,13 Q55,8 57,12" 
              fill="none" 
              stroke="#CBD5E1" 
              strokeWidth="1" 
              strokeLinecap="round"
            />
          </motion.g>
        </svg>
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={`font-black tracking-tighter text-[#F8FAFC] leading-none ${sizes[size].text}`}>MENU</span>
          <span className={`font-bold text-[#22C55E] uppercase tracking-[0.2em] mt-0.5 ${sizes[size].subtext}`}>
            FCPMS
          </span>
        </div>
      )}
    </div>
  );
}
