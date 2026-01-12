import { motion } from "framer-motion";
import loginBg from "@assets/stock_images/Gemini_Generated_Image_6fkmut6fkmut6fkm_1767644075541.png";

export function CinematicLoginBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${loginBg})`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/50 to-slate-900/80" />
      
      <motion.div 
        className="absolute inset-0 opacity-30"
        animate={{ 
          background: [
            "radial-gradient(ellipse at 20% 50%, rgba(34, 197, 94, 0.15) 0%, transparent 50%)",
            "radial-gradient(ellipse at 80% 50%, rgba(34, 197, 94, 0.15) 0%, transparent 50%)",
            "radial-gradient(ellipse at 20% 50%, rgba(34, 197, 94, 0.15) 0%, transparent 50%)",
          ]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      
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
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-600 to-emerald-900 nile-flow-layer" />
      </div>

      <div className="absolute bottom-0 left-0 w-full h-[300px] opacity-[0.12]">
        <svg viewBox="0 0 1400 300" preserveAspectRatio="xMidYMax slice" className="w-full h-full">
          <g fill="#F8FAFC" fillOpacity="0.4">
            <polygon points="200,300 260,120 320,300" />
            <polygon points="280,300 350,80 420,300" />
            <polygon points="370,300 450,50 530,300" />
            <polygon points="460,300 530,100 600,300" />
          </g>
        </svg>
      </div>

      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-emerald-400/40 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
}
