import { motion } from "framer-motion";

export function MeroeNileSilhouette() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <div className="absolute inset-0 bg-gradient-to-br from-[#F8FAFC] via-[#F8FAFC] to-[#22C55E]/5" />
      
      <div className="absolute bottom-0 left-0 w-full h-64 opacity-20 pointer-events-none">
        <style>{`
          @keyframes nileWaves {
            0%, 100% { clip-path: polygon(0% 45%, 15% 44%, 32% 50%, 54% 45%, 75% 52%, 100% 45%, 100% 100%, 0% 100%); }
            50% { clip-path: polygon(0% 60%, 18% 55%, 33% 65%, 51% 58%, 70% 65%, 100% 60%, 100% 100%, 0% 100%); }
          }
          .nile-flow-layer {
            animation: nileWaves 10s ease-in-out infinite;
          }
        `}</style>
        <div className="absolute inset-0 bg-gradient-to-b from-[#1E293B] to-[#0F172A] nile-flow-layer" />
      </div>
      
      <motion.div 
        className="absolute top-20 right-20 w-96 h-96 opacity-[0.03]"
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
      >
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="100" cy="100" r="80" fill="none" stroke="#22C55E" strokeWidth="0.5" />
          <circle cx="100" cy="100" r="60" fill="none" stroke="#1E293B" strokeWidth="0.3" />
          <circle cx="100" cy="100" r="40" fill="none" stroke="#22C55E" strokeWidth="0.5" />
          <path d="M100,20 L100,180 M20,100 L180,100" stroke="#1E293B" strokeWidth="0.3" />
        </svg>
      </motion.div>
    </div>
  );
}

export function TaharqaBarkalSilhouette() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1E293B] via-[#1E293B] to-[#22C55E]/10" />
      
      <div className="absolute bottom-0 left-0 w-full h-[400px] opacity-[0.15]">
        <svg viewBox="0 0 1400 400" preserveAspectRatio="xMidYMax slice" className="w-full h-full">
          <defs>
            <linearGradient id="barkalGradient" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#22C55E" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#F8FAFC" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#F8FAFC" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          
          <path 
            d="M0,400 L0,350 Q50,300 100,350 Q150,250 250,300 Q300,200 400,280 Q500,350 600,320 Q700,280 800,340 Q900,300 1000,360 Q1100,320 1200,350 Q1300,300 1400,340 L1400,400 Z" 
            fill="url(#barkalGradient)" 
          />
          
          <g fill="#F8FAFC" fillOpacity="0.25">
            <polygon points="500,400 560,220 620,400" />
            <polygon points="580,400 650,180 720,400" />
            <polygon points="670,400 750,140 830,400" />
            <polygon points="760,400 830,200 900,400" />
          </g>
          
          <g fill="#F8FAFC" fillOpacity="0.15">
            <path d="M100,400 L100,300 Q130,280 160,300 L160,400 Z" />
            <rect x="115" y="320" width="30" height="40" rx="15" />
            <rect x="122" y="335" width="16" height="65" />
            
            <path d="M1200,400 L1200,280 Q1240,260 1280,280 L1280,400 Z" />
            <rect x="1220" y="300" width="40" height="50" rx="20" />
            <rect x="1230" y="320" width="20" height="80" />
          </g>
          
          <g fill="none" stroke="#22C55E" strokeWidth="1" strokeOpacity="0.3">
            <path d="M200,400 Q250,380 300,390 Q350,370 400,385 Q450,365 500,380" />
            <path d="M900,400 Q950,375 1000,388 Q1050,360 1100,378" />
          </g>
        </svg>
      </div>
      
      <div className="absolute top-10 left-10 w-64 h-64 opacity-[0.06]">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <g fill="none" stroke="#22C55E" strokeWidth="0.8">
            <circle cx="100" cy="100" r="90" />
            <circle cx="100" cy="100" r="70" />
            <path d="M100,10 L100,190 M10,100 L190,100" strokeDasharray="4,4" />
            <path d="M30,30 L170,170 M170,30 L30,170" strokeDasharray="2,6" />
          </g>
          <circle cx="100" cy="100" r="20" fill="#22C55E" fillOpacity="0.2" />
        </svg>
      </div>
      
      <motion.div 
        className="absolute top-1/4 right-10 opacity-[0.04]"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="120" height="200" viewBox="0 0 120 200">
          <path d="M60,0 L70,20 L90,25 L75,45 L80,70 L60,55 L40,70 L45,45 L30,25 L50,20 Z" fill="#22C55E" fillOpacity="0.5" />
          <rect x="55" y="70" width="10" height="130" fill="#F8FAFC" fillOpacity="0.3" />
        </svg>
      </motion.div>
    </div>
  );
}

