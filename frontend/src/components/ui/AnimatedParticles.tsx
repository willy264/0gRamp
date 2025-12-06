import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface AnimatedParticlesProps {
  className?: string;
}

export function AnimatedParticles({ className = "" }: AnimatedParticlesProps) {
  const [count, setCount] = useState(6);

  useEffect(() => {
    function handleResize() {
      const w = window.innerWidth;
      setCount(w < 768 ? 3 : 6);
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-2 h-2 bg-accent rounded-full ${className}`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100 - Math.random() * 60, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </>
  );
}

export default AnimatedParticles;
