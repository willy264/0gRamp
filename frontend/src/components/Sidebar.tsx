import { Link, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { cn } from "../lib/utils";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
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
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "hidden md:flex flex-col backdrop-blur-xl bg-black/40 transition-all duration-300 border-r border-accent/20 h-full",
        collapsed ? "w-20" : "w-64"
      )}
      style={{
        boxShadow: "0 0 40px rgba(255, 79, 216, 0.1)",
      }}
    >
      <div className="flex flex-col h-full">
        <div className="p-4">
          {/* Logo */}
          <motion.div
            className={cn(
              "flex items-center mb-8",
              collapsed ? "justify-center" : "gap-2"
            )}
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              className="relative"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Icon
                icon="mdi:bridge"
                className="text-accent text-2xl relative z-10"
              />
              <motion.div
                className="absolute inset-0 bg-accent/20 rounded-full blur-md"
                animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-semibold text-white"
              >
                0G-Ramp
              </motion.span>
            )}
          </motion.div>

          {/* Navigation */}
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <NavItem
                key={item.to}
                to={item.to}
                icon={item.icon}
                label={item.label}
                active={pathname === item.to}
                collapsed={collapsed}
              />
            ))}
          </nav>
        </div>

        {/* Footer  */}
        <div className="mt-auto">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4"
            >
              <div className="bg-linear-to-br from-accent/10 to-purple-600/10 rounded-xl p-4 border border-accent/20">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <motion.div
                    className="w-2 h-2 bg-accent rounded-full"
                    animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="text-sm font-medium text-white">
                    System Live
                  </span>
                </div>
                <div className="text-xs text-gray-400 text-center">
                  Professional • Secure • 0G
                </div>
              </div>
            </motion.div>
          )}

          {/* Toggle button */}
          <motion.button
            whileHover={{ opacity: 1 }}
            whileTap={{ scale: 0.98 }}
            onClick={onToggle}
            className="w-full py-4 flex items-center justify-center gap-2 bg-black/50 hover:bg-accent/20 border-t border-accent/20 hover:border-accent/50 transition-all duration-300 opacity-80"
          >
            <Icon
              icon={collapsed ? "mdi:chevron-right" : "mdi:chevron-left"}
              className="text-xl text-accent"
            />
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-accent"
              >
                Collapse
              </motion.span>
            )}
          </motion.button>
        </div>
      </div>
    </motion.aside>
  );
}

function NavItem({
  to,
  icon,
  label,
  active,
  collapsed,
}: {
  to: string;
  icon: string;
  label: string;
  active: boolean;
  collapsed: boolean;
}) {
  return (
    <Link to={to}>
      <motion.div
        whileHover={{ scale: 1.02, x: 4 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden",
          active
            ? "bg-linear-to-r from-accent/20 to-purple-600/20 backdrop-blur-sm border border-accent/40 text-white"
            : "hover:bg-accent/10 hover:border-accent/20 border border-transparent text-gray-300 hover:text-white"
        )}
        style={{
          boxShadow: active ? "0 0 20px rgba(255, 79, 216, 0.2)" : undefined,
        }}
      >
        <motion.div
          className="relative z-10 flex items-center gap-3 w-full"
          whileHover={{ rotate: active ? 0 : 5 }}
        >
          <Icon
            icon={icon}
            className={cn(
              "text-xl transition-colors",
              active ? "text-accent" : "group-hover:text-accent"
            )}
          />
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-medium"
            >
              {label}
            </motion.span>
          )}
        </motion.div>

        {active && !collapsed && (
          <motion.div
            className="absolute right-2 w-1 h-8 bg-accent rounded-full"
            layoutId="activeIndicator"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
      </motion.div>
    </Link>
  );
}
