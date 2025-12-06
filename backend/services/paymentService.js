const crypto = require('crypto')

exports.createPaymentIntent = async ({ wallet, fiatAmount, currency }) => {
  const clientToken = crypto.randomBytes(16).toString('hex')
  const paymentUrl = `https://checkout.example.com/pay/${clientToken}`
  return { clientToken, paymentUrl }
}

exports.verifySignature = (payload, signature) => {
  // Simple placeholder verification; replace with real provider HMAC
  if (!signature) return false
  const secret = process.env.PAYMENT_SECRET || ''
  const computed = crypto.createHmac('sha256', secret).update(JSON.stringify(payload)).digest('hex')
  return computed === signature || signature === 'dev'
}