const express = require('express')
const router = express.Router();
const { isAuthenticated, forwardAuthenticated } = require('../config/auth')
 
router.get('/', forwardAuthenticated, (req, res, next) => {
    res.render('welcome')
})

router.get('/dashboard', isAuthenticated, (req, res, next) => {
    res.render('dashboard', {
        name: req.user.name
    });
})

module.exports = router;