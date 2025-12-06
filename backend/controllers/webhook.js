const prisma = require('../db')
const paymentService = require('../services/paymentService')
const walletService = require('../services/walletService')
const storageService = require('../services/ogStorageService')

exports.paymentCallback = async (req, res, next) => {
  try {
    const signature = req.headers['x-provider-signature']
    const { sessionId, status } = req.body || {}
    const ok = paymentService.verifySignature(req.body, signature)
    if (!ok) return res.status(401).json({ error: 'invalid signature' })

    const session = await prisma.session.findUnique({ where: { id: Number(sessionId) }, include: { user: true } })
    if (!session) return res.status(404).json({ error: 'session not found' })

    if (status === 'success') {
      // Simulate stablecoin transfer and receipt logging
      const amountUSDC = session.fiatAmount // 1:1 demo
      const txHash = await walletService.transferStablecoin(session.user.wallet, amountUSDC)
      const receipt = { sessionId, wallet: session.user.wallet, amountUSDC, txHash, ts: Date.now() }
      const storageCid = await storageService.storeReceipt(receipt)
      await prisma.transaction.create({
        data: {
          sessionId: session.id,
          txHash,
          storageCid,
          amount: amountUSDC,
          status: 'success',
          type: session.type,
          wallet: session.user.wallet,
        },
      })
      await prisma.session.update({ where: { id: session.id }, data: { status: 'completed' } })
    } else {
      await prisma.session.update({ where: { id: session.id }, data: { status: 'failed' } })
    }

    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
}