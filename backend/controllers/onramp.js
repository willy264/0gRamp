const prisma = require('../db')
const paymentService = require('../services/paymentService')

exports.createSession = async (req, res, next) => {
  try {
    const { walletAddress, fiatAmount, currency } = req.body || {}
    if (!walletAddress || !fiatAmount || !currency) {
      return res.status(400).json({ error: 'walletAddress, fiatAmount, currency required' })
    }

    const wallet = walletAddress.toLowerCase()
    let user = await prisma.user.findUnique({ where: { wallet } })
    if (!user) {
      user = await prisma.user.create({ data: { wallet } })
    }

    const intent = await paymentService.createPaymentIntent({ wallet, fiatAmount, currency })

    const session = await prisma.session.create({
      data: {
        userId: user.id,
        type: 'onramp',
        fiatAmount: Number(fiatAmount),
        token: intent.clientToken,
        status: 'pending',
      },
    })

    return res.json({ sessionId: session.id, clientToken: intent.clientToken, paymentUrl: intent.paymentUrl })
  } catch (err) {
    next(err)
  }
}