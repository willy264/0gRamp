const router = require('express').Router()
const { submit } = require('../controllers/kyc')

router.post('/submit', submit)

module.exports = router