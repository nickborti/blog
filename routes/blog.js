const express = require('express')
const { create } = require('../controllers/blog')
const router = express.Router()
const {requireSignin, adminMiddleware} = require('../controllers/auth')

router.post('/blog', requireSignin, adminMiddleware, create)

module.exports = router