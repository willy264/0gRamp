import { useState } from "react";
import { Icon } from "@iconify/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { motion } from "framer-motion";
import KYCModal from "./KYCModal";

export default function Header() {
  const [kycOpen, setKycOpen] = useState(false);

  return (
    <>
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex items-center justify-between px-4 md:px-6 py-4 bg-black/40 backdrop-blur-xl rounded-2xl m-2 border border-accent/20 relative overflow-hidden z-30"
        style={{
          boxShadow: "0 0 30px rgba(255, 79, 216, 0.1)",
        }}
      >
        {/* Animated gradient background */}
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              "linear-gradient(45deg, transparent 0%, rgba(255, 79, 216, 0.05) 50%, transparent 100%)",
              "linear-gradient(45deg, transparent 0%, rgba(255, 79, 216, 0.1) 50%, transparent 100%)",
              "linear-gradient(45deg, transparent 0%, rgba(255, 79, 216, 0.05) 50%, transparent 100%)",
            ],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        <div className="flex items-center gap-3 md:gap-4 relative z-10">
          <motion.div
            whileHover={{ rotate: 180, scale: 1.1 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <Icon
              icon="mdi:lightning-bolt"
              className="text-accent text-xl md:text-2xl"
            />
            <motion.div
              className="absolute inset-0 bg-accent/20 rounded-full blur-md"
              animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
          <span className="font-semibold text-sm md:text-base bg-linear-to-r from-white to-accent bg-clip-text text-transparent">
            RampFlow
          </span>
        </div>

        <div className="flex items-center gap-2 md:gap-3 relative z-10">
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setKycOpen(true)}
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-black/40 hover:bg-accent/20 border border-accent/20 hover:border-accent/50 transition-all duration-300 text-sm font-medium"
          >
            <Icon icon="mdi:account-check" className="text-accent" />
            <span>KYC</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setKycOpen(true)}
            className="sm:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-black/40 hover:bg-accent/20 border border-accent/20 hover:border-accent/50 transition-all duration-300"
          >
            <Icon icon="mdi:account-check" className="text-accent" />
          </motion.button>

          <motion.div whileHover={{ scale: 1.02 }} className="relative">
            <ConnectButton />
          </motion.div>
        </div>
      </motion.header>

      <KYCModal open={kycOpen} onClose={() => setKycOpen(false)} />
    </>
  );
}
