import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../lib/utils";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const { pathname } = useLocation();

  const navItems = [
    { to: "/", icon: "mdi:home", label: "Home" },
    { to: "/dashboard", icon: "mdi:view-dashboard", label: "Dashboard" },
    { to: "/onramp", icon: "mdi:bank-transfer-in", label: "On-Ramp" },
    { to: "/offramp", icon: "mdi:bank-transfer-out", label: "Off-Ramp" },
    { to: "/transactions", icon: "mdi:clipboard-text", label: "Transactions" },
    { to: "/developers", icon: "mdi:code-braces", label: "Developers" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30 }}
            className="fixed top-0 left-0 h-full w-80 bg-black/90 backdrop-blur-xl border-r border-accent/20 z-50"
            style={{
              boxShadow: "0 0 40px rgba(255, 79, 216, 0.1)",
            }}
          >
            <div className="p-6">
              {/* Logo */}
              <div className="flex items-center gap-3 mb-8">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <Icon icon="mdi:bridge" className="text-accent text-3xl" />
                </motion.div>
                <span className="font-bold text-2xl bg-linear-to-r from-white via-accent to-purple-400 bg-clip-text text-transparent">
                  0G Ramp
                </span>
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                {navItems.map((item) => (
                  <Link key={item.to} to={item.to} onClick={onClose}>
                    <motion.div
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300",
                        pathname === item.to
                          ? "bg-linear-to-r from-accent/20 to-purple-600/20 border border-accent/40 text-white"
                          : "text-gray-400 hover:text-white hover:bg-accent/10"
                      )}
                    >
                      <Icon icon={item.icon} className="text-xl" />
                      <span className="font-medium">{item.label}</span>
                    </motion.div>
                  </Link>
                ))}
              </nav>
            </div>

            {/* Close button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 border border-accent/30 text-accent hover:bg-accent/20 transition-colors"
            >
              <Icon icon="mdi:close" />
            </motion.button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
