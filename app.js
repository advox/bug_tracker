const express = require('express');
// const path = require('path');
const logger = require('morgan');
// const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const routes = require('./routes');
const app = express();
const session = require('express-session');
const Session = require('./models/session');
// const db = require('./bin/db');
// const MongoStore = require('connect-mongo')(session);

app.use(cookieParser());

// app.use(
//     session({
//         store: new MongoStore({
//             mongooseConnection: db.connection,
//             autoRemove: 'interval',
//             autoRemoveInterval: 60
//         }),
//         resave: false,
//         saveUninitialized: false,
//         secret: 't0p_53cr3t',
//     })
// );
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authentication-Token, X-Requested-With");
    res.setHeader('content-type', 'text/javascript');

    if(req.method === 'OPTIONS') {
        next();
    }

    if (req.url !== '/session') {
        let token = req.header('Authentication-Token');

        if (typeof token === 'undefined' || !Session.isTokenValid()) {
            res.statusCode = 401;
            res.send({
                error_code: 'authenticated_failure',
                error: 'User not logged in'
            });
            return;
        }
    }

    next();
});

app.use('/', routes);

module.exports = app;
