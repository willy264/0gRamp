import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'
import Layout from '../components/Layout'
import { getTransactionsByWallet, type TxRow } from '../lib/api'
import { useAccount } from 'wagmi'

export default function Transactions() {
  const { address } = useAccount()
  const [rows, setRows] = useState<TxRow[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      if (!address) return
      setLoading(true)
      setError(null)
      try {
        const data = await getTransactionsByWallet(address)
        setRows(data)
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [address])

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'text-green-400 bg-green-400/10 border-green-400/30'
      case 'pending': return 'text-yellow-300 bg-yellow-300/10 border-yellow-300/30'
      case 'failed': return 'text-red-500 bg-red-500/10 border-red-500/30'
      default: return 'text-white bg-white/10 border-white/30'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'onramp': return 'mdi:arrow-down-circle'
      case 'offramp': return 'mdi:arrow-up-circle'
      default: return 'mdi:swap-horizontal'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'onramp': return 'text-green-400 bg-green-400/10'
      case 'offramp': return 'text-purple-400 bg-purple-400/10'
      default: return 'text-accent bg-accent/10'
    }
  }

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
                boxShadow: '0 0 40px rgba(255, 79, 216, 0.3)'
              }}
            >
              <motion.div
                className="absolute inset-0 bg-linear-to-r from-accent/20 to-transparent"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
              <Icon icon="mdi:history" className="text-4xl md:text-5xl text-accent relative z-10" />
            </motion.div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 md:mb-4">
              Transaction History
            </h1>
            <p className="text-base md:text-xl text-gray-300 max-w-2xl mx-auto px-4">
              Track all your on-ramp and off-ramp transactions in one place
            </p>
          </motion.div>

          {/* Transaction Stats */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-8 md:mb-12"
          >
            {[
              { icon: "mdi:check-circle", label: "Completed", value: rows.filter(r => r.status === 'completed').length, color: "from-green-400 to-emerald-600" },
              { icon: "mdi:clock-outline", label: "Pending", value: rows.filter(r => r.status === 'pending').length, color: "from-yellow-300 to-yellow-500" },
              { icon: "mdi:close-circle", label: "Failed", value: rows.filter(r => r.status === 'failed').length, color: "from-red-500 to-red-600" },
              { icon: "mdi:chart-line", label: "Total", value: rows.length, color: "from-accent to-purple-600" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 20, scale: 0.95 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: {
                      delay: index * 0.1,
                      duration: 0.5
                    }
                  }
                }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-black/40 backdrop-blur-xl rounded-2xl border border-accent/20 p-4 md:p-6 hover:border-accent/40 transition-all duration-300 relative overflow-hidden group"
                style={{
                  boxShadow: '0 0 20px rgba(255, 79, 216, 0.1)'
                }}
              >
                <motion.div
                  className={`absolute inset-0 bg-linear-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity`}
                />
                <div className="relative z-10">
                  <motion.div 
                    className={`w-12 h-12 md:w-14 md:h-14 bg-linear-to-br ${stat.color} rounded-xl flex items-center justify-center border border-accent/30 mb-3 md:mb-4`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Icon icon={stat.icon} className="text-2xl md:text-3xl text-white" />
                  </motion.div>
                  <h3 className="text-xl md:text-3xl font-bold text-white mb-1">{stat.value}</h3>
                  <p className="text-xs md:text-sm text-gray-400">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Transactions Table */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-black/40 backdrop-blur-xl rounded-3xl border border-accent/20 p-6 md:p-8 hover:border-accent/30 transition-all duration-300"
            style={{
              boxShadow: '0 0 30px rgba(255, 79, 216, 0.1)'
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <motion.div 
                  className="w-12 h-12 bg-linear-to-br from-accent/20 to-purple-600/20 backdrop-blur-xl rounded-xl flex items-center justify-center border border-accent/30"
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <Icon icon="mdi:history" className="text-2xl text-accent" />
                </motion.div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">Recent Transactions</h2>
              </div>
              {address && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center px-4 py-2 rounded-xl bg-accent/20 hover:bg-accent/30 text-accent border border-accent/30 transition-all duration-300"
                >
                  <Icon icon="mdi:refresh" className="mr-2" />
                  <span className="hidden md:inline">Refresh</span>
                </motion.button>
              )}
            </div>

            {!address && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="inline-flex items-center justify-center w-20 h-20 bg-accent/10 rounded-2xl mb-4 border border-accent/30"
                >
                  <Icon icon="mdi:wallet-outline" className="text-5xl text-accent" />
                </motion.div>
                <p className="text-lg text-gray-300 mb-2">Connect your wallet to view transaction history</p>
                <p className="text-sm text-gray-500">Your transactions will appear here once you connect</p>
              </motion.div>
            )}

            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/20 border border-accent/30 mb-4"
                >
                  <Icon icon="mdi:loading" className="text-3xl text-accent" />
                </motion.div>
                <p className="text-lg text-gray-300">Loading transactions...</p>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/20 rounded-2xl mb-4 border border-red-500/30">
                  <Icon icon="mdi:alert-circle" className="text-4xl text-red-500" />
                </div>
                <p className="text-lg text-white mb-2">Error loading transactions</p>
                <p className="text-sm text-gray-400">{error}</p>
              </motion.div>
            )}

            {address && !loading && !error && rows.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-500/20 rounded-2xl mb-4 border border-gray-500/30">
                  <Icon icon="mdi:database-outline" className="text-4xl text-gray-500" />
                </div>
                <p className="text-lg text-gray-300 mb-2">No transactions found</p>
                <p className="text-sm text-gray-500">Your transaction history will appear here</p>
              </motion.div>
            )}

            {rows.length > 0 && (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-accent/20">
                      <th className="text-left py-4 px-4 text-gray-400 font-semibold text-sm">Date</th>
                      <th className="text-left py-4 px-4 text-gray-400 font-semibold text-sm">Type</th>
                      <th className="text-left py-4 px-4 text-gray-400 font-semibold text-sm">Amount</th>
                      <th className="text-left py-4 px-4 text-gray-400 font-semibold text-sm">Transaction</th>
                      <th className="text-left py-4 px-4 text-gray-400 font-semibold text-sm">Storage</th>
                      <th className="text-left py-4 px-4 text-gray-400 font-semibold text-sm">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r, index) => (
                      <motion.tr
                        key={r.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        whileHover={{ backgroundColor: 'rgba(255, 79, 216, 0.05)' }}
                        className="border-b border-accent/10 transition-colors duration-200"
                      >
                        <td className="py-4 px-4">
                          <div className="text-gray-300 text-sm">
                            {new Date(r.createdAt).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(r.createdAt).toLocaleTimeString()}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg ${getTypeColor(r.type)}`}>
                            <Icon icon={getTypeIcon(r.type)} className="text-sm" />
                            <span className="capitalize font-medium text-sm">{r.type}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-white font-semibold text-sm">{r.amount}</span>
                        </td>
                        <td className="py-4 px-4">
                          {r.txHash ? (
                            <a 
                              className="inline-flex items-center text-accent hover:text-accent/80 transition-colors text-sm" 
                              href={`https://blockexplorer/tx/${r.txHash}`} 
                              target="_blank" 
                              rel="noreferrer"
                            >
                              {r.txHash.slice(0, 10)}…
                              <Icon icon="mdi:external-link" className="ml-1 text-xs" />
                            </a>
                          ) : (
                            <span className="text-gray-500 text-sm">-</span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          {r.storageCid ? (
                            <span className="text-white font-mono text-xs bg-black/30 px-2 py-1 rounded border border-accent/20">
                              {r.storageCid.slice(0, 10)}…
                            </span>
                          ) : (
                            <span className="text-gray-500 text-sm">-</span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(r.status)}`}>
                            {r.status}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </Layout>
  )
}