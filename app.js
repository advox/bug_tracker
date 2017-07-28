const express = require('express');
const path = require('path');
const logger = require('morgan');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const routes = require('./routes');
const app = express();
const passport = require('passport');
const session = require('express-session');
const db = require('./bin/db');
const MongoStore = require('connect-mongo')(session);

app.use(cookieParser());

app.use(
    session({
        store: new MongoStore({
            mongooseConnection: db.connection,
            autoRemove: 'interval',
            autoRemoveInterval: 60
        }),
        resave: false,
        saveUninitialized: false,
        secret: 't0p_53cr3t',
    })
);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(passport.initialize());

app.use(passport.session());

app.use(function(req, res, next) {
    // if(req.url !== '/login') {
    //     if(typeof req.user === 'undefined') {
    //         res.redirect('/login');
    //         return;
    //     }
    //     
    //     if(req.url.indexOf('/user') === 0) {
    //         if(!req.user.userManagement) {
    //             res.redirect('/');
    //             return;
    //         }
    //     }
    // }
    // 
    // if(typeof req.user !== 'undefined') {
    //     req.app.locals.loggedUser = { name : req.user.name, userManagement: req.user.userManagement };
    // } 
    // 
    res.setHeader('content-type', 'text/javascript');

    next();
});

app.use('/', routes);

module.exports = app;
