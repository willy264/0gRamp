import { useState, useEffect, type ReactNode } from "react";
import { motion } from "framer-motion";
import Sidebar from "./Sidebar";
import Header from "./Header";
import MobileSidebar from "./MobileSidebar";
import { cn } from "../lib/utils";
import { Icon } from "@iconify/react";
import { useLocation } from "react-router-dom";

export default function Layout({ children }: { children: ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -top-32 -left-32 w-48 h-48 bg-linear-to-br from-[#FF4FD8]/3 to-purple-600/3 rounded-full blur-2xl opacity-30"
        />
        <motion.div
          animate={{
            rotate: [360, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -bottom-32 -right-32 w-72 h-72 bg-linear-to-br from-purple-600/3 to-[#FF4FD8]/3 rounded-full blur-2xl opacity-30"
        />
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      {/* Sidebar - Desktop */}
      <div className="fixed left-0 top-0 h-screen z-20 hidden md:block">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Main Content */}
      <div className="flex flex-col min-h-screen relative z-10 w-full pb-20 md:pb-0">
        {/* Mobile Menu Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setMobileSidebarOpen(true)}
          className="md:hidden fixed top-6 left-4 z-50 w-10 h-10 flex items-center justify-center rounded-xl bg-black/40 backdrop-blur-xl border border-accent/30 text-accent shadow-lg shadow-black/10"
        >
          <Icon icon="mdi:menu" className="text-xl" />
        </motion.button>

        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className={cn(
            "flex-1 relative bg-transparent ml-0 transition-all duration-300 flex flex-col",
            sidebarCollapsed ? "md:ml-20" : "md:ml-64"
          )}
        >
          <Header />
          <div className="flex-1 p-4">{children}</div>
        </motion.main>
      </div>
    </div>
  );
}
