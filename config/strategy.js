const LocalStrategy = require("passport-local");
const brcypt = require("bcryptjs");
const mongoose = require("mongoose");

// Load User model
const User = require("../models/User");

// Load User Model
const strategy = async (passport) => {
    passport.use(
        new LocalStrategy({ usernameField: 'email'}, (email, password, done) => {
            User.findOne({ email: email })
                .then(user => {
                    if (!user)
                        return done(null, false, { message: 'The email is not registered' });

                    brcypt.compare(password, user.password, (err, isValid) => {
                        if (err)
                            return done(err);

                        if (!isValid)
                            return done(null, false, { message: 'Password incorrect'});

                        return done(null, user);
                    })
                })
                .catch(err => console.log(err));
        })
    );

    passport.serializeUser(function(user, cb) {
        process.nextTick(function() {
            return cb(null, user);
        });
    });

    passport.deserializeUser(function(user, cb) {
        process.nextTick(function() {
            return cb(null, user);
        });
    });
};

// module.exports = strategy;
exports.strategy = strategy;