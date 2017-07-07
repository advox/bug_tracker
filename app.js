const express = require('express');
const path = require('path');
const logger = require('morgan');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const routes = require('./routes');
const app = express();
const passport = require('passport');
const hbs = require('./app/handlebars');
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
        secret: '53cr3t',
    })
);
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs.engine);

app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(flash());

app.use(passport.session());

app.use('/', routes);
app.use(function (req, res, next) {
    app.locals.loggedUser = req.user;

    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
});


module.exports = app;
