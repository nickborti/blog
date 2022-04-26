const User = require('../models/user')
const shortId = require('shortid')
const jwtToken = require('jsonwebtoken')
const { expressjwt: jwt } = require('express-jwt')

exports.signup = (req, res) => {
   User.findOne({email: req.body.email}).exec((err, user) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }

        if(user) {
            return res.status(400).json({
                error: 'Email exists'
            })
        }
    
        const {name, email, password} = req.body
        let username = shortId.generate()
        let profile = `${process.env.CLIENT_URL}/profile/${username}`

        let newUser = new User({name, email, password, profile, username})
        newUser.save((err, success) => {
            if (err) {
                return res.status(400).json({
                    error: err
                })
            }

            res.json({
                message: 'Signup success.'
            })
        })

   })
}

exports.signin = (req, res) => {
    const {email, password} = req.body
    User.findOne({email}).exec((err, user) => {
        if(err || !user) {
            return res.status(400).json({
                error: 'User not found. Please signup'
            })
        }

        // check hashed password and stored password is same 
        if(!user.authenticate(password)) {
            return res.status(400).json({
                error: 'Email & Password not matching!'
            })
        }

        // generate token
        const token = jwtToken.sign({_id: user._id}, process.env.JWT_SECRET, {expiresIn: '1d'})

        // saving in cookie
        res.cookie('token', token, {expiresIn: '1d'})
        const {_id, username, email, name, role} = user;
        
        return res.json({
            token, 
            user: {_id, username, email, name, role}
        })
    })
}

exports.signout = (req, res) => {
    res.clearCookie('token')
    res.json({
        message: 'Signout success'
    })
}

exports.requireSignin = jwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
    userProperty: "auth",
})
