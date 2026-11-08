import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface LuxuryPageLoaderProps {
  onLoadingComplete?: () => void;
}

export const LuxuryPageLoader: React.FC<LuxuryPageLoaderProps> = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Quick, silky loading progress simulation for instant luxury feel
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsVisible(false);
            if (onLoadingComplete) onLoadingComplete();
          }, 350);
          return 100;
        }
        // Organic acceleration curve
        const step = prev < 50 ? 12 : prev < 85 ? 18 : 25;
        return Math.min(100, prev + step);
      });
    }, 60);

    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="luxury-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FAF8F5] text-stone-900 pointer-events-auto select-none"
        >
          {/* Subtle warm ambient background radial glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#F4EFE6]/70 via-[#FAF8F5] to-[#FAF8F5] pointer-events-none" />

          {/* Center Brand Emblem */}
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative flex flex-col items-center z-10"
          >
            {/* Soft pulsing gold aura */}
            <div className="relative mb-6">
              <motion.div
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.35, 0.65, 0.35],
                }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute -inset-4 rounded-full bg-gradient-to-tr from-[#C5A880]/30 via-[#E5D7C2]/40 to-transparent blur-md"
              />

              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-[#D8C7B0] bg-white/80 shadow-md flex items-center justify-center backdrop-blur-xs">
                <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-[#C5A880] stroke-[1.25]" />
              </div>
            </div>

            {/* Brand Title */}
            <motion.h1
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="font-display text-2xl sm:text-3xl tracking-[0.25em] font-light text-stone-900 uppercase text-center"
            >
              Lumina
            </motion.h1>

            <motion.p
              initial={{ y: 6, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.6 }}
              className="text-[10px] sm:text-[11px] font-semibold tracking-[0.3em] uppercase text-[#8C6D45] mt-1.5"
            >
              Medical Aesthetics & Longevity
            </motion.p>

            {/* Hairline Luxury Progress Bar */}
            <div className="w-48 sm:w-60 h-[2px] bg-stone-200/80 rounded-full mt-8 overflow-hidden relative">
              <motion.div
                className="h-full bg-gradient-to-r from-[#C5A880] via-[#DFCAAB] to-[#B09167] rounded-full"
                style={{ width: `${progress}%` }}
                transition={{ ease: 'easeOut', duration: 0.1 }}
              />
            </div>

            {/* Progress Percentage Display */}
            <div className="text-[10px] tracking-widest text-stone-500 font-mono mt-3">
              {progress}%
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
