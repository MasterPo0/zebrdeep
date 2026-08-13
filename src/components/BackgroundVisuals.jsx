import React from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { 
  Tv, 
  Gamepad2, 
  Sparkles, 
  Code, 
  Zap, 
  ShieldCheck, 
  Gift, 
  Rocket, 
  Star, 
  Headphones, 
  Flame, 
  Crown
} from 'lucide-react';

export const BackgroundVisuals = () => {
  const { scrollYProgress } = useScroll();

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 45,
    damping: 18,
    restDelta: 0.001
  });

  // Parallax offsets for different layers
  const yShift1 = useTransform(smoothProgress, [0, 1], ['0px', '-350px']);
  const yShift2 = useTransform(smoothProgress, [0, 1], ['0px', '400px']);
  const yShift3 = useTransform(smoothProgress, [0, 1], ['0px', '-220px']);
  const yShift4 = useTransform(smoothProgress, [0, 1], ['0px', '280px']);

  // Parallax horizontal shifts (sliding & clustering)
  const xCluster1 = useTransform(smoothProgress, [0, 0.5, 1], ['0px', '80px', '-40px']);
  const xCluster2 = useTransform(smoothProgress, [0, 0.5, 1], ['0px', '-90px', '60px']);

  // Dynamic scaling (icons expand/contract as user scrolls)
  const scalePulse = useTransform(smoothProgress, [0, 0.25, 0.5, 0.75, 1], [1, 1.25, 0.85, 1.2, 1]);
  const rotateAngle = useTransform(smoothProgress, [0, 1], [0, 180]);

  const bgIcons = [
    { Icon: Tv, top: '5%', left: '5%', color: 'text-purple-500/25 dark:text-purple-400/20', size: 'w-16 h-16', parallax: yShift1, x: xCluster1 },
    { Icon: Gamepad2, top: '12%', right: '8%', color: 'text-indigo-500/25 dark:text-indigo-400/20', size: 'w-20 h-20', parallax: yShift2, x: xCluster2 },
    { Icon: Sparkles, top: '22%', left: '15%', color: 'text-amber-500/25 dark:text-amber-400/20', size: 'w-14 h-14', parallax: yShift3, x: xCluster1 },
    { Icon: Code, top: '30%', right: '12%', color: 'text-blue-500/25 dark:text-blue-400/20', size: 'w-18 h-18', parallax: yShift4, x: xCluster2 },
    
    { Icon: Zap, top: '42%', left: '8%', color: 'text-amber-400/25 dark:text-amber-300/20', size: 'w-16 h-16', parallax: yShift1, x: xCluster2 },
    { Icon: ShieldCheck, top: '48%', right: '18%', color: 'text-emerald-500/25 dark:text-emerald-400/20', size: 'w-16 h-16', parallax: yShift3, x: xCluster1 },
    { Icon: Gift, top: '55%', left: '20%', color: 'text-pink-500/25 dark:text-pink-400/20', size: 'w-14 h-14', parallax: yShift2, x: xCluster2 },
    { Icon: Rocket, top: '62%', right: '6%', color: 'text-violet-500/25 dark:text-violet-400/20', size: 'w-20 h-20', parallax: yShift4, x: xCluster1 },

    { Icon: Star, top: '70%', left: '10%', color: 'text-amber-500/25 dark:text-amber-400/20', size: 'w-16 h-16', parallax: yShift1, x: xCluster1 },
    { Icon: Headphones, top: '78%', right: '15%', color: 'text-purple-500/25 dark:text-purple-400/20', size: 'w-18 h-18', parallax: yShift3, x: xCluster2 },
    { Icon: Flame, top: '85%', left: '18%', color: 'text-orange-500/25 dark:text-orange-400/20', size: 'w-14 h-14', parallax: yShift2, x: xCluster1 },
    { Icon: Crown, top: '92%', right: '8%', color: 'text-amber-400/25 dark:text-amber-300/20', size: 'w-16 h-16', parallax: yShift4, x: xCluster2 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      
      {/* 1. Ambient Dynamic Color Mesh Blobs */}
      <div className="absolute top-0 left-1/4 w-[550px] h-[550px] bg-purple-500/10 dark:bg-purple-900/15 rounded-full blur-[140px] animate-pulse-glow" />
      <div className="absolute top-[35%] right-0 w-[600px] h-[600px] bg-blue-500/10 dark:bg-blue-900/15 rounded-full blur-[160px] animate-pulse-glow" />
      <div className="absolute top-[70%] left-0 w-[550px] h-[550px] bg-amber-500/10 dark:bg-amber-900/15 rounded-full blur-[150px] animate-pulse-glow" />

      {/* 2. Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-80" />

      {/* 3. Dense Cloud of Interactive Parallax Icons */}
      {bgIcons.map((item, index) => {
        const IconComponent = item.Icon;
        return (
          <motion.div
            key={index}
            className={`absolute ${item.size} ${item.color} select-none`}
            style={{
              top: item.top,
              left: item.left,
              right: item.right,
              y: item.parallax,
              x: item.x,
              scale: scalePulse,
              rotate: rotateAngle
            }}
          >
            <IconComponent className="w-full h-full" />
          </motion.div>
        );
      })}

      {/* 4. Subtle Ambient Concentric Depth Rings */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] border border-slate-300/20 dark:border-slate-800/30 rounded-full pointer-events-none" />
      <div className="absolute top-2/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] border border-slate-300/15 dark:border-slate-800/20 rounded-full pointer-events-none" />

    </div>
  );
};
