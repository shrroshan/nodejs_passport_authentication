const express = require('express')
const router = express.Router();
const User = require('../models/User')
const bcrypt = require('bcryptjs');
const passport = require('passport')
const { forwardAuthenticated } = require('../config/auth')

// Register
router.get('/register', (req, res) => {
    res.render('register')
})

// Register Handle
router.post('/register', async (req, res) =>  {
    let errors = [];
    const { name, email, password, password2 } = req.body;

    // Validate form
    // Check required fields
    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Please all in all fields' })
    } 

    //  Check password match
    if (password !== password2) {
        errors.push({ msg: 'Password do not match' })
    }

    // Check password length
    if (password.length < 6) {
        errors.push({ msg: 'Password should be minimum 6 characters' })
    }

    if (errors.length > 0) { // Error in form
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        })
    } else {// Pass Validation
        User.findOne({ email: email})
            .then(user => {
                if (user) { // User exists
                    errors.push({ msg: 'Email already exists' });
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        password2
                    });
                } else {
                    const newUser = new User({
                        name,
                        email,
                        password
                    });

                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw new err;
                            // Set password to hashed
                            newUser.password = hash;                            
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'You are now registered and can log in')
                                    res.redirect('/users/login')
                                })
                                .catch(err => console.log(err))
                        });
                    });
                }
            })
    }
})

// Login
router.get('/login', forwardAuthenticated, (req, res) => {
    res.render('login')
})

// Login Handle
router.post('/login', passport.authenticate('local', { failureRedirect: '/users/login', failureFlash: true }), (req, res, next) => {
        res.redirect('/dashboard');
    }
);

// Logout Handle
router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        req.flash('success_msg', 'You are successfully logged out');
        res.redirect('/users/login');
    })
})

module.exports = router;