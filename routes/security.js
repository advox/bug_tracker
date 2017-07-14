const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const md5 = require('md5');

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

passport.use(new LocalStrategy(
        function (username, password, done) {
            User.findOne({login: username}, function (err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false);
                }
                if (user.password !== md5(password)) {
                    return done(null, false);
                }
                return done(null, user);
            });
        }
));

router.get('/', (req, res) => {
    res.redirect('/task');
});

router.get('/login', (req, res) => {
    res.render('security/login');
});

router.post('/login', passport.authenticate('local', {failureRedirect: '/'}), (req, res) => {
    req.app.locals.loggedUser = { name : req.user.name, userManagement: req.user.userManagement };
    res.redirect('/task');
});

router.get('/logout', (req, res) => {
    req.session.destroy(function (err) {
        delete req.app.locals.loggedUser;
        res.redirect('/');
    });
});

module.exports = router;
