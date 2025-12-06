import { motion, useTransform } from "framer-motion";

interface AnimatedBackgroundGridProps {
  scrollYProgress: any;
}

export function AnimatedBackgroundGrid({
  scrollYProgress,
}: AnimatedBackgroundGridProps) {
  return (
    <motion.div
      className="absolute inset-0"
      style={{
        backgroundImage: `
          linear-gradient(rgba(255, 79, 216, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 79, 216, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: "50px 50px",
        opacity: useTransform(scrollYProgress, [0, 1], [0.5, 0.1]),
      }}
    />
  );
}
