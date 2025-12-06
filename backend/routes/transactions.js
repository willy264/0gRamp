const express = require('express')
const router = express.Router()
const controller = require('../controllers/transactions')

router.get('/by-wallet/:wallet', controller.byWallet)

module.exports = router