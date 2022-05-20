const express = require('express')
const router = express.Router()
const {profile} = require('./../controllers/user')

const {requireSignin, authMiddleware, adminMiddleware} = require('../controllers/auth')
const {read} = require('../controllers/user')


router.get('/profile', requireSignin, adminMiddleware, read)

module.exports = router