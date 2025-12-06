import { motion } from "framer-motion";

interface CursorFollowEffectProps {
  mousePosition: { x: number; y: number };
}

export function CursorFollowEffect({ mousePosition }: CursorFollowEffectProps) {
  return (
    <motion.div
      className="fixed w-96 h-96 rounded-full pointer-events-none z-0 blur-3xl"
      style={{
        background:
          "radial-gradient(circle, rgba(255, 79, 216, 0.15) 0%, transparent 70%)",
        left: mousePosition.x - 192,
        top: mousePosition.y - 192,
      }}
      animate={{
        x: mousePosition.x - 192,
        y: mousePosition.y - 192,
      }}
      transition={{ type: "spring", damping: 30, stiffness: 200 }}
    />
  );
}
