import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";

export default function Dashboard() {
  const cubicBezierEase: any = [0.22, 1, 0.36, 1];

  const statsVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: cubicBezierEase,
      },
    }),
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: cubicBezierEase,
      },
    },
  };

  return (
    <Layout>
      <div className="min-h-screen bg-transparent">
        <div className="max-w-7xl mx-auto px-2 md:px-4 py-4 md:py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8 md:mb-12"
          >
            <motion.div
              className="inline-flex items-center justify-center w-20 md:w-24 h-20 md:h-24 bg-linear-to-br from-accent/20 to-purple-600/20 backdrop-blur-xl rounded-3xl mb-4 md:mb-6 relative overflow-hidden border border-accent/30"
              whileHover={{ scale: 1.05, rotate: 5 }}
              style={{
                boxShadow: "0 0 40px rgba(255, 79, 216, 0.3)",
              }}
            >
              <motion.div
                className="absolute inset-0 bg-linear-to-r from-accent/20 to-transparent"
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
              <Icon
                icon="mdi:swap-horizontal-bold"
                className="text-4xl md:text-5xl text-accent relative z-10"
              />
            </motion.div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 md:mb-4 bg-linear-to-r from-white via-accent to-purple-400 bg-clip-text">
              0G-Ramp Dashboard
            </h1>
            <p className="text-base md:text-xl text-gray-300 max-w-2xl mx-auto px-4">
              Your gateway to seamless fiat-to-crypto and crypto-to-fiat
              transactions.
            </p>
          </motion.div>

          {/* Stats Overview */}
          <motion.div
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-8 md:mb-12"
          >
            {[
              {
                icon: "mdi:trending-up",
                label: "Total Volume",
                value: "$2.4M",
                color: "from-accent/80 to-purple-600/60",
                iconColor: "text-accent",
              },
              {
                icon: "mdi:check-circle",
                label: "Transactions",
                value: "1,247",
                color: "from-green-400 to-emerald-600",
                iconColor: "text-green-400",
              },
              {
                icon: "mdi:account-group",
                label: "Active Users",
                value: "892",
                color: "from-purple-400/80 to-pink-600/60",
                iconColor: "text-purple-400",
              },
              {
                icon: "mdi:clock-outline",
                label: "Avg. Time",
                value: "2.3m",
                color: "from-orange-400 to-red-600",
                iconColor: "text-orange-400",
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                custom={index}
                variants={statsVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-black/40 backdrop-blur-xl rounded-2xl border border-accent/20 p-4 md:p-6 hover:border-accent/40 transition-all duration-300 relative overflow-hidden group"
                style={{
                  boxShadow: "0 0 20px rgba(255, 79, 216, 0.1)",
                }}
              >
                <motion.div
                  className={`absolute inset-0 bg-linear-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity`}
                />
                <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4 relative z-10">
                  <motion.div
                    className={`w-12 h-12 md:w-14 md:h-14 bg-linear-to-br ${stat.color} rounded-xl flex items-center justify-center border border-accent/30 group-hover:scale-110 transition-transform`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Icon
                      icon={stat.icon}
                      className={`text-2xl md:text-3xl ${stat.iconColor}`}
                    />
                  </motion.div>
                  <div>
                    <p className="text-xs md:text-sm text-gray-400">
                      {stat.label}
                    </p>
                    <p className="text-xl md:text-3xl font-bold text-white">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Service Cards */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.2,
                },
              },
            }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12"
          >
            {/* OnRamp Card */}
            <Link to="/onramp">
              <motion.div
                variants={cardVariants}
                whileHover={{ scale: 1.02, y: -8 }}
                whileTap={{ scale: 0.98 }}
                className="bg-black/40 backdrop-blur-xl rounded-3xl border border-accent/20 p-6 md:p-8 cursor-pointer group transition-all duration-300 hover:border-accent/50 relative overflow-hidden"
                style={{
                  boxShadow: "0 0 30px rgba(255, 79, 217, 0.023)",
                }}
              >
                <motion.div className="absolute inset-0 bg-linear-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="flex items-start justify-between mb-6 relative z-10">
                  <motion.div
                    className="w-16 h-16 md:w-18 md:h-18 bg-linear-to-br from-accent/20 to-purple-600/20 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-accent/30"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    style={{
                      boxShadow: "0 0 20px rgba(255, 79, 216, 0.3)",
                    }}
                  >
                    <Icon
                      icon="mdi:bank-transfer-in"
                      className="text-3xl md:text-4xl text-accent"
                    />
                  </motion.div>
                  <motion.div
                    className="flex items-center gap-2 text-accent"
                    whileHover={{ x: 5 }}
                  >
                    <span className="text-sm font-medium">Get Started</span>
                    <Icon icon="mdi:arrow-right" className="text-lg" />
                  </motion.div>
                </div>

                <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 group-hover:text-accent transition-colors relative z-10">
                  On-Ramp Service
                </h3>
                <p className="text-gray-300 mb-6 leading-relaxed text-sm md:text-lg relative z-10">
                  Convert your fiat currency (USD, EUR) to USDC seamlessly.
                  Fast, secure, and reliable crypto purchases.
                </p>

                <div className="space-y-3 relative z-10">
                  {[
                    "Instant USDC delivery",
                    "Multiple fiat currencies",
                    "Competitive rates",
                  ].map((feature, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      className="flex items-center gap-3 text-sm text-gray-400"
                    >
                      <div className="w-6 h-6 bg-accent/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-accent/30">
                        <Icon
                          icon="mdi:check"
                          className="text-sm text-accent"
                        />
                      </div>
                      <span>{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </Link>

            {/* OffRamp Card */}
            <Link to="/offramp">
              <motion.div
                variants={cardVariants}
                whileHover={{ scale: 1.02, y: -8 }}
                whileTap={{ scale: 0.98 }}
                className="bg-black/40 backdrop-blur-xl rounded-3xl border border-purple-400/10 p-6 md:p-8 cursor-pointer group transition-all duration-300 hover:border-purple-400/30 relative overflow-hidden"
                style={{
                  boxShadow: "0 0 20px rgba(168, 85, 247, 0.05)",
                }}
              >
                <motion.div className="absolute inset-0 bg-linear-to-br from-purple-600/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="flex items-start justify-between mb-6 relative z-10">
                  <motion.div
                    className="w-16 h-16 md:w-18 md:h-18 bg-linear-to-br from-purple-600/10 to-pink-600/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-purple-400/20"
                    whileHover={{ rotate: 360, scale: 1.05 }}
                    transition={{ duration: 0.6 }}
                    style={{
                      boxShadow: "0 0 15px rgba(168, 85, 247, 0.1)",
                    }}
                  >
                    <Icon
                      icon="mdi:bank-transfer-out"
                      className="text-3xl md:text-4xl text-purple-400"
                    />
                  </motion.div>
                  <motion.div
                    className="flex items-center gap-2 text-purple-400"
                    whileHover={{ x: 5 }}
                  >
                    <span className="text-sm font-medium">Get Started</span>
                    <Icon icon="mdi:arrow-right" className="text-lg" />
                  </motion.div>
                </div>

                <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors relative z-10">
                  Off-Ramp Service
                </h3>
                <p className="text-gray-300 mb-6 leading-relaxed text-sm md:text-lg relative z-10">
                  Convert your USDC to fiat currency with ease. Withdraw
                  directly to your bank account or mobile wallet.
                </p>

                <div className="space-y-3 relative z-10">
                  {[
                    "Direct bank transfers",
                    "Mobile money support",
                    "Fast processing",
                  ].map((feature, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      className="flex items-center gap-3 text-sm text-gray-400"
                    >
                      <div className="w-6 h-6 bg-purple-500/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-purple-400/20">
                        <Icon
                          icon="mdi:check"
                          className="text-sm text-purple-400"
                        />
                      </div>
                      <span>{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </Link>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-black/40 backdrop-blur-xl rounded-3xl border border-accent/20 p-6 md:p-8 hover:border-accent/30 transition-all duration-300 relative overflow-hidden"
            style={{
              boxShadow: "0 0 30px rgba(255, 79, 216, 0.1)",
            }}
          >
            <motion.div
              className="absolute inset-0 bg-linear-to-r from-accent/5 via-transparent to-purple-600/5"
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear",
              }}
            />

            <div className="flex items-center gap-3 mb-6 relative z-10">
              <motion.div
                className="w-12 h-12 bg-linear-to-br from-accent/20 to-purple-600/20 backdrop-blur-xl rounded-xl flex items-center justify-center border border-accent/30"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
                style={{
                  boxShadow: "0 0 20px rgba(255, 79, 216, 0.3)",
                }}
              >
                <Icon
                  icon="mdi:lightning-bolt"
                  className="text-2xl text-accent"
                />
              </motion.div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Quick Actions
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
              <Link to="/transactions">
                <motion.div
                  whileHover={{ scale: 1.02, y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-black/20 hover:bg-black/30 transition-all cursor-pointer border border-accent/10 hover:border-accent/30 group"
                >
                  <motion.div
                    className="w-12 h-12 bg-accent/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-accent/30 group-hover:scale-110 transition-transform"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Icon icon="mdi:history" className="text-xl text-accent" />
                  </motion.div>
                  <div>
                    <h3 className="font-semibold text-white text-base md:text-lg">
                      View History
                    </h3>
                    <p className="text-xs md:text-sm text-gray-400">
                      Check transactions
                    </p>
                  </div>
                </motion.div>
              </Link>

              <Link to="/developers">
                <motion.div
                  whileHover={{ scale: 1.02, y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-black/30 hover:bg-black/50 transition-all cursor-pointer border border-green-400/20 hover:border-green-400/40 group"
                >
                  <motion.div
                    className="w-12 h-12 bg-green-500/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-green-400/30 group-hover:scale-110 transition-transform"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Icon
                      icon="mdi:code-braces"
                      className="text-xl text-green-400"
                    />
                  </motion.div>
                  <div>
                    <h3 className="font-semibold text-white text-base md:text-lg">
                      API Docs
                    </h3>
                    <p className="text-xs md:text-sm text-gray-400">
                      Developer resources
                    </p>
                  </div>
                </motion.div>
              </Link>

              <motion.div
                whileHover={{ scale: 1.02, y: -3 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-black/30 hover:bg-black/50 transition-all cursor-pointer border border-purple-400/20 hover:border-purple-400/40 group"
              >
                <motion.div
                  className="w-12 h-12 bg-purple-500/10 backdrop-blur-sm rounded-lg flex items-center justify-center border border-purple-400/20 group-hover:scale-105 transition-transform"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <Icon
                    icon="mdi:help-circle"
                    className="text-xl text-purple-400"
                  />
                </motion.div>
                <div>
                  <h3 className="font-semibold text-white text-base md:text-lg">
                    Support
                  </h3>
                  <p className="text-xs md:text-sm text-gray-400">
                    Get help & support
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
