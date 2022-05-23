const express = require('express')
const router = express.Router()
const {create, list, read, remove} = require('./../controllers/tag')

// validators
const {runValidation} = require('../validators')
const {tagCreateValidator} = require('../validators/tag')

const {requireSignin, adminMiddleware} = require('../controllers/auth')


router.post('/tag', requireSignin, adminMiddleware, tagCreateValidator, runValidation, create)
router.get('/tag', list)
router.get('/tag/:slug', read)
router.delete('/tag/:slug', requireSignin, adminMiddleware, remove)

module.exports = router