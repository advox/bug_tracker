const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const md5 = require('md5');

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
    if (req.user !== undefined) {
        res.redirect('/task');
    } else {
        res.render('security/login');
    }
});

router.post('/login', passport.authenticate('local', { failureRedirect: '/fail' }), (req, res) => {
    res.locals.loggedUser = req.user;
    res.redirect('/task');
});

router.get('/logout', (req, res) => {
    req.session.destroy(function (err) {
        delete res.locals.loggedUser;
        res.redirect('/');
    });
});

module.exports = router;
