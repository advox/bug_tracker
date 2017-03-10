const express = require('express');
const router = express.Router();
const passport = require('passport');
const db = require("../bin/db");
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(new LocalStrategy(
    function(username, password, done) {
        User.findOne({login: username }, function (err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            if (user.password !== password) { return done(null, false); }
            return done(null, user);
        });
    }
));

router.get('/', (req, res) => {
    res.render('security/login')
});

router.post('/login', passport.authenticate('local', { failureRedirect: '/fail' }), (req, res) => {
    res.redirect('/task');
});


module.exports = router;