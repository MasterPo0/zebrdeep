import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring, useTransform, useReducedMotion, AnimatePresence } from 'framer-motion';
import { mascotImages } from '../assets/mascot';
import { Sparkles, Zap, ShieldCheck, Coins, ArrowRight } from 'lucide-react';

/**
 * Reusable ZEBR Mascot Component (Multi-pose & Jitter-Free)
 * 
 * Props:
 * - pose: 'default' | 'thumbsup' | 'crossedArms' | 'laptop' | 'presenting' | 'phone' (optional)
 * - position: 'hero' | 'middle' | 'bottom' | 'fixed' | 'inline' (default: 'fixed')
 * - size: 'small' | 'medium' | 'large' | 'xlarge' (default: 'medium')
 * - scrollAnimated: boolean (default: true)
 * - speechBubble: boolean (default: true)
 * - customText: string (optional)
 */
export const Zebra = ({
  pose = null,
  position = 'fixed',
  size = 'medium',
  scrollAnimated = true,
  speechBubble = true,
  customText = null,
  className = ''
}) => {
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();

  const [activeMessageIndex, setActiveMessageIndex] = useState(0);

  const brandMessages = [
    {
      title: "Xoş gəldiniz!",
      text: "Sevdiyiniz rəqəmsal məhsulları kəşf edin.",
      icon: Zap,
      badge: "ZEBR MARKET",
      poseKey: 'presenting'
    },
    {
      title: "Rəqəmsal Hesablar!",
      text: "Steam, PlayStation, Xbox, Discord, Netflix və Spotify.",
      icon: Sparkles,
      badge: "TOP ABUNƏLİKLƏR",
      poseKey: 'digitalApps'
    },
    {
      title: "100% Etibarlı!",
      text: "Rəsmi zəmanət və anında avtomatik təhvil.",
      icon: ShieldCheck,
      badge: "ZƏMANƏTLİ",
      poseKey: 'crossedArms'
    },
    {
      title: "Dincəlin & Həzz Alın!",
      text: "Saniyələr içində aktivləşən rahat rəqəmsal xidmət.",
      icon: Sparkles,
      badge: "RAHAT KOD",
      poseKey: 'chillBeanbag'
    },
    {
      title: "ZEBR Coin Cashback!",
      text: "Hər alışda 5% bonus qazanın və istifadə edin.",
      icon: Coins,
      badge: "LOYALLIQ",
      poseKey: 'phone'
    },
    {
      title: "Dinamik Və Sürətli!",
      text: "Ən sürətli təhvil ilə anında kodunuzu alın.",
      icon: ArrowRight,
      badge: "ANINDA TƏHVİL",
      poseKey: 'coolJump'
    }
  ];

  // Smooth spring for fluid position tracking without micro-jitter
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 40,
    damping: 24,
    restDelta: 0.001
  });

  // Track active scroll section for dynamic speech bubble and pose updates
  useEffect(() => {
    if (!scrollAnimated || position !== 'fixed') return;
    const unsub = scrollYProgress.on('change', (progress) => {
      if (progress < 0.16) setActiveMessageIndex(0);
      else if (progress < 0.33) setActiveMessageIndex(1);
      else if (progress < 0.50) setActiveMessageIndex(2);
      else if (progress < 0.66) setActiveMessageIndex(3);
      else if (progress < 0.83) setActiveMessageIndex(4);
      else setActiveMessageIndex(5);
    });
    return () => unsub();
  }, [scrollYProgress, scrollAnimated, position]);

  // STABLE & BOUNDED TRAJECTORY (Bounded safely so ears and shoes are never clipped)
  const yPos = useTransform(
    smoothProgress,
    [0, 0.25, 0.50, 0.75, 1.0],
    ['0vh', '15vh', '30vh', '45vh', '60vh']
  );

  const xPos = useTransform(
    smoothProgress,
    [0, 0.25, 0.50, 0.75, 1.0],
    ['0px', '-15px', '10px', '-10px', '0px']
  );

  const flipDirection = useTransform(
    smoothProgress,
    [0, 0.88, 0.94, 1.0],
    [1, 1, -1, -1]
  );

  // Enlarged sizes with safety margins
  const sizeClasses = {
    small: 'w-36 h-48 sm:w-40 sm:h-52 md:w-44 md:h-56',
    medium: 'w-52 h-68 sm:w-60 sm:h-76 md:w-72 md:h-88',
    large: 'w-64 h-80 sm:w-76 sm:h-96 md:w-88 md:h-[440px]',
    xlarge: 'w-76 h-96 sm:w-88 sm:h-[440px] md:w-[380px] md:h-[480px]'
  }[size] || 'w-52 h-68 sm:w-60 sm:h-76 md:w-72 md:h-88';

  if (shouldReduceMotion) return null;

  const currentMessage = brandMessages[activeMessageIndex];
  const IconComponent = currentMessage.icon;
  const currentPoseImg = pose 
    ? (mascotImages[pose] || mascotImages.default)
    : (mascotImages[currentMessage.poseKey] || mascotImages.default);

  // Inline / Non-fixed stationary mascot variant
  if (!scrollAnimated || position !== 'fixed') {
    return (
      <div className={`relative flex flex-col items-center justify-center ${sizeClasses} ${className}`}>
        {speechBubble && (
          <div className="mb-3 bg-white/95 dark:bg-[#14171D]/95 border border-slate-200 dark:border-slate-800 p-3 rounded-2xl shadow-xl backdrop-blur-md text-center max-w-xs z-10">
            <span className="px-2 py-0.5 rounded-full bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 text-[9px] font-mono font-bold">
              ZEBR MASCOT
            </span>
            <p className="text-xs font-bold text-slate-900 dark:text-white mt-1">
              {customText || currentMessage.text}
            </p>
          </div>
        )}
        <AnimatePresence mode="wait">
          <motion.img
            key={pose || currentMessage.poseKey}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            src={currentPoseImg}
            alt="ZEBR mascot"
            className="w-full h-full object-contain filter drop-shadow-xl"
          />
        </AnimatePresence>
      </div>
    );
  }

  // Floating & Scroll-Animated Mascot
  return (
    <div className="fixed inset-y-0 right-2 sm:right-6 md:right-10 pointer-events-none z-20 overflow-visible w-64 sm:w-76 md:w-96 select-none">
      <motion.div
        className="absolute top-20 w-full flex flex-col items-center"
        style={{
          y: yPos,
          x: xPos,
        }}
      >
        {/* Docked Speech Bubble Callout */}
        {speechBubble && (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMessageIndex}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="absolute -top-16 right-4 bg-white/95 dark:bg-[#14171D]/95 border border-slate-200 dark:border-slate-800 p-3 rounded-2xl shadow-lg backdrop-blur-md pointer-events-auto w-56 sm:w-64"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="px-2 py-0.5 rounded-full bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 text-[8px] font-mono font-bold">
                  {currentMessage.badge}
                </span>
                <IconComponent className="w-3.5 h-3.5 text-amber-500" />
              </div>

              <h4 className="text-[11px] font-bold text-slate-900 dark:text-white leading-tight">
                {currentMessage.title}
              </h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug mt-0.5">
                {customText || currentMessage.text}
              </p>

              <div className="absolute -bottom-1.5 right-8 w-3 h-3 bg-white dark:bg-[#14171D] border-r border-b border-slate-200 dark:border-slate-800 transform rotate-45" />
            </motion.div>
          </AnimatePresence>
        )}

        {/* Mascot Image Container */}
        <div className={`relative ${sizeClasses} flex items-center justify-center`}>
          <AnimatePresence mode="wait">
            <motion.img 
              key={currentMessage.poseKey}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.3 }}
              src={currentPoseImg} 
              alt="ZEBR mascot" 
              className="w-full h-full object-contain filter drop-shadow-lg"
              style={{
                scaleX: flipDirection
              }}
            />
          </AnimatePresence>
        </div>

      </motion.div>
    </div>
  );
};

export default Zebra;
