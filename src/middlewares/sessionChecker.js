const session = require('express-session')
const cookieParser = require('cookie-parser')
const User = require('../models/user')


var sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        res.redirect('/dashboard');
    } else {
        next();
    }    
}

module.exports = sessionChecker