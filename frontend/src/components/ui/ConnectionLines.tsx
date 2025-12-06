import { motion } from "framer-motion";

interface ConnectionLinesProps {
  className?: string;
}

export function ConnectionLines({ className = "" }: ConnectionLinesProps) {
  return (
    <motion.div
      className={`hidden md:block absolute top-1/4 left-1/4 right-1/4 h-0.5 bg-linear-to-r from-accent to-purple-600 ${className}`}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1, delay: 0.5 }}
    />
  );
}
