// imports
require('dotenv').config();
const express = require('express')
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport')
const path = require('path')
const flash = require('connect-flash')
const session = require('express-session')

const app = express();

// Passport config
// For module.exports
// const passport_strategy = require('./config/passport')
// passport_strategy(passport);
// For exports.{function_name}
const passport_strategy = require('./config/strategy')
passport_strategy.strategy(passport);

// Static Files
app.use(express.static(path.join(__dirname, 'public'))) 

// EJS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', 'layouts/main');
app.use(expressLayouts);

// Express Bodyparser
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

// Middlewares
// Express Session Middlwares
app.use(session({
    secret: 'nodejs application',
    resave: true,
    saveUninitialized: true
}))

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Create globals
// Global Variables valid for entire application
app.locals.appTitle = "Node & Passport Application";
// Set or send local variables to client side html/view and it is only available in that view/html only.
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// Routes
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))

// Define application port
const PORT = process.env.PORT || 5000;

// Connect mongooseDB
const connectToDB= async() => {
    try {
        await mongoose.connect(process.env.DB_URI);

        app.listen(PORT, () => {
            console.log(`Server started at http://localhost:${PORT}`)
        });
    } catch(err) {
        console.log(err);
        process.exit(1);
    }
}

connectToDB();