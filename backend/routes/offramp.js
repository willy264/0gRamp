const express = require('express')
const router = express.Router()
const controller = require('../controllers/offramp')

router.post('/request', controller.requestPayout)

module.exports = router