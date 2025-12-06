const { storeKycHash } = require('../services/ogStorageService')

exports.submit = async (req, res, next) => {
  try {
    const wallet = (req.body.walletAddress || '').toLowerCase()
    const cid = req.body.cid
    const meta = {
      mime: req.body.mime,
      size: req.body.size
    }
    if (!wallet || !cid) return res.status(400).json({ error: 'walletAddress and cid required' })

    const storedCid = await storeKycHash({ wallet, cid, meta })
    return res.json({ cid: storedCid })
  } catch (err) {
    next(err)
  }
}