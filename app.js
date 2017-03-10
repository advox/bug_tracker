const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const routes = require('./routes');
const app = express();
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './upload');
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now());
    }
});
const upload = multer({ storage : storage }).array('files', 5);

app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
const passport = require('passport');

app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
