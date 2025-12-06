const axios = require('axios')

function getEnv(name) {
  return process.env[name]
}

async function uploadTo0GStorage(payload) {
  const baseUrl = getEnv('OG_STORAGE_URL')
  const apiKey = getEnv('OG_STORAGE_API_KEY')
  if (!baseUrl || !apiKey) return null

  try {
    const res = await axios.post(baseUrl.replace(/\/$/, '') + '/upload', payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      timeout: 20000
    })
    const data = res.data || {}
    return data.cid || data.hash || null
  } catch (err) {
    console.error('0G Storage upload failed:', err.response?.data || err.message)
    throw new Error('0G storage upload failed')
  }
}

// Legacy fallback mock for local/dev when 0G config is absent
function fallbackCidFromJson(json) {
  const base = Buffer.from(JSON.stringify(json)).toString('base64').slice(0, 32)
  return `cid_${base}`
}

exports.storeReceipt = async (json) => {
  const cid = await uploadTo0GStorage({ kind: 'receipt', data: json })
  if (cid) return cid
  console.warn('OG_STORAGE_URL/OG_STORAGE_API_KEY not set; using mock CID fallback')
  return fallbackCidFromJson(json)
}

exports.storeKycHash = async ({ wallet, cid, meta }) => {
  const payload = { kind: 'kyc', wallet, cid, meta: meta || {}, ts: Date.now() }
  const stored = await uploadTo0GStorage(payload)
  if (stored) return stored
  console.warn('OG storage not configured; returning the provided CID as-is')
  return cid
}