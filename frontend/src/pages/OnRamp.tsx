import { useState } from 'react'
import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'
import { useAccount } from 'wagmi'
import Layout from '../components/Layout'
import { createOnrampSession, simulateWebhook } from '../lib/api'

export default function OnRamp() {
  const { address } = useAccount()
  const [fiatAmount, setFiatAmount] = useState('100')
  const [currency, setCurrency] = useState('USD')
  const [sessionId, setSessionId] = useState<number | null>(null)
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const startOnramp = async () => {
    if (!address) return setMessage('Connect wallet first.')
    setLoading(true)
    setMessage(null)
    try {
      const res = await createOnrampSession({ 
        walletAddress: address, 
        fiatAmount: Number(fiatAmount), 
        currency 
      })
      setSessionId(res.sessionId)
      setPaymentUrl(res.paymentUrl)
      setMessage('Payment session created successfully.')
    } catch (e: any) {
      setMessage(e.message)
    } finally {
      setLoading(false)
    }
  }

  const completePayment = async () => {
    if (!sessionId) return
    setLoading(true)
    try {
      await simulateWebhook(sessionId, 'success')
      setMessage('Payment confirmed. USDC transfer completed.')
    } catch (e: any) {
      setMessage(e.message)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setSessionId(null)
    setPaymentUrl(null)
    setMessage(null)
    setFiatAmount('100')
    setCurrency('USD')
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
              className="inline-flex items-center justify-center w-20 md:w-24 h-20 md:h-24 bg-linear-to-br from-green-400/20 to-emerald-600/20 backdrop-blur-xl rounded-3xl mb-4 md:mb-6 relative overflow-hidden border border-green-400/30"
              whileHover={{ scale: 1.05, rotate: 5 }}
              style={{
                boxShadow: '0 0 40px rgba(52, 211, 153, 0.3)'
              }}
            >
              <motion.div
                className="absolute inset-0 bg-linear-to-r from-green-400/20 to-transparent"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
              <Icon icon="mdi:bank-transfer-in" className="text-4xl md:text-5xl text-green-400 relative z-10" />
            </motion.div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 md:mb-4">
              On-Ramp Service
            </h1>
            <p className="text-base md:text-xl text-gray-300 max-w-2xl mx-auto px-4">
              Convert your fiat currency to USDC seamlessly. Fast, secure, and transparent transactions.
            </p>
          </motion.div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Transaction Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2"
            >
              <div className="bg-black/40 backdrop-blur-xl rounded-3xl border border-accent/20 p-6 md:p-8 hover:border-accent/30 transition-all duration-300"
                style={{
                  boxShadow: '0 0 30px rgba(255, 79, 216, 0.1)'
                }}
              >
                <div className="flex items-center gap-3 mb-8">
                  <motion.div 
                    className="w-12 h-12 bg-linear-to-br from-green-400/20 to-emerald-600/20 backdrop-blur-xl rounded-xl flex items-center justify-center border border-green-400/30"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Icon icon="mdi:currency-usd" className="text-2xl text-green-400" />
                  </motion.div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">
                    Purchase USDC
                  </h2>
                </div>

                <div className="space-y-6">
                  {/* Amount Input */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Amount to Purchase
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        value={fiatAmount}
                        onChange={(e) => setFiatAmount(e.target.value)}
                        className="w-full px-4 py-3 bg-black/50 border border-accent/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-accent/40 transition-colors"
                        placeholder="Enter amount"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                        <span className="text-gray-400 text-sm font-medium">
                          {currency}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Currency Selection */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Currency
                    </label>
                    <select
                      title='currency'
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full px-4 py-3 bg-black/50 border border-accent/20 rounded-xl text-white focus:outline-none focus:border-accent/40 transition-colors"
                    >
                      <option value="USD">🇺🇸 US Dollar (USD)</option>
                      <option value="EUR">🇪🇺 Euro (EUR)</option>
                      <option value="GBP">🇬🇧 British Pound (GBP)</option>
                    </select>
                  </div>

                  {/* Conversion Preview */}
                  <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-accent/10">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-400">You pay:</span>
                      <span className="font-medium text-white">
                        {fiatAmount} {currency}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-400">You receive:</span>
                      <span className="font-medium text-white">
                        ≈ {fiatAmount} USDC
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs pt-2 border-t border-accent/10">
                      <span className="text-gray-500">Exchange rate:</span>
                      <span className="text-gray-500">1 {currency} = 1 USDC</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={startOnramp}
                    disabled={loading || !address}
                    className="w-full py-4 bg-linear-to-r from-accent to-purple-600 text-white font-semibold rounded-xl hover:from-accent/90 hover:to-purple-600/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 border border-accent/30"
                    style={{
                      boxShadow: '0 0 20px rgba(255, 79, 216, 0.3)'
                    }}
                  >
                    {loading ? (
                      <>
                        <Icon icon="mdi:loading" className="animate-spin" />
                        Creating Session...
                      </>
                    ) : !address ? (
                      <>
                        <Icon icon="mdi:wallet-outline" />
                        Connect Wallet First
                      </>
                    ) : (
                      <>
                        <Icon icon="mdi:credit-card" />
                        Create Payment Session
                      </>
                    )}
                  </motion.button>

                  {/* Reset Button */}
                  {(sessionId || message) && (
                    <motion.button
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      onClick={resetForm}
                      className="w-full bg-black/30 backdrop-blur-sm hover:bg-black/40 border border-accent/20 text-gray-300 hover:text-white font-medium py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      <Icon icon="mdi:refresh" />
                      Start New Transaction
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Status Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              {/* Connection Status */}
              <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-accent/20 p-6"
                style={{
                  boxShadow: '0 0 20px rgba(255, 79, 216, 0.1)'
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <motion.div 
                    className="w-10 h-10 bg-linear-to-br from-blue-400/20 to-cyan-600/20 backdrop-blur-xl rounded-lg flex items-center justify-center border border-blue-400/30"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Icon icon="mdi:wallet" className="text-lg text-blue-400" />
                  </motion.div>
                  <h3 className="text-lg font-semibold text-white">
                    Wallet Status
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Connection:</span>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${address ? 'bg-green-400' : 'bg-gray-500'}`} />
                      <span className="text-sm font-medium text-white">
                        {address ? 'Connected' : 'Disconnected'}
                      </span>
                    </div>
                  </div>
                  {address && (
                    <div className="text-xs text-gray-400 font-mono break-all bg-black/30 p-2 rounded-lg">
                      {address}
                    </div>
                  )}
                </div>
              </div>

              {/* Payment URL */}
              {paymentUrl && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-black/40 backdrop-blur-xl rounded-2xl border border-green-400/30 p-6"
                  style={{
                    boxShadow: '0 0 20px rgba(52, 211, 153, 0.2)'
                  }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <motion.div 
                      className="w-10 h-10 bg-linear-to-br from-green-400/20 to-emerald-600/20 backdrop-blur-xl rounded-lg flex items-center justify-center border border-green-400/30"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Icon icon="mdi:link" className="text-lg text-green-400" />
                    </motion.div>
                    <h3 className="text-lg font-semibold text-white">
                      Payment Ready
                    </h3>
                  </div>
                  <p className="text-sm text-gray-400 mb-4">
                    Complete your payment using the secure payment link:
                  </p>
                  <div className="space-y-3">
                    <a
                      href={paymentUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 text-sm font-medium transition-colors"
                    >
                      <Icon icon="mdi:open-in-new" />
                      Open Payment Page
                    </a>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={completePayment}
                      disabled={loading}
                      className="w-full py-3 bg-linear-to-r from-green-400 to-emerald-600 text-white font-medium rounded-xl hover:from-green-400/90 hover:to-emerald-600/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 border border-green-400/30"
                      style={{
                        boxShadow: '0 0 15px rgba(52, 211, 153, 0.3)'
                      }}
                    >
                      {loading ? (
                        <>
                          <Icon icon="mdi:loading" className="animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Icon icon="mdi:check-circle" />
                          Simulate Success
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Status Message */}
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-2xl border p-6 ${
                    message.includes('confirmed') || message.includes('created')
                      ? 'bg-green-400/10 border-green-400/30'
                      : message.includes('Error') || message.includes('Connect')
                      ? 'bg-red-500/10 border-red-500/30'
                      : 'bg-blue-400/10 border-blue-400/30'
                  }`}
                  style={{
                    boxShadow: message.includes('confirmed') || message.includes('created')
                      ? '0 0 20px rgba(52, 211, 153, 0.2)'
                      : message.includes('Error') || message.includes('Connect')
                      ? '0 0 20px rgba(239, 68, 68, 0.2)'
                      : '0 0 20px rgba(96, 165, 250, 0.2)'
                  }}
                >
                  <div className="flex items-start gap-3">
                    <Icon
                      icon={
                        message.includes('confirmed') || message.includes('created')
                          ? "mdi:check-circle"
                          : message.includes('Error') || message.includes('Connect')
                          ? "mdi:alert-circle"
                          : "mdi:information"
                      }
                      className={`text-xl mt-0.5 ${
                        message.includes('confirmed') || message.includes('created')
                          ? 'text-green-400'
                          : message.includes('Error') || message.includes('Connect')
                          ? 'text-red-500'
                          : 'text-blue-400'
                      }`}
                    />
                    <div>
                      <h4 className={`font-medium mb-1 ${
                        message.includes('confirmed') || message.includes('created')
                          ? 'text-green-300'
                          : message.includes('Error') || message.includes('Connect')
                          ? 'text-red-400'
                          : 'text-blue-300'
                      }`}>
                        {message.includes('confirmed') ? 'Success' : 
                        message.includes('created') ? 'Session Created' :
                        message.includes('Error') || message.includes('Connect') ? 'Action Required' : 'Information'}
                      </h4>
                      <p className={`text-sm ${
                        message.includes('confirmed') || message.includes('created')
                          ? 'text-green-400/80'
                          : message.includes('Error') || message.includes('Connect')
                          ? 'text-red-400/80'
                          : 'text-blue-400/80'
                      }`}>
                        {message}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Information Panel */}
              <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-accent/20 p-6"
                style={{
                  boxShadow: '0 0 20px rgba(255, 79, 216, 0.1)'
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <motion.div 
                    className="w-10 h-10 bg-linear-to-br from-accent/20 to-purple-600/20 backdrop-blur-xl rounded-lg flex items-center justify-center border border-accent/30"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Icon icon="mdi:information" className="text-lg text-accent" />
                  </motion.div>
                  <h3 className="text-lg font-semibold text-white">
                    How it Works
                  </h3>
                </div>
                <div className="space-y-3 text-sm text-gray-400">
                  {[
                    'Enter the amount you want to convert to USDC',
                    'Create a secure payment session',
                    'Complete payment through our secure provider',
                    'Receive USDC directly in your connected wallet'
                  ].map((step, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-6 h-6 bg-green-400/20 backdrop-blur-sm rounded-full flex items-center justify-center shrink-0 mt-0.5 border border-green-400/30">
                        <span className="text-xs font-bold text-green-400">{i + 1}</span>
                      </div>
                      <p>{step}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  )
}