export function AmanitoreInclusivitySilhouette() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <div className="absolute inset-0 bg-gradient-to-br from-[#F8FAFC] via-[#F8FAFC] to-[#22C55E]/8" />
      
      <div className="absolute bottom-0 left-0 w-full h-[350px] opacity-[0.08]">
        <svg viewBox="0 0 1400 350" preserveAspectRatio="xMidYMax slice" className="w-full h-full">
          <defs>
            <linearGradient id="amanireGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1E293B" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#22C55E" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          
          <g fill="url(#amanireGradient)">
            <ellipse cx="200" cy="320" rx="150" ry="30" fillOpacity="0.3" />
            <path d="M200,80 C140,80 100,180 100,280 C100,300 120,320 200,320 C280,320 300,300 300,280 C300,180 260,80 200,80" />
            <ellipse cx="200" cy="60" rx="40" ry="50" />
            <path d="M140,40 L120,10 M160,30 L140,0 M240,30 L260,0 M260,40 L280,10" stroke="#1E293B" strokeWidth="3" />
            <circle cx="185" cy="55" r="6" fill="#F8FAFC" fillOpacity="0.5" />
            <circle cx="215" cy="55" r="6" fill="#F8FAFC" fillOpacity="0.5" />
            <ellipse cx="200" cy="180" rx="25" ry="35" fill="#22C55E" fillOpacity="0.15" />
            <rect x="175" y="130" width="50" height="8" rx="4" fill="#F8FAFC" fillOpacity="0.3" />
            <rect x="180" y="142" width="40" height="6" rx="3" fill="#F8FAFC" fillOpacity="0.2" />
          </g>
          
          <g fill="#1E293B" fillOpacity="0.1">
            <path d="M1100,350 L1100,200 L1150,170 L1200,200 L1200,350 Z" />
            <circle cx="1150" cy="140" r="30" />
            <path d="M1120,130 L1100,100 M1180,130 L1200,100" stroke="#1E293B" strokeWidth="2" />
          </g>
          
          <g fill="none" stroke="#22C55E" strokeWidth="1" strokeOpacity="0.2">
            <path d="M400,350 Q500,320 600,340 Q700,300 800,330 Q900,310 1000,340" />
          </g>
          
          <g fill="#22C55E" fillOpacity="0.15">
            <path d="M600,350 L600,300 Q620,280 640,300 Q660,280 680,300 Q700,280 720,300 L720,350 Z" />
            <ellipse cx="660" cy="290" rx="50" ry="20" />
          </g>
        </svg>
      </div>
      
      <motion.div 
        className="absolute top-20 right-20 w-40 h-40 opacity-[0.04]"
        animate={{ rotate: [-5, 5, -5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#22C55E" strokeWidth="2" />
          <path d="M50,5 L50,95 M5,50 L95,50" stroke="#1E293B" strokeWidth="1" />
          <circle cx="50" cy="50" r="15" fill="#22C55E" fillOpacity="0.3" />
        </svg>
      </motion.div>
    </div>
  );
}

export function TelecomGreenEnergySilhouette() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <div className="absolute inset-0 bg-gradient-to-br from-[#F8FAFC] via-[#F8FAFC] to-[#22C55E]/10" />
      
      <div className="absolute bottom-0 right-0 w-[600px] h-[500px] opacity-[0.08]">
        <svg viewBox="0 0 400 500" preserveAspectRatio="xMaxYMax slice" className="w-full h-full">
          <defs>
            <linearGradient id="towerGradient" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#1E293B" stopOpacity="1" />
              <stop offset="100%" stopColor="#22C55E" stopOpacity="0.5" />
            </linearGradient>
          </defs>
          
          <g fill="url(#towerGradient)">
            <polygon points="180,500 195,50 205,50 220,500" />
            <polygon points="160,500 195,200 205,200 240,500" fillOpacity="0.5" />
            <rect x="185" y="30" width="30" height="40" rx="5" />
            <circle cx="200" cy="20" r="15" fill="#22C55E" fillOpacity="0.4" />
            
            <g stroke="#1E293B" strokeWidth="2" fill="none">
              <line x1="195" y1="100" x2="160" y2="120" />
              <line x1="205" y1="100" x2="240" y2="120" />
              <line x1="195" y1="180" x2="150" y2="210" />
              <line x1="205" y1="180" x2="250" y2="210" />
              <line x1="195" y1="280" x2="140" y2="320" />
              <line x1="205" y1="280" x2="260" y2="320" />
            </g>
          </g>
          
          <motion.g 
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <circle cx="200" cy="100" r="40" fill="none" stroke="#22C55E" strokeWidth="1" strokeOpacity="0.3" />
            <circle cx="200" cy="100" r="60" fill="none" stroke="#22C55E" strokeWidth="0.5" strokeOpacity="0.2" />
            <circle cx="200" cy="100" r="80" fill="none" stroke="#22C55E" strokeWidth="0.3" strokeOpacity="0.1" />
          </motion.g>
        </svg>
      </div>
      
      <div className="absolute bottom-0 left-0 w-[500px] h-[400px] opacity-[0.06]">
        <svg viewBox="0 0 400 400" preserveAspectRatio="xMinYMax slice" className="w-full h-full">
          <g fill="#22C55E">
            <path d="M50,400 L80,300 L110,400 Z" fillOpacity="0.4" />
            <rect x="77" y="300" width="6" height="100" fillOpacity="0.3" />
            <ellipse cx="80" cy="300" rx="40" ry="15" fillOpacity="0.2" />
            
            <path d="M120,400 L160,280 L200,400 Z" fillOpacity="0.35" />
            <rect x="157" y="280" width="6" height="120" fillOpacity="0.25" />
            <ellipse cx="160" cy="280" rx="50" ry="18" fillOpacity="0.18" />
            
            <path d="M200,400 L250,250 L300,400 Z" fillOpacity="0.3" />
            <rect x="247" y="250" width="6" height="150" fillOpacity="0.2" />
            <ellipse cx="250" cy="250" rx="60" ry="20" fillOpacity="0.15" />
          </g>
          
          <g fill="none" stroke="#1E293B" strokeWidth="0.5" strokeOpacity="0.2">
            <rect x="300" y="350" width="80" height="50" rx="5" />
            <rect x="310" y="320" width="60" height="30" rx="3" />
            <rect x="315" y="360" width="20" height="35" rx="2" />
            <rect x="345" y="365" width="25" height="30" rx="2" />
          </g>
        </svg>
      </div>
      
      <motion.div 
        className="absolute top-40 left-1/3 opacity-[0.03]"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <svg width="200" height="200" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="90" fill="none" stroke="#22C55E" strokeWidth="2" strokeDasharray="10,5" />
          <path d="M100,10 L100,190" stroke="#1E293B" strokeWidth="1" />
          <path d="M10,100 L190,100" stroke="#1E293B" strokeWidth="1" />
          <circle cx="100" cy="100" r="30" fill="#22C55E" fillOpacity="0.2" />
        </svg>
      </motion.div>
      
      <div className="absolute top-10 right-10 w-32 h-32 opacity-[0.05]">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#22C55E" strokeWidth="2" />
          <path d="M50,15 L50,85" stroke="#22C55E" strokeWidth="2" />
          <path d="M25,35 L50,15 L75,35" fill="none" stroke="#22C55E" strokeWidth="2" />
          <circle cx="50" cy="50" r="10" fill="#22C55E" fillOpacity="0.4" />
        </svg>
      </div>
    </div>
  );
}
