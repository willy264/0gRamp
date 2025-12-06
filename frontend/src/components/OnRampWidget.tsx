import { useState } from 'react'
import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'
import { useAccount } from 'wagmi'
import { createOnrampSession, simulateWebhook } from '../lib/api'

export default function OnRampWidget() {
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
      const res = await createOnrampSession({ walletAddress: address, fiatAmount: Number(fiatAmount), currency })
      setSessionId(res.sessionId)
      setPaymentUrl(res.paymentUrl)
      setMessage('Payment session created. Complete payment at the provider URL.')
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
      setMessage('Payment confirmed. USDC transfer simulated and receipt stored.')
    } catch (e: any) {
      setMessage(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ duration: 0.3 }}
      className="relative group"
    >
      {/* Glow Effect */}
      <div className="absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-black/40" />
      
      <div className="relative rounded-2xl border border-base-600/50 bg-base-800/50 backdrop-blur-md p-6 hover:border-white/30 transition-all duration-300">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-black/50 border border-white/20 flex items-center justify-center">
                <Icon icon="mdi:bank-transfer-in" className="text-2xl text-white" />
              </div>
              <div className="absolute inset-0 rounded-xl bg-black/30 blur-md" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">On-Ramp</h2>
              <p className="text-sm text-gray-400">Convert fiat to crypto</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <div className="w-2 h-2 bg-white/40 rounded-full animate-pulse" />
            <span>Live</span>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Amount</label>
              <div className="relative">
                <input 
                  className="w-full rounded-xl bg-base-900/50 border border-base-600/50 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all duration-300" 
                  type="number" 
                  min={1} 
                  value={fiatAmount} 
                  onChange={(e) => setFiatAmount(e.target.value)} 
                  placeholder="Enter amount" 
                />
                <div className="absolute inset-0 rounded-xl bg-black/10 pointer-events-none opacity-0 focus-within:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Currency</label>
              <div className="relative">
                <select 
                  className="w-full rounded-xl bg-base-900/50 border border-base-600/50 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all duration-300 appearance-none cursor-pointer" 
                  value={currency} 
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  <option value="USD">🇺🇸 USD</option>
                  <option value="EUR">🇪🇺 EUR</option>
                </select>
                <Icon icon="mdi:chevron-down" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-black/50 border border-white/20 px-4 py-3 text-white font-semibold hover:bg-black/60 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
            onClick={startOnramp} 
            disabled={loading || !address}
          >
            {loading ? (
              <>
                <Icon icon="mdi:loading" className="mr-2 animate-spin" />
                Creating Session...
              </>
            ) : !address ? (
              <>
                <Icon icon="mdi:wallet-outline" className="mr-2" />
                Connect Wallet First
              </>
            ) : (
              <>
                <Icon icon="mdi:plus-circle" className="mr-2" />
                Create Payment Session
              </>
            )}
          </motion.button>
        </div>

        {/* Payment URL */}
        {paymentUrl && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 p-4 rounded-xl bg-base-900/30 border border-base-600/30"
          >
            <div className="flex items-center gap-2 mb-2">
              <Icon icon="mdi:link" className="text-white" />
              <span className="text-sm font-medium text-white">Payment URL Ready</span>
            </div>
            <div className="flex items-center gap-2">
              <a 
                className="text-white hover:text-gray-300 underline text-sm break-all flex-1" 
                href={paymentUrl} 
                target="_blank" 
                rel="noreferrer"
              >
                {paymentUrl}
              </a>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigator.clipboard.writeText(paymentUrl)}
                className="p-2 rounded-lg bg-base-800/50 hover:bg-base-700/50 text-gray-400 hover:text-white transition-colors"
              >
                <Icon icon="mdi:content-copy" />
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Simulate Success Button */}
        {sessionId && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4"
          >
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-black/50 border border-white/20 px-4 py-3 text-white font-medium hover:bg-black/60 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
              onClick={completePayment} 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Icon icon="mdi:loading" className="mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Icon icon="mdi:check-circle-outline" className="mr-2" />
                  Simulate Provider Success
                </>
              )}
            </motion.button>
          </motion.div>
        )}

        {/* Status Message */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 rounded-xl border text-sm bg-black/50 border-white/20 text-white"
          >
            <div className="flex items-center gap-2">
              <Icon 
                icon={
                  message.includes('confirmed') || message.includes('created')
                    ? "mdi:check-circle"
                    : message.includes('Error') || message.includes('Connect')
                    ? "mdi:alert-circle"
                    : "mdi:information"
                } 
                className="text-white"
              />
              <span>{message}</span>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}