import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'
import Layout from '../components/Layout'
import { getApiKey, generateApiKey } from '../lib/api'
import { useAccount } from 'wagmi'

export default function Developers() {
  const { address } = useAccount()
  const [apiKey, setApiKey] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState<string>('')

  useEffect(() => {
    if (address) {
      fetchApiKey()
    }
  }, [address])

  const fetchApiKey = async () => {
    try {
      const key = await getApiKey(address!)
      setApiKey(key.apiKey || '')
    } catch (error) {
      console.error('Failed to fetch API key:', error)
    }
  }

  const handleGenerateKey = async () => {
    setLoading(true)
    try {
      const newKey = await generateApiKey(address!)
      setApiKey(newKey.apiKey)
    } catch (error) {
      console.error('Failed to generate API key:', error)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(''), 2000)
  }

  const codeExamples = useMemo(() => ({
    node: `const axios = require('axios');

const response = await axios.post('https://api.0g-ramp.com/onramp', {
  amount: 100,
  currency: 'USD',
  walletAddress: '0x...'
}, {
  headers: {
    'Authorization': 'Bearer ${apiKey}',
    'Content-Type': 'application/json'
  }
});

console.log(response.data);`,
    python: `import requests

response = requests.post('https://api.0g-ramp.com/onramp', 
  json={
    'amount': 100,
    'currency': 'USD',
    'walletAddress': '0x...'
  },
  headers={
    'Authorization': f'Bearer ${apiKey}',
    'Content-Type': 'application/json'
  }
)

print(response.json())`,
    curl: `curl -X POST https://api.0g-ramp.com/onramp \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 100,
    "currency": "USD",
    "walletAddress": "0x..."
  }'`
  }), [apiKey])

  const features = [
    {
      icon: 'mdi:api',
      title: 'RESTful API',
      description: 'Simple and intuitive REST endpoints',
      color: 'from-accent to-purple-600'
    },
    {
      icon: 'mdi:shield-check',
      title: 'Secure Auth',
      description: 'API key-based authentication',
      color: 'from-green-400 to-emerald-600'
    },
    {
      icon: 'mdi:lightning-bolt',
      title: 'Real-time',
      description: 'WebSocket live updates',
      color: 'from-orange-400 to-red-600'
    },
    {
      icon: 'mdi:code-json',
      title: 'JSON Format',
      description: 'Consistent API responses',
      color: 'from-blue-400 to-cyan-600'
    }
  ]

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
              <Icon icon="mdi:code-braces" className="text-4xl md:text-5xl text-accent relative z-10" />
            </motion.div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 md:mb-4">
              Developer API
            </h1>
            <p className="text-base md:text-xl text-gray-300 max-w-2xl mx-auto px-4">
              Integrate 0G-Ramp into your applications with our powerful API
            </p>
          </motion.div>

          {/* Features Grid */}
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
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-8 md:mb-12"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
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
                  className={`absolute inset-0 bg-linear-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity`}
                />
                <div className="relative z-10">
                  <motion.div 
                    className={`w-12 h-12 md:w-14 md:h-14 bg-linear-to-br ${feature.color} rounded-xl flex items-center justify-center border border-accent/30 mb-3 md:mb-4`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Icon icon={feature.icon} className="text-2xl md:text-3xl text-white" />
                  </motion.div>
                  <h3 className="text-base md:text-lg font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-xs md:text-sm text-gray-400">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* API Key Management */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-3xl mx-auto mb-8 md:mb-12"
          >
            <div className="bg-black/40 backdrop-blur-xl rounded-3xl border border-accent/20 p-6 md:p-8 hover:border-accent/30 transition-all duration-300 relative overflow-hidden"
              style={{
                boxShadow: '0 0 30px rgba(255, 79, 216, 0.1)'
              }}
            >
              <motion.div
                className="absolute inset-0 bg-linear-to-r from-accent/5 via-transparent to-purple-600/5"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              />
              
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <motion.div 
                  className="w-12 h-12 bg-linear-to-br from-accent/20 to-purple-600/20 backdrop-blur-xl rounded-xl flex items-center justify-center border border-accent/30"
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  style={{
                    boxShadow: '0 0 20px rgba(255, 79, 216, 0.3)'
                  }}
                >
                  <Icon icon="mdi:key" className="text-2xl text-accent" />
                </motion.div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  API Key Management
                </h2>
              </div>

              <div className="space-y-4 relative z-10">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Your API Key
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <input
                        title='api'
                        type="text"
                        value={apiKey || 'No API key generated'}
                        readOnly
                        className="w-full px-4 py-3 bg-black/50 border border-accent/20 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-accent/40 transition-colors"
                      />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => copyToClipboard(apiKey, 'apikey')}
                      className="px-4 py-3 bg-accent/20 backdrop-blur-xl text-accent rounded-xl hover:bg-accent/30 transition-all duration-200 flex items-center gap-2 border border-accent/30"
                    >
                      <Icon icon={copied === 'apikey' ? 'mdi:check' : 'mdi:content-copy'} className="text-lg" />
                    </motion.button>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGenerateKey}
                  disabled={loading || !address}
                  className="w-full py-3 bg-linear-to-r from-accent to-purple-600 text-white rounded-xl hover:from-accent/90 hover:to-purple-600/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm font-semibold border border-accent/30"
                  style={{
                    boxShadow: '0 0 20px rgba(255, 79, 216, 0.3)'
                  }}
                >
                  {loading ? (
                    <>
                      <Icon icon="mdi:loading" className="text-lg animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Icon icon="mdi:refresh" className="text-lg" />
                      {apiKey ? 'Regenerate API Key' : 'Generate API Key'}
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Code Examples */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">Code Examples</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
              {Object.entries(codeExamples).map(([lang, code], index) => (
                <motion.div
                  key={lang}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-black/40 backdrop-blur-xl rounded-2xl border border-accent/20 overflow-hidden hover:border-accent/40 transition-all duration-300"
                  style={{
                    boxShadow: '0 0 20px rgba(255, 79, 216, 0.1)'
                  }}
                >
                  <div className="flex items-center justify-between p-4 border-b border-accent/20 bg-black/30">
                    <div className="flex items-center gap-2">
                      <Icon 
                        icon={lang === 'node' ? 'mdi:nodejs' : lang === 'python' ? 'mdi:language-python' : 'mdi:console'} 
                        className="text-lg text-accent" 
                      />
                      <span className="text-white font-medium text-sm capitalize">{lang === 'node' ? 'Node.js' : lang}</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => copyToClipboard(code, lang)}
                      className="p-2 text-accent hover:bg-accent/10 transition-colors rounded-lg border border-accent/20"
                    >
                      <Icon icon={copied === lang ? 'mdi:check' : 'mdi:content-copy'} className="text-sm" />
                    </motion.button>
                  </div>
                  <pre className="p-4 text-xs text-gray-300 overflow-x-auto max-h-64 bg-black/20">
                    <code>{code}</code>
                  </pre>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  )
}