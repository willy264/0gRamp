const express = require('express')
const router = express.Router()
const controller = require('../controllers/webhook')

router.post('/payment', controller.paymentCallback)

module.exports = router