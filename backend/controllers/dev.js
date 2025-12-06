const crypto = require('crypto')
const { prisma } = require('../db')

exports.getApiKey = async (req, res, next) => {
  try {
    const wallet = (req.params.wallet || '').toLowerCase()
    if (!wallet) return res.status(400).json({ error: 'wallet required' })
    const user = await prisma.user.findUnique({ where: { wallet } })
    return res.json({ apiKey: user?.apiKey || null })
  } catch (err) {
    next(err)
  }
}

exports.generateApiKey = async (req, res, next) => {
  try {
    const wallet = (req.body.wallet || '').toLowerCase()
    if (!wallet) return res.status(400).json({ error: 'wallet required' })

    const apiKey = crypto.randomBytes(32).toString('hex')

    const user = await prisma.user.upsert({
      where: { wallet },
      update: { apiKey },
      create: { wallet, apiKey }
    })

    return res.json({ apiKey: user.apiKey })
  } catch (err) {
    next(err)
  }
}