const express = require('express')
const router = express.Router()
const controller = require('../controllers/onramp')

router.post('/create-session', controller.createSession)

module.exports = router