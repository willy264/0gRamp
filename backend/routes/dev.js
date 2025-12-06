const router = require('express').Router()
const { getApiKey, generateApiKey } = require('../controllers/dev')

router.get('/apikey/:wallet', getApiKey)
router.post('/apikey', generateApiKey)

module.exports = router