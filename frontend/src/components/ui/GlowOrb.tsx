import { motion } from "framer-motion";

interface GlowOrbProps {
  className?: string;
  delay?: number;
}

export function GlowOrb({ className = "", delay = 0 }: GlowOrbProps) {
  return (
    <motion.div
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.6, 0.3],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
        delay: delay,
      }}
      className={`hidden md:block absolute rounded-full blur-3xl ${className}`}
      style={{
        background:
          "radial-gradient(circle, rgba(255, 79, 216, 0.4) 0%, transparent 70%)",
      }}
    />
  );
}
