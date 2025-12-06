const prisma = require('../db')

exports.requestPayout = async (req, res, next) => {
  try {
    const { walletAddress, amount, payoutMethod } = req.body || {}
    if (!walletAddress || !amount || !payoutMethod) {
      return res.status(400).json({ error: 'walletAddress, amount, payoutMethod required' })
    }
    const wallet = walletAddress.toLowerCase()
    let user = await prisma.user.findUnique({ where: { wallet } })
    if (!user) {
      user = await prisma.user.create({ data: { wallet } })
    }
    const memo = `OFF-${Date.now()}`
    const session = await prisma.session.create({
      data: {
        userId: user.id,
        type: 'offramp',
        fiatAmount: Number(amount),
        token: memo,
        status: 'pending',
      },
    })
    res.json({ sessionId: session.id, depositRef: memo })
  } catch (err) {
    next(err)
  }
}