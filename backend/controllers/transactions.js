const prisma = require('../db')

exports.byWallet = async (req, res, next) => {
  try {
    const wallet = String(req.params.wallet || '').toLowerCase()
    if (!wallet) return res.status(400).json({ error: 'wallet required' })
    const rows = await prisma.transaction.findMany({ where: { wallet }, orderBy: { createdAt: 'desc' } })
    res.json(rows)
  } catch (err) {
    next(err)
  }
}