const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const user = require('../models/user');
const app = express();

router.get('/', (req, res) => {
    res.render('security/login')
});

app.post('/login', passport.authenticate('local', { failureRedirect: '/' }), (req, res) => {
    res.redirect('/');
});

router.post('/login2', (req, res) => {
    console.log(req.body);
    res.render('security/login2');
});

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(new LocalStrategy(
    function(username, password, done) {
        user.findOne({ username: username }, function (err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            if (user.password !== password) { return done(null, false); }
            return done(null, user);
        });
    }
));

module.exports = router;