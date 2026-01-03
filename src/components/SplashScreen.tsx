import { motion } from "framer-motion";
import logo from "@/assets/JE_Techhub_logo.png";

interface SplashScreenProps {
  onComplete?: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-br from-primary via-primary/95 to-primary/90"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      onAnimationComplete={onComplete}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 african-pattern" />
      </div>

      {/* Glow Effect */}
      <motion.div
        className="absolute w-96 h-96 rounded-full bg-white/10 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Logo Container */}
      <motion.div
        className="relative z-10 flex flex-col items-center gap-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Logo */}
        <motion.img
          src={logo}
          alt="JE TechHub"
          className="h-20 md:h-28 w-auto brightness-0 invert drop-shadow-2xl"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{
            duration: 0.5,
            ease: "easeOut",
          }}
        />

        {/* Loading Indicator */}
        <div className="flex flex-col items-center gap-4">
          {/* Spinner */}
          <motion.div
            className="relative w-12 h-12"
            animate={{ rotate: 360 }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <div className="absolute inset-0 rounded-full border-2 border-white/20" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-white" />
          </motion.div>

          {/* Loading Text */}
          <motion.p
            className="text-white/80 text-sm font-medium tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Loading...
          </motion.p>
        </div>
      </motion.div>

      {/* Bottom Tagline */}
      <motion.p
        className="absolute bottom-8 text-white/60 text-xs tracking-widest uppercase"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Learn Tech Skills • Quality Gadgets
      </motion.p>
    </motion.div>
  );
};